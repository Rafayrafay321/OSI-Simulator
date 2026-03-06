import express from 'express';
import cors from 'cors';
import { Orchestrator } from './core/orchestrator';
import { Logger } from './core/Logger';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/simulate', (req, res) => {
  const { payload } = req.body;

  if (!payload) {
    return res.status(400).json({ error: 'Payload is required' });
  }

  const logger = new Logger();
  const orchestrator = new Orchestrator(logger);

  try {
    orchestrator.start(payload);
    const logs = logger.getLogs();
    res.json({ logs });
  } catch (error) {
    const logs = logger.getLogs();
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // Also include the logs that led up to the error
    res.status(500).json({ error: errorMessage, logs });
  }
});

app.listen(port, () => {
  console.log(`OSI Packet Simulator backend listening at http://localhost:${port}`);
});
