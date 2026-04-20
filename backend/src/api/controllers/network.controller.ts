import { Request, Response, NextFunction } from 'express';

import { activeClients } from '../server';
import { activeToplogies } from './topology.controller';

// Custom Imports
import { Orchestrator } from '../../core/orchestrator';
import { AppError } from '../utils/AppError';

// Types
import type { LogEntry } from '../../types';

export const send = async (req: Request, res: Response, next: NextFunction) => {
  const { config, socketId, topologyId } = req.body;

  if (!config || !socketId || !topologyId) {
    return next(new AppError(400, 'Bad Request.'));
  }
  const currentClienSocket = activeClients.get(socketId);

  if (!currentClienSocket) {
    return next(new AppError(404, 'Socket Connection Not Found'));
  }

  const currentTopology = activeToplogies.get(topologyId);

  if (!currentTopology) {
    return next(new AppError(404, 'Socket Connection Not Found'));
  }

  const simulation = new Orchestrator(config, currentTopology);
  simulation.logger.on('Packet Dispatched', (data: LogEntry) => {
    currentClienSocket.send(JSON.stringify(data));
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
