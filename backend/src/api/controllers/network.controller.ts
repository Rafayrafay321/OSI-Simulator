import { Request, Response, NextFunction } from 'express';

import { activeClients } from '../server';

// Custom Imports
import { Orchestrator } from '../../core/orchestrator';
import { AppError } from '../utils/AppError';

// Types
import type { LogEntry, simulationConfig } from '../../types';

export const send = async (req: Request, res: Response, next: NextFunction) => {
  const { config, socketId } = req.body;

  if (!config || !socketId) {
    return next(new AppError(400, 'Bad Request.'));
  }
  const clienSocket = activeClients.get(socketId);

  if (!clienSocket) {
    return next(new AppError(400, 'Bad Request.'));
  }
  const simulation = new Orchestrator(config);
  simulation.logger.on('Packet Dispatched', (data: LogEntry) => {
    clienSocket.send(JSON.stringify(data));
  });

  try {
    const response = await simulation.runSimulation(config);

    res.status(200).json({
      status: 'Success',
      message: 'Simulation ran successfully.',
      paylaod: response.finalPayload,
      packetSize: response.packetSize,
      logs: response.logs,
    });
    return;
  } catch (error) {
    return next(error);
  }
};
