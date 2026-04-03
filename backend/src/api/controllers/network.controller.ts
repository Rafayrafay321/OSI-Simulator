import { Request, Response, NextFunction } from 'express';

// Custom Imports
import { Orchestrator } from '../../core/orchestrator';
import { AppError } from '../utils/AppError';

export const send = async (req: Request, res: Response, next: NextFunction) => {
  const { payload } = req.body;

  if (!payload) {
    return next(new AppError(400, 'Payload can not be empty.'));
  }
  const simulation = new Orchestrator();
  try {
    const logs = await simulation.runSimulation(payload);

    res.status(200).json({
      status: 'Success',
      message: 'Simulation ran successfully.',
      response: logs,
    });
    return;
  } catch (error) {
    return next(error);
  }
};
