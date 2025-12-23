import mongoose from 'mongoose';
import { Partner, Product, Employee, User } from '../models';

// Función para poblar la base de datos con datos de prueba
export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando seedeo de base de datos...');

    // Limpiar datos existentes (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await Promise.all([
        Partner.deleteMany({}),
        Product.deleteMany({}),
        Employee.deleteMany({}),
        User.deleteMany({}),
      ]);
      console.log('🧹 Base de datos limpiada');
    }

    // Crear usuarios admin (uno por uno para que se ejecute el hook de bcrypt)
    const adminUser = await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin',
    });

    const superAdminUser = await User.create({
      username: 'superadmin',
      password: 'super123',
      role: 'super-admin',
    });

    console.log(`✅ Creados 2 usuarios (admin: admin/admin123, superadmin: superadmin/super123)`);

    // Crear 20 socios de prueba
    const partnerTypes = ['Regular', 'VIP', 'Empresa', 'Familiar'];
    const partners = await Partner.insertMany([
      { name: 'María González', email: 'maria.gonzalez@email.com', type: 'VIP', active: true },
      { name: 'Juan Pérez', email: 'juan.perez@email.com', type: 'Regular', active: true },
      { name: 'Ana Martínez', email: 'ana.martinez@email.com', type: 'Regular', active: true },
      { name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', type: 'Empresa', active: true },
      { name: 'Laura Fernández', email: 'laura.fernandez@email.com', type: 'VIP', active: true },
      { name: 'Diego Silva', type: 'Regular', active: true },
      { name: 'Patricia López', email: 'patricia.lopez@email.com', type: 'Familiar', active: true },
      { name: 'Roberto García', type: 'Regular', active: true },
      { name: 'Carmen Ruiz', email: 'carmen.ruiz@email.com', type: 'VIP', active: true },
      { name: 'Miguel Sánchez', email: 'miguel.sanchez@email.com', type: 'Regular', active: true },
      { name: 'Isabel Torres', email: 'isabel.torres@email.com', type: 'Empresa', active: true },
      { name: 'Francisco Jiménez', type: 'Regular', active: true },
      { name: 'Elena Moreno', email: 'elena.moreno@email.com', type: 'Familiar', active: true },
      { name: 'Javier Álvarez', email: 'javier.alvarez@email.com', type: 'VIP', active: true },
      { name: 'Rosa Romero', type: 'Regular', active: true },
      { name: 'Antonio Navarro', email: 'antonio.navarro@email.com', type: 'Regular', active: true },
      { name: 'Lucía Serrano', email: 'lucia.serrano@email.com', type: 'Familiar', active: true },
      { name: 'Pedro Blanco', email: 'pedro.blanco@email.com', type: 'Empresa', active: true },
      { name: 'Marta Suárez', type: 'VIP', active: true },
      { name: 'Raúl Castro', email: 'raul.castro@email.com', type: 'Regular', active: true },
    ]);

    console.log(`✅ Creados ${partners.length} socios`);

    // Crear 5 productos de prueba
    const products = await Product.insertMany([
      { name: 'Almuerzo Completo', credits: 150, active: true },
      { name: 'Desayuno', credits: 80, active: true },
      { name: 'Cena', credits: 120, active: true },
      { name: 'Merienda', credits: 60, active: true },
      { name: 'Bebida', credits: 30, active: true },
    ]);

    console.log(`✅ Creados ${products.length} productos`);

    // Crear 2 empleados de prueba
    const employees = await Employee.insertMany([
      { name: 'Andrea Morales', position: 'Gerente', schedule: 'Lunes a Viernes 8:00-17:00', active: true },
      { name: 'José Herrera', position: 'Cocinero', schedule: 'Lunes a Sábado 6:00-14:00', active: true },
    ]);

    console.log(`✅ Creados ${employees.length} empleados`);
    console.log('🎉 Seedeo completado exitosamente!');

  } catch (error) {
    console.error('❌ Error durante el seedeo:', error);
    throw error;
  }
};