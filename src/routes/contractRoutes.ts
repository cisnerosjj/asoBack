import { Router } from 'express';
import { getContract, updateContract } from '../controllers/contractController';

const router = Router();

// GET /api/contract - Obtener el contrato
router.get('/', getContract);

// PUT /api/contract - Actualizar el contrato completo
router.put('/', updateContract);

export default router;
