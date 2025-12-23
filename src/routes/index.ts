import express from 'express';
import partnerRoutes from './partnerRoutes';
import productRoutes from './productRoutes';
import recordRoutes from './recordRoutes';
import employeeRoutes from './employeeRoutes';
import authRoutes from './authRoutes';

const router = express.Router();

// Rutas principales de la API
router.use('/auth', authRoutes);
router.use('/partners', partnerRoutes);
router.use('/products', productRoutes);
router.use('/records', recordRoutes);
router.use('/employees', employeeRoutes);

// Ruta de salud de la API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;