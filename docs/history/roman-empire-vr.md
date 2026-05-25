# Progetto VR 3D – Antica Roma Immersiva

## Descrizione generale

Esperienza in realtà virtuale che ricostruisce l'Impero Romano in 3D per offrire un percorso formativo e immersivo. L'utente può esplorare ambienti storici ricostruiti (architetture, mercati, piazze), interagire con personaggi e oggetti e consultare contenuti informativi multimediali.

## Obiettivo

Trasformare lo studio della storia romana in un'esperienza interattiva e coinvolgente, permettendo agli utenti di «vivere» gli spazi e gli eventi dell'antica Roma invece di limitarne lo studio teorico.

## Colosseo

- Arena centrale con ricostruzione storicamente accurata.
- Scene di combattimento (ricostruite con finalità educativa, non gore).
- Spettatori animati sulle gradinate e audio realistico di folla.
- Illuminazione e atmosfera coerenti con l'epoca.
- Contenuti interattivi: pannelli informativi sugli spettacoli gladiatori.

## Foro Romano

- Ricostruzione del centro politico, sociale ed economico.
- Mercati con NPC (cittadini e commercianti) e animazioni ambientali.
- Figure politiche e templi con pannelli informativi interattivi.
- Interazioni con NPC per apprendere ruoli e funzioni civiche.

## Pantheon

- Ricostruzione architettonica della cupola e dell'oculo centrale.
- Simulazione dell'illuminazione naturale tramite l'oculo.
- Contenuti didattici sull'architettura e la religione romana.

## Personaggi storici (NPC)

Personaggi inseriti con ruolo narrativo e informativo:

- **Giulio Cesare**: guida narrativa sulle conquiste e la transizione alla tarda Repubblica.
- **Augusto**: introduce la nascita dell'Impero e la Pax Romana.
- **Nerone**: racconta eventi controversi come l'incendio di Roma (con approccio critico).
- **Traiano**: illustra il periodo di massima espansione dell'Impero.

## Sistema di interazione VR

- Movimento libero nello spazio (teletrasporto e locomozione libera configurabili).
- Interazione con oggetti e attivazione di contenuti informativi (audio/testo).
- Interazione dialogica limitata con NPC (scelte multiple informative).
- Punti di interesse interattivi con spiegazioni storiche e approfondimenti.

## Audio e atmosfera

- Riproduzione spaziale dei suoni ambientali (rumori di folla, mercati, combattimenti controllati).
- Musiche ambientali ispirate all'epoca e layering per transizioni dinamiche.
- Effetti sonori realistici per aumentare immersione e contesto educativo.

## Prossimi passi

- Definire lista di asset 3D prioritari (Colosseo, edifici del Foro, interne del Pantheon).
- Creare mockup di interazione VR e flussi utente (UX).
- Produzione audio: registrazioni e sound design spaziale.
- Sviluppo prototipo in engine VR (es. Unity/Unreal) e testing didattico.

## Asset 3D e audio (bozza)

Percorsi consigliati per il repository:

- `docs/art/assets/3d/` — modelli glTF/GLB, LOD e pacchetti compressi.
- `docs/art/assets/audio/` — file audio ambisonici, effetti mono/stereo, musiche.

Formati raccomandati:

- 3D: `.glb` / `.gltf` (Khronos glTF 2.0), supporto `.fbx` per scambio con artisti.
- Compressione: usare DRACO per mesh e KTX2 (Basis Universal) per texture quando possibile.
- Textures: fornire mappe `baseColor`, `normal`, `metallicRoughness`, `occlusion`, `emissive`.
- Audio: file WAV a 48 kHz, 24-bit per master; esportare versioni OGG/MP3 per web.
- Audio spaziale: ambisonic (B-format) per scene ambientali, mono/stereo per SFX.

Esempi di nomi file suggeriti:

- `colosseum_v1_LOD0.glb`, `colosseum_v1_LOD1.glb`
- `forum_markets_v1.glb`, `market_stall_01.glb`
- `npc_caesar_v1.glb`, `npc_augustus_v1.glb`
- `amb_crowd_1storder.wav` (ambisonic), `sfx_gladius_hit_mono.wav`, `music_theme_loop.ogg`

Budget e LOD:

- Colosseo: LOD0 ~ 50k–150k tris (desktop/standalone VR), LOD1 ~ 15k–40k, LOD2 ~ 2k–6k.
- Ambient scene (mercati/edifici): bilanciare dettagli e drawcalls, instanziazione di oggetti ripetuti.

Integrazione tecnica (breve):

- WebXR / three.js: usare `GLTFLoader` + `DRACOLoader` + `KTX2Loader`; gestire LOD e bounding boxes.
- Unity/Unreal: importare `.glb` o `.fbx`, impostare materiali PBR, creare LOD e navmesh per NPC.
- Audio: usare WebAudio/AudioWorklet o librerie come ResonanceAudio / Google Spatial Media per HRTF/ambisonic.

Licenze e metadata:

- Preferire asset con licenza libera o chiaramente documentata (CC-BY 4.0, dominio pubblico) e includere file `LICENSE` per asset esterni.
- Includere un file `metadata.json` per ogni asset con autore, fonte, licenza, dimensione e versione.

Checklist rapida per ogni asset:

- [ ] Nome conforme (snake_case), versione semantica nel nome o nel metadata.
- [ ] File .glb ottimizzato e, se necessario, sorgente .blend/.fbx.
- [ ] Texture in PBR pronte e compresste.
- [ ] File audio master + export per web + nota licenza.

