import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
} from '../controllers/productController';
import {
  validateBody,
  validateParams,
  createProductSchema,
  updateProductSchema,
} from '../middleware/validation';
import { z } from 'zod';

const router = express.Router();

// Schema para validar ID de MongoDB
const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido'),
});

// GET /api/products - Obtener todos los productos activos
router.get('/', getAllProducts);

// GET /api/products/:id - Obtener producto por ID
router.get(
  '/:id',
  validateParams(mongoIdSchema),
  getProductById
);

// POST /api/products - Crear nuevo producto
router.post(
  '/',
  validateBody(createProductSchema),
  createProduct
);

// PUT /api/products/:id - Actualizar producto
router.put(
  '/:id',
  validateParams(mongoIdSchema),
  validateBody(updateProductSchema),
  updateProduct
);

// DELETE /api/products/:id - Desactivar producto
router.delete(
  '/:id',
  validateParams(mongoIdSchema),
  deactivateProduct
);

export default router;