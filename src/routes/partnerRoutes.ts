import express from 'express';
import {
  searchPartners,
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deactivatePartner,
} from '../controllers/partnerController';
import {
  validateQuery,
  validateBody,
  validateParams,
  searchPartnerSchema,
  createPartnerSchema,
  updatePartnerSchema,
} from '../middleware/validation';
import { z } from 'zod';

const router = express.Router();

// Schema para validar ID de MongoDB
const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido'),
});

// GET /api/partners?search=término - Buscar socios (autocomplete)
router.get(
  '/',
  validateQuery(searchPartnerSchema.partial()),
  (req, res, next) => {
    // Si hay parámetro search, usar searchPartners, sino getAllPartners
    if (req.query.search) {
      searchPartners(req, res, next);
    } else {
      getAllPartners(req, res, next);
    }
  }
);

// GET /api/partners/:id - Obtener socio por ID
router.get(
  '/:id',
  validateParams(mongoIdSchema),
  getPartnerById
);

// POST /api/partners - Crear nuevo socio
router.post(
  '/',
  validateBody(createPartnerSchema),
  createPartner
);

// PUT /api/partners/:id - Actualizar socio
router.put(
  '/:id',
  validateParams(mongoIdSchema),
  validateBody(updatePartnerSchema),
  updatePartner
);

// DELETE /api/partners/:id - Desactivar socio
router.delete(
  '/:id',
  validateParams(mongoIdSchema),
  deactivatePartner
);

export default router;