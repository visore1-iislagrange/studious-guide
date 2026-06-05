import { createServer } from 'http'; // Native Node.js HTTP module
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 3000;

// 1. Create a standard HTTP server to handle the /healthz and /oculus/me routes
const server = createServer(async (req, res) => {
  try {
    // Parse the URL to handle paths and query parameters easily
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    // --- CORS Headers Configuration ---
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    // --- Handle Preflight OPTIONS requests ---
    if (req.method === 'OPTIONS') {
      res.writeHead(204, corsHeaders);
      return res.end();
    }

    // --- Healthcheck Route ---
    if (req.method === 'GET' && parsedUrl.pathname === '/healthz') {
      res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'OK', service: 'websocket-server' }));
    } 
    
    // --- Oculus SSO Route ---
    if (req.method === 'GET' && parsedUrl.pathname === '/oculus/me') {
      const oculusFragment = parsedUrl.searchParams.get('oculus_fragment');
      
      if (!oculusFragment) {
        res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing oculus_fragment parameter' }));
      }

      // 1. Base64 decode the "oculus_fragment" into a string
      const decodedStr = Buffer.from(oculusFragment, 'base64').toString('utf-8');
      
      // 2. Parse the string as a json & 3. Extract "code" and "org_scoped_id"
      const { code, org_scoped_id } = JSON.parse(decodedStr);
      console.log("code", code)
      console.log("org_scoped_id", org_scoped_id)

      if (!code || !org_scoped_id) {
        res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing code or org_scoped_id in oculus_fragment' }));
      }

      // 4. Execute POST to sso_authorize_code
      const graphAccessToken = process.env.OCULUS_GRAPH_ACCESS_TOKEN || '';
      console.log("graphAccessToken", graphAccessToken)
      const postUrl = `https://graph.oculus.com/sso_authorize_code?code=${encodeURIComponent(code)}&access_token=${encodeURIComponent(graphAccessToken)}&org_scoped_id=${encodeURIComponent(org_scoped_id)}`;
      console.log("postUrl", postUrl)
      
      const postResponse = await fetch(postUrl, { method: 'POST' });
      const postData = await postResponse.json();
      console.log("postData", postData)
      
      // Extract the resulting access token (oauth_token)
      const oauthToken = postData.oauth_token; 
      if (!oauthToken) {
        res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to obtain oauth_token from Oculus', details: postData }));
      }

      // 5. Execute GET to /me
      const getUrl = `https://graph.oculus.com/me?access_token=${encodeURIComponent(oauthToken)}&fields=id,alias`;
      console.log("getUrl", getUrl)
      const getResponse = await fetch(getUrl);
      const getData = await getResponse.json();
      console.log("getData", getData)

      // Return the /me response to the client
      res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(getData));
    }

    // Return 404 for any other HTTP requests that aren't routed or WebSocket upgrades
    res.writeHead(404, { ...corsHeaders, 'Content-Type': 'text/plain' });
    res.end('Not Found');

  } catch (err) {
    console.error('HTTP Request Error:', err);
    // Include CORS headers on error responses too, so the frontend can read the error
    res.writeHead(500, { 
      'Access-Control-Allow-Origin': '*', 
      'Content-Type': 'application/json' 
    });
    res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
  }
});

// 2. Attach the WebSocket server to share the exact same server instance
const wss = new WebSocketServer({ server });

// 3. Start listening dynamically
server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Server listening on port ' + PORT);
  console.log('   ↳ Healthcheck available at: http://0.0.0.0:' + PORT + '/healthz');
  console.log('   ↳ Oculus Auth available at: http://0.0.0.0:' + PORT + '/oculus/me');
  console.log('   ↳ WebSocket available at:   ws://0.0.0.0:' + PORT + '');
});

// --- Your existing WebSocket Logic (Unchanged) ---

wss.on('connection', (ws) => {
  // Generate a random hex color for this browser tab session
  console.log(`\x1b[30m\x1b[42m CONNECTED \x1b[0m`);

  if (wss.clients.size === 0) {
    console.warn("Warning: wss.clients is empty during CONNECTION");
  } else {
    console.warn("CONNECTION wss.clients.size: " + wss.clients.size);
  }

  ws.on('message', (message) => {
    if (wss.clients.size === 0) {
      console.warn("Warning: wss.clients is empty during MESSAGE");
    } else {
      console.warn("MESSAGE wss.clients.size: " + wss.clients.size);
    }
    try {
      // Parse the incoming string into a JSON object
      const packet = JSON.parse(message);
      console.log(`got event "${packet.event}" with data:`, packet.data);

      // Re-serialize the packet to broadcast to all open browser tabs
      const broadcastData = JSON.stringify({ event: packet.event, data: packet.data });

      wss.clients.forEach((client) => {
        console.log("trying to broadcast data to client in state: ", client.readyState);
        if (client.readyState === 1) { // 1 means OPEN
          client.send(broadcastData);
          console.log("broadcasted");
        }
      });
    } catch (err) {
      console.error('Failed to process message:', err);
    }
  });

  ws.on('close', () => {
    console.log(`\x1b[30m\x1b[41m DISCONNECTED \x1b[0m A client tab closed.`);
  });
});
