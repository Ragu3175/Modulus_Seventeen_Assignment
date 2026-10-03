import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: any;
  value?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;
  let statusCode = err.statusCode || 500;

  // Log error for developers
  console.error('[Error Details]:', err);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    statusCode = 404;
    error.message = message;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.errors || {})[0] || 'Field';
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    statusCode = 400;
    error.message = message;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((val: any) => val.message);
    const message = messages.join('. ');
    statusCode = 400;
    error.message = message;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    error.message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    error.message = 'Authentication token has expired';
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Internal Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
