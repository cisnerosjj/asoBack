import express from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Rutas públicas
router.post('/login', authController.login);

// Rutas protegidas
router.get('/profile', authenticate, authController.getProfile);

export default router;
