import mongoose from 'mongoose';

// Configuración de la conexión a MongoDB
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/asoadmin';
    
    // Opciones de conexión optimizadas
    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(mongoURI, options);
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Log de eventos de conexión
    mongoose.connection.on('error', (error) => {
      console.error('❌ Error de MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

// Función para cerrar la conexión de DB (útil para testing)
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error);
  }
};