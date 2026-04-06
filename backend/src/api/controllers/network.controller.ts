import { Request, Response, NextFunction } from 'express';

// Custom Imports
import { Orchestrator } from '../../core/orchestrator';
import { AppError } from '../utils/AppError';

// Types
import type { simulationConfig } from '../../types';

export const send = async (req: Request, res: Response, next: NextFunction) => {
  const config = req.body as simulationConfig;

  if (!config) {
    return next(new AppError(400, 'Bad Request.'));
  }
  const simulation = new Orchestrator(config);
  try {
    const logs = await simulation.runSimulation(config);

    res.status(200).json({
      status: 'Success',
      message: 'Simulation ran successfully.',
      paylaod: logs.finalPayload,
      response: logs.logs,
    });
    return;
  } catch (error) {
    return next(error);
  }
};
