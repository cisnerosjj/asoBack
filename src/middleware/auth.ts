import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiame';

// Interface para extender Request con datos de usuario
export interface AuthRequest extends Request {
  user?: {
    employeeId: string;
    username: string;
    name: string;
    role: 'admin' | 'super-admin';
  };
}

// Middleware para verificar JWT
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(errorResponse('Token no proporcionado'));
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      employeeId: string;
      username: string;
      name: string;
      role: 'admin' | 'super-admin';
    };

    // Añadir datos del empleado a la request
    (req as AuthRequest).user = decoded;

    next();
  } catch (error) {
    res.status(401).json(errorResponse('Token inválido o expirado'));
  }
};

// Middleware para verificar rol de super-admin
export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as AuthRequest).user;

  if (!user || user.role !== 'super-admin') {
    res.status(403).json(errorResponse('Acceso denegado. Se requiere rol de super-admin'));
    return;
  }

  next();
};

// Middleware para verificar rol de admin o superior
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as AuthRequest).user;

  if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
    res.status(403).json(errorResponse('Acceso denegado. Se requiere rol de administrador'));
    return;
  }

  next();
};
