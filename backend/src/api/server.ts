// Node Imports
import * as http from 'node:http';
import WebSocket from 'ws';

// Custom Imports
import app from '../app';
import { env } from '../config/env';

const PORT = env.PORT || 3001;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.send('Welcome to PacketForge!');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    ws.send('Hello from server');
  });

  ws.on('close', () => {
    console.log('Client disconnected');
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
