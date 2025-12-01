import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError,
  res: Response
) => {
  switch (error.code) {
    case 'P2002':
      return res.status(409).json({
        error: 'A record with this value already exists',
        field: error.meta?.target,
      });

    case 'P2025':
      return res.status(404).json({
        error: 'Record not found',
      });

    case 'P2003':
      return res.status(400).json({
        error: 'Invalid reference to related record',
      });

    default:
      return res.status(400).json({
        error: 'Database error',
        code: error.code,
      });
  }
};

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error, res);
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.message,
    });
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  const response: any = {
    error: message,
  };
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};
