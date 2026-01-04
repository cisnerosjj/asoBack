import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Employee } from '../models';
import { sendResponse, sendError } from '../utils/apiResponse';

// Secret para JWT (en producción debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiame';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Interface para el payload del JWT
interface JWTPayload {
  employeeId: string;
  username: string;
  name: string;
  role: 'admin' | 'super-admin';
}

// Login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;

    console.log('🔐 Intento de login:', { username, passwordLength: password?.length });

    // Validar datos
    if (!username || !password) {
      console.log('❌ Faltan credenciales');
      sendError(res, 400, 'Usuario y contraseña son requeridos');
      return;
    }

    // Buscar empleado (incluir password)
    const employee = await Employee.findOne({ username, active: true }).select('+password');
    console.log('👤 Empleado encontrado:', employee ? 'Sí' : 'No');

    if (!employee) {
      console.log('❌ Empleado no encontrado o inactivo');
      sendError(res, 401, 'Credenciales inválidas');
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await employee.comparePassword(password);
    console.log('🔑 Contraseña válida:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Contraseña incorrecta');
      sendError(res, 401, 'Credenciales inválidas');
      return;
    }

    // Generar token JWT
    const payload: JWTPayload = {
      employeeId: employee._id.toString(),
      username: employee.username,
      name: employee.name,
      role: employee.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);

    console.log('✅ Login exitoso para:', username);

    // Responder con token y datos del empleado
    sendResponse(res, 200, 'Login exitoso', {
      token,
      user: {
        id: employee._id,
        username: employee.username,
        name: employee.name,
        role: employee.role,
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    next(error);
  }
};

// Obtener perfil del empleado autenticado
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId = (req as any).user?.employeeId;

    if (!employeeId) {
      sendError(res, 401, 'No autenticado');
      return;
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      sendError(res, 404, 'Empleado no encontrado');
      return;
    }

    sendResponse(res, 200, 'Perfil de empleado', {
      id: employee._id,
      username: employee.username,
      name: employee.name,
      position: employee.position,
      schedule: employee.schedule,
      role: employee.role,
    });

  } catch (error) {
    next(error);
  }
};
