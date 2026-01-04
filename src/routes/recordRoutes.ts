import express from 'express';
import {
  createRecord,
  getAllRecords,
  getRecordsByPartner,
  getRecordById,
  getRecordStats,
} from '../controllers/recordController';
import {
  validateBody,
  validateParams,
  validateQuery,
  createRecordSchema,
  paginationSchema,
} from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

// Aplicar autenticación a todas las rutas de records
router.use(authenticate);

// Schema para validar ID de MongoDB
const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido'),
});

const partnerIdSchema = z.object({
  partnerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de socio inválido'),
});

// POST /api/records - Crear nuevo registro (funcionalidad principal)
router.post(
  '/',
  validateBody(createRecordSchema),
  createRecord
);

// GET /api/records - Obtener todos los registros con paginación
router.get(
  '/',
  validateQuery(paginationSchema),
  getAllRecords
);

// GET /api/records/stats - Obtener estadísticas de registros
router.get('/stats', getRecordStats);

// GET /api/records/partner/:partnerId - Obtener registros por socio
router.get(
  '/partner/:partnerId',
  validateParams(partnerIdSchema),
  validateQuery(paginationSchema),
  getRecordsByPartner
);

// GET /api/records/:id - Obtener registro por ID
router.get(
  '/:id',
  validateParams(mongoIdSchema),
  getRecordById
);

export default router;