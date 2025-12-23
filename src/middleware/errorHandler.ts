import { Request, Response, NextFunction } from 'express';
import { ApiError, sendError } from '../utils/apiResponse';

// Middleware para manejar errores de Mongoose
export const handleMongooseError = (error: any, req: Request, res: Response, next: NextFunction) => {
  let err = { ...error };
  err.message = error.message;

  // Error de validación de Mongoose
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map((val: any) => val.message).join(', ');
    err = new ApiError(message, 400);
  }

  // Error de duplicado (E11000)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const message = `${field} ya existe`;
    err = new ApiError(message, 400);
  }

  // Error de ObjectId inválido
  if (error.name === 'CastError') {
    const message = 'ID de recurso inválido';
    err = new ApiError(message, 404);
  }

  next(err);
};

// Middleware global de manejo de errores
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let err = error;

  // Si no es una instancia de ApiError, crear una
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Error interno del servidor';
    err = new ApiError(message, statusCode);
  }

  // Log del error (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error:', error);
  }

  sendError(res, err.statusCode, err.message, error);
};

// Middleware para rutas no encontradas
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const message = `Ruta no encontrada: ${req.originalUrl}`;
  const error = new ApiError(message, 404);
  next(error);
};