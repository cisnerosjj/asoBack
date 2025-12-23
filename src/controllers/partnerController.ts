import { Request, Response } from 'express';
import { Partner } from '../models/Partner';
import { sendResponse, sendError, catchAsync } from '../utils/apiResponse';

// Buscar socios (con autocomplete)
export const searchPartners = catchAsync(async (req: Request, res: Response) => {
  const { search } = req.query;
  
  if (!search || typeof search !== 'string') {
    return sendError(res, 400, 'Parámetro de búsqueda requerido');
  }

  // Búsqueda por nombre con regex (case-insensitive)
  const partners = await Partner.find({
    name: { $regex: search, $options: 'i' },
    active: true,
  })
    .select('_id name email')
    .limit(10)
    .sort({ name: 1 });

  sendResponse(res, 200, 'Socios encontrados', partners);
});

// Obtener todos los socios
export const getAllPartners = catchAsync(async (req: Request, res: Response) => {
  const partners = await Partner.find({ active: true })
    .select('_id name email createdAt')
    .sort({ name: 1 });

  sendResponse(res, 200, 'Lista de socios', partners);
});

// Obtener socio por ID
export const getPartnerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const partner = await Partner.findById(id);
  
  if (!partner) {
    return sendError(res, 404, 'Socio no encontrado');
  }

  sendResponse(res, 200, 'Socio encontrado', partner);
});

// Crear nuevo socio
export const createPartner = catchAsync(async (req: Request, res: Response) => {
  const partnerData = req.body;
  
  const newPartner = new Partner(partnerData);
  const savedPartner = await newPartner.save();

  sendResponse(res, 201, 'Socio creado exitosamente', savedPartner);
});

// Actualizar socio
export const updatePartner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedPartner = await Partner.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedPartner) {
    return sendError(res, 404, 'Socio no encontrado');
  }

  sendResponse(res, 200, 'Socio actualizado exitosamente', updatedPartner);
});

// Desactivar socio (soft delete)
export const deactivatePartner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const partner = await Partner.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );

  if (!partner) {
    return sendError(res, 404, 'Socio no encontrado');
  }

  sendResponse(res, 200, 'Socio desactivado exitosamente', partner);
});