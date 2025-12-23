import { Router } from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from '../controllers/employeeController';

const router = Router();

// Rutas CRUD para empleados
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deactivateEmployee);

export default router;
