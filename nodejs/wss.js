import { createServer } from 'http'; // Native Node.js HTTP module
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 3000;

// 1. Create a standard HTTP server to handle the /healthz route
const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', service: 'websocket-server' }));
  } else {
    // Return 404 for any other HTTP requests that aren't WebSocket upgrades
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// 2. Attach the WebSocket server to share the exact same server instance
const wss = new WebSocketServer({ server });

// 3. Start listening on port 3000 and bind to 0.0.0.0
server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Server listening on port ' + PORT);
  console.log('   ↳ Healthcheck available at: http://0.0.0.0:' + PORT + '/healthz');
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
