import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { sendResponse, sendError } from '../utils/apiResponse';

// Secret para JWT (en producción debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiame';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Interface para el payload del JWT
interface JWTPayload {
  userId: string;
  username: string;
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

    // Buscar usuario (incluir password)
    const user = await User.findOne({ username, active: true }).select('+password');
    console.log('👤 Usuario encontrado:', user ? 'Sí' : 'No');

    if (!user) {
      console.log('❌ Usuario no encontrado o inactivo');
      sendError(res, 401, 'Credenciales inválidas');
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔑 Contraseña válida:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Contraseña incorrecta');
      sendError(res, 401, 'Credenciales inválidas');
      return;
    }

    // Generar token JWT
    const payload: JWTPayload = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);

    console.log('✅ Login exitoso para:', username);

    // Responder con token y datos del usuario
    sendResponse(res, 200, 'Login exitoso', {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    next(error);
  }
};

// Registrar nuevo usuario (solo super-admin puede hacerlo)
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password, role = 'admin' } = req.body;

    // Validar datos
    if (!username || !password) {
      sendError(res, 400, 'Usuario y contraseña son requeridos');
      return;
    }

    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      sendError(res, 400, 'El usuario ya existe');
      return;
    }

    // Crear nuevo usuario
    const user = await User.create({
      username,
      password,
      role,
    });

    sendResponse(res, 201, 'Usuario creado exitosamente', {
      id: user._id,
      username: user.username,
      role: user.role,
    });

  } catch (error) {
    next(error);
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      sendError(res, 401, 'No autenticado');
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      sendError(res, 404, 'Usuario no encontrado');
      return;
    }

    sendResponse(res, 200, 'Perfil de usuario', {
      id: user._id,
      username: user.username,
      role: user.role,
    });

  } catch (error) {
    next(error);
  }
};

// Obtener todos los usuarios (solo super-admin)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find({ active: true }).select('-password');
    sendResponse(res, 200, 'Lista de usuarios', users);
  } catch (error) {
    next(error);
  }
};

// Eliminar usuario (solo super-admin)
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!user) {
      sendError(res, 404, 'Usuario no encontrado');
      return;
    }

    sendResponse(res, 200, 'Usuario eliminado exitosamente', null);

  } catch (error) {
    next(error);
  }
};
