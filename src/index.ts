import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/database';
import routes from './routes';
import { globalErrorHandler, notFoundHandler, handleMongooseError } from './middleware/errorHandler';

// Configurar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middlewares globales
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Rutas principales
app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'asoAdmin API - Dashboard La Cabaña',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      partners: '/api/partners',
      products: '/api/products',
      records: '/api/records',
    },
  });
});

// Middleware de manejo de errores de Mongoose
app.use(handleMongooseError);

// Middleware de ruta no encontrada
app.use(notFoundHandler);

// Middleware global de manejo de errores
app.use(globalErrorHandler);

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Puerto del servidor
    const PORT = process.env.PORT || 3001;

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

// Manejo de promesas rechazadas no capturadas
process.on('unhandledRejection', (err: any) => {
  console.error('❌ Promesa rechazada no manejada:', err.message);
  process.exit(1);
});

// Iniciar la aplicación
startServer();

export default app;