import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { sendResponse, sendError, catchAsync } from '../utils/apiResponse';

// Obtener todos los empleados
export const getAllEmployees = catchAsync(async (req: Request, res: Response) => {
  const employees = await Employee.find({ active: true })
    .select('_id name position schedule createdAt')
    .sort({ name: 1 });

  sendResponse(res, 200, 'Lista de empleados', employees);
});

// Obtener empleado por ID
export const getEmployeeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const employee = await Employee.findById(id);
  
  if (!employee) {
    return sendError(res, 404, 'Empleado no encontrado');
  }

  sendResponse(res, 200, 'Empleado encontrado', employee);
});

// Crear nuevo empleado
export const createEmployee = catchAsync(async (req: Request, res: Response) => {
  const employeeData = req.body;
  
  const newEmployee = new Employee(employeeData);
  const savedEmployee = await newEmployee.save();

  sendResponse(res, 201, 'Empleado creado exitosamente', savedEmployee);
});

// Actualizar empleado
export const updateEmployee = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedEmployee = await Employee.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedEmployee) {
    return sendError(res, 404, 'Empleado no encontrado');
  }

  sendResponse(res, 200, 'Empleado actualizado exitosamente', updatedEmployee);
});

// Desactivar empleado (soft delete)
export const deactivateEmployee = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const employee = await Employee.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );

  if (!employee) {
    return sendError(res, 404, 'Empleado no encontrado');
  }

  sendResponse(res, 200, 'Empleado desactivado exitosamente', employee);
});
