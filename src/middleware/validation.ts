import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

// Schema para validar búsqueda de socios
export const searchPartnerSchema = z.object({
  search: z.string().min(1, 'El término de búsqueda es requerido').max(50),
});

// Schema para crear socio
export const createPartnerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  active: z.boolean().default(true),
});

// Schema para actualizar socio
export const updatePartnerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100).optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  active: z.boolean().optional(),
});

// Schema para crear producto
export const createProductSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  credits: z.number().min(0, 'Los créditos no pueden ser negativos').max(9999),
  active: z.boolean().default(true),
});

// Schema para actualizar producto
export const updateProductSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100).optional(),
  credits: z.number().min(0, 'Los créditos no pueden ser negativos').max(9999).optional(),
  active: z.boolean().optional(),
});

// Schema para crear registro (funcionalidad principal)
export const createRecordSchema = z.object({
  partner: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de socio inválido'),
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de producto inválido'),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0').max(1000),
});

// Schema para paginación
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(() => 1),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(() => 20),
});

// Middleware para validar query parameters
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        const errorMessages = result.error.issues.map(error => error.message);
        return sendError(res, 400, 'Parámetros de consulta inválidos', errorMessages);
      }
      
      // No podemos reasignar req.query directamente en Express 5+
      // En su lugar, validamos pero no modificamos
      next();
    } catch (error) {
      return sendError(res, 400, 'Error de validación', error);
    }
  };
};

// Middleware para validar body
export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessages = result.error.issues.map(error => ({
          field: error.path.join('.'),
          message: error.message,
        }));
        return sendError(res, 400, 'Datos de entrada inválidos', errorMessages);
      }
      
      req.body = result.data;
      next();
    } catch (error) {
      return sendError(res, 400, 'Error de validación', error);
    }
  };
};

// Middleware para validar parámetros de ruta
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);
      
      if (!result.success) {
        const errorMessages = result.error.issues.map(error => error.message);
        return sendError(res, 400, 'Parámetros de ruta inválidos', errorMessages);
      }
      
      req.params = result.data as any;
      next();
    } catch (error) {
      return sendError(res, 400, 'Error de validación', error);
    }
  };
};