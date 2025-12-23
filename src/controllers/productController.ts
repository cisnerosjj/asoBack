import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { sendResponse, sendError, catchAsync } from '../utils/apiResponse';

// Obtener todos los productos activos
export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await Product.find({ active: true })
    .select('_id name credits')
    .sort({ name: 1 });

  sendResponse(res, 200, 'Lista de productos', products);
});

// Obtener producto por ID
export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const product = await Product.findById(id);
  
  if (!product) {
    return sendError(res, 404, 'Producto no encontrado');
  }

  sendResponse(res, 200, 'Producto encontrado', product);
});

// Crear nuevo producto
export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const productData = req.body;
  
  const newProduct = new Product(productData);
  const savedProduct = await newProduct.save();

  sendResponse(res, 201, 'Producto creado exitosamente', savedProduct);
});

// Actualizar producto
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    return sendError(res, 404, 'Producto no encontrado');
  }

  sendResponse(res, 200, 'Producto actualizado exitosamente', updatedProduct);
});

// Desactivar producto (soft delete)
export const deactivateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );

  if (!product) {
    return sendError(res, 404, 'Producto no encontrado');
  }

  sendResponse(res, 200, 'Producto desactivado exitosamente', product);
});