import { Request, Response } from 'express';
import { sendResponse, sendError } from '../utils/apiResponse';
import fs from 'fs/promises';
import path from 'path';

// Ruta al archivo JSON en el frontend (carpeta public)
const CONTRACT_FILE_PATH = path.resolve(__dirname, '../../..', 'frontend/public/contract.json');

console.log('📂 Ruta del contrato:', CONTRACT_FILE_PATH);

// Obtener el contrato
export const getContract = async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(CONTRACT_FILE_PATH, 'utf-8');
    const contract = JSON.parse(data);
    console.log('📥 Contrato leído desde archivo');
    sendResponse(res, 200, 'Contrato obtenido exitosamente', contract);
  } catch (error) {
    console.error('❌ Error al leer contrato:', error);
    sendError(res, 500, 'Error al obtener el contrato', error);
  }
};

// Actualizar el contrato completo
export const updateContract = async (req: Request, res: Response) => {
  try {
    const contractData = req.body;
    
    // Leer versión actual
    const currentData = await fs.readFile(CONTRACT_FILE_PATH, 'utf-8');
    const currentContract = JSON.parse(currentData);
    
    // Incrementar versión
    contractData.version = (currentContract.version || 0) + 1;
    contractData.lastModified = new Date().toISOString();
    
    console.log('💾 Guardando contrato versión:', contractData.version);
    
    // Guardar en archivo
    await fs.writeFile(CONTRACT_FILE_PATH, JSON.stringify(contractData, null, 2), 'utf-8');
    
    console.log('✅ Contrato guardado exitosamente');
    
    sendResponse(res, 200, 'Contrato actualizado exitosamente', contractData);
  } catch (error) {
    console.error('❌ Error al actualizar contrato:', error);
    sendError(res, 500, 'Error al actualizar el contrato', error);
  }
};
