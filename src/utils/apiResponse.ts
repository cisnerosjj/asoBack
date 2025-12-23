import { Request, Response } from 'express';

// Clase personalizada para errores de API
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Respuesta estándar de API exitosa
export const sendResponse = (
  res: Response,
  statusCode: number = 200,
  message: string = 'Success',
  data: any = null
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// Respuesta estándar de error de API
export const sendError = (
  res: Response,
  statusCode: number = 500,
  message: string = 'Internal Server Error',
  error: any = null
) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && error && { error: error.message || error }),
    timestamp: new Date().toISOString(),
  });
};

// Funciones de respuesta simplificadas (alias)
export const successResponse = (data: any, message: string = 'Operación exitosa') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

export const errorResponse = (message: string, statusCode: number = 500) => {
  return {
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
};

// Handler de errores asíncronos para rutas
export const catchAsync = (fn: (req: Request, res: Response, next: Function) => Promise<any>) => {
  return (req: Request, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
};