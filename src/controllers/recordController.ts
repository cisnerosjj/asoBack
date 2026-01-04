import { Request, Response } from 'express';
import { Record } from '../models/Record';
import { Product } from '../models/Product';
import { Partner } from '../models/Partner';
import { Employee } from '../models/Employee';
import { sendResponse, sendError, catchAsync } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

// Crear nuevo registro (funcionalidad principal del formulario)
export const createRecord = catchAsync(async (req: Request, res: Response) => {
  const { partner: partnerId, product: productId, quantity } = req.body;
  const employeeId = (req as AuthRequest).user?.employeeId;

  // Validar que haya un empleado autenticado
  if (!employeeId) {
    return sendError(res, 401, 'No autenticado');
  }

  // Validar que el empleado existe y está activo
  const employee = await Employee.findOne({ _id: employeeId, active: true });
  if (!employee) {
    return sendError(res, 404, 'Empleado no encontrado o inactivo');
  }

  // Validar que el socio existe y está activo
  const partner = await Partner.findOne({ _id: partnerId, active: true });
  if (!partner) {
    return sendError(res, 404, 'Socio no encontrado o inactivo');
  }

  // Validar que el producto existe y está activo
  const product = await Product.findOne({ _id: productId, active: true });
  if (!product) {
    return sendError(res, 404, 'Producto no encontrado o inactivo');
  }

  // Calcular créditos totales
  const totalCredits = product.credits * quantity;

  // Crear el registro
  const recordData = {
    partner: partnerId,
    partnerName: partner.name,
    product: productId,
    productName: product.name,
    employee: employeeId,
    employeeName: employee.name,
    quantity,
    totalCredits,
  };

  const newRecord = new Record(recordData);
  const savedRecord = await newRecord.save();

  // Popular los datos relacionados para la respuesta
  const populatedRecord = await Record.findById(savedRecord._id)
    .populate('partner', 'name email')
    .populate('product', 'name credits')
    .populate('employee', 'name username');

  sendResponse(res, 201, 'Registro creado exitosamente', populatedRecord);
});

// Obtener todos los registros con paginación
export const getAllRecords = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  // Filtro por fecha (opcional)
  const dateFilter = req.query.date as string;
  let query: any = {};

  if (dateFilter) {
    const startDate = new Date(dateFilter);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dateFilter);
    endDate.setHours(23, 59, 59, 999);
    
    query.createdAt = {
      $gte: startDate,
      $lte: endDate
    };
  }

  const records = await Record.find(query)
    .populate('partner', 'name email')
    .populate('product', 'name credits')
    .populate('employee', 'name username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Record.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  const response = {
    records,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords: total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };

  sendResponse(res, 200, 'Lista de registros', response);
});

// Obtener registros por socio
export const getRecordsByPartner = catchAsync(async (req: Request, res: Response) => {
  const { partnerId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const records = await Record.find({ partner: partnerId })
    .populate('partner', 'name email')
    .populate('product', 'name credits')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Record.countDocuments({ partner: partnerId });
  const totalPages = Math.ceil(total / limit);

  const response = {
    records,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords: total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };

  sendResponse(res, 200, 'Registros del socio', response);
});

// Obtener registro por ID
export const getRecordById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const record = await Record.findById(id)
    .populate('partner', 'name email')
    .populate('product', 'name credits');
  
  if (!record) {
    return sendError(res, 404, 'Registro no encontrado');
  }

  sendResponse(res, 200, 'Registro encontrado', record);
});

// Estadísticas básicas de registros
export const getRecordStats = catchAsync(async (req: Request, res: Response) => {
  const totalRecords = await Record.countDocuments();
  const totalCredits = await Record.aggregate([
    { $group: { _id: null, total: { $sum: '$totalCredits' } } }
  ]);

  const topProducts = await Record.aggregate([
    {
      $group: {
        _id: '$product',
        totalQuantity: { $sum: '$quantity' },
        totalCredits: { $sum: '$totalCredits' },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        name: '$product.name',
        totalQuantity: 1,
        totalCredits: 1,
        count: 1
      }
    }
  ]);

  const stats = {
    totalRecords,
    totalCredits: totalCredits[0]?.total || 0,
    topProducts,
  };

  sendResponse(res, 200, 'Estadísticas de registros', stats);
});