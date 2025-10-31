import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn('Operational error:', { message: err.message, statusCode: err.statusCode });
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Unhandled errors
  logger.error('Unexpected error:', err);
  return res.status(500).json({
    error: 'Internal server error',
  });
};
