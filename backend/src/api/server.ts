// Node Imports
import * as http from 'node:http';
import WebSocket from 'ws';
import crypto from 'node:crypto';

// Custom Imports
import app from '../app';
import { env } from '../config/env';

const PORT = env.PORT || 3001;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

export const activeClients = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
  console.log('Client connected');

  const socketId = crypto.randomUUID();
  activeClients.set(socketId, ws);

  ws.send(JSON.stringify({ type: 'Connected', socketId: socketId }));

  ws.on('close', () => {
    console.log('Client disconnected');
    activeClients.delete(socketId);
  });
});

const startServer = () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is firing on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
