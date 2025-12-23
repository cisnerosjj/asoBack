import dotenv from 'dotenv';
import { connectDB } from './utils/database';
import { seedDatabase } from './utils/seed';

// Configurar variables de entorno
dotenv.config();

const runSeed = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Ejecutar el seedeo
    await seedDatabase();
    
    console.log('✅ Proceso de seedeo completado');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error durante el seedeo:', error);
    process.exit(1);
  }
};

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  runSeed();
}