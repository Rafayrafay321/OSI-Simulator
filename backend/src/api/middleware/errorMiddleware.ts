import { Request, Response, NextFunction } from 'express';

// Custom imports
import { AppError } from '../utils/AppError';
import { env } from '../../config/env';

export const globalErrorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = (err as AppError).statusCode || 500;
  const status = (err as AppError).status || 'error';
  const message = (err as AppError).message || 'Something went wrong!';

  res.status(statusCode).json({
    status,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
