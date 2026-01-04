import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { connectDB } from '../utils/database';
import dotenv from 'dotenv';

dotenv.config();

// Productos basados en productsMock.ts del frontend
const productsToSeed = [
  // Medicinas
  { name: 'Chocolate 7%', credits: 7 },
  { name: 'Chocolate 15%', credits: 15 },
  { name: 'Perejil 1g', credits: 10 },
  { name: 'Perejil 2g', credits: 18 },
  { name: 'Perejil 3g', credits: 25 },
  { name: 'Perejil 4g', credits: 30 },
  { name: 'Perejil 5g', credits: 35 },
  
  // Edibles
  { name: 'Fanta', credits: 10 },
  { name: 'Sprite', credits: 10 },
  { name: 'Coca Cola', credits: 10 },
  { name: 'Pepsi', credits: 10 },
  { name: 'Dr Pepper', credits: 12 },
  { name: 'Mountain Dew', credits: 11 },
  { name: 'Red Bull', credits: 15 },
  { name: 'Monster Energy', credits: 15 },
  { name: 'Gatorade', credits: 8 },
  { name: 'Aquarius', credits: 8 },
  
  // No Orgánicos
  { name: 'Papel Plata', credits: 5 },
  { name: 'Boquilla Corta', credits: 2 },
  { name: 'Boquilla Larga', credits: 3 },
  { name: 'Filtros Papel', credits: 3 },
  { name: 'Grinder Pequeño', credits: 8 },
  { name: 'Grinder Grande', credits: 12 },
  { name: 'Encendedor', credits: 2 },
  { name: 'Papel de Liar', credits: 1 },
  { name: 'Papel OCB', credits: 2 },
  { name: 'Blunt Wrap', credits: 5 },
];

const seedProducts = async () => {
  try {
    console.log('🌱 Conectando a la base de datos...');
    await connectDB();

    console.log('🗑️  Limpiando productos existentes...');
    await Product.deleteMany({});

    console.log('📦 Insertando productos...');
    const createdProducts = await Product.insertMany(productsToSeed);

    console.log(`✅ ${createdProducts.length} productos creados exitosamente:`);
    createdProducts.forEach(product => {
      console.log(`   - ${product.name} (${product.credits} créditos) - ID: ${product._id}`);
    });

    console.log('\n✨ Seed de productos completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed de productos:', error);
    process.exit(1);
  }
};

// Ejecutar seed
seedProducts();
