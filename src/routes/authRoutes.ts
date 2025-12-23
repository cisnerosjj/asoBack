import express from 'express';
import * as authController from '../controllers/authController';
import { authenticate, requireSuperAdmin } from '../middleware/auth';

const router = express.Router();

// Rutas públicas
router.post('/login', authController.login);

// Rutas protegidas
router.get('/profile', authenticate, authController.getProfile);

// Rutas solo para super-admin
router.post('/register', authenticate, requireSuperAdmin, authController.register);
router.get('/users', authenticate, requireSuperAdmin, authController.getAllUsers);
router.delete('/users/:id', authenticate, requireSuperAdmin, authController.deleteUser);

export default router;
