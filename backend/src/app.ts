// Node imports
import express from 'express';
import cors from 'cors';

// Types
import { Request, Response } from 'express';
import { Orchestrator } from './core/orchestrator';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/simulate', (req: Request, res: Response) => {
  const orchestrator = new Orchestrator();
  orchestrator.runSimulation();
  const logs = orchestrator.getLogs();

  res.status(200).json({
    message: 'Simulation successful',
    logs: logs,
  });
});

app.listen(port, () => {
  console.log('Server is listening on port http://localhost:3001');
});
