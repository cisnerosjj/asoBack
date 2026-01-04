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
      { name: 'María González', nickname: 'Mari', dni: '12345678A', email: 'maria.gonzalez@email.com', type: 'VIP', active: true },
      { name: 'Juan Pérez', dni: '23456789B', email: 'juan.perez@email.com', type: 'Regular', active: true },
      { name: 'Ana Martínez', nickname: 'Anita', dni: '34567890C', email: 'ana.martinez@email.com', type: 'Regular', active: true },
      { name: 'Carlos Rodríguez', passport: 'ABC123456', email: 'carlos.rodriguez@email.com', type: 'Empresa', active: true },
      { name: 'Laura Fernández', nickname: 'Lau', dni: '45678901D', email: 'laura.fernandez@email.com', type: 'VIP', active: true },
      { name: 'Diego Silva', dni: '56789012E', type: 'Regular', active: true },
      { name: 'Patricia López', nickname: 'Paty', dni: '67890123F', email: 'patricia.lopez@email.com', type: 'Familiar', active: true },
      { name: 'Roberto García', dni: '78901234G', type: 'Regular', active: true },
      { name: 'Carmen Ruiz', nickname: 'Carmi', dni: '89012345H', email: 'carmen.ruiz@email.com', type: 'VIP', active: true },
      { name: 'Miguel Sánchez', dni: '90123456I', email: 'miguel.sanchez@email.com', type: 'Regular', active: true },
      { name: 'Isabel Torres', passport: 'DEF789012', email: 'isabel.torres@email.com', type: 'Empresa', active: true },
      { name: 'Francisco Jiménez', nickname: 'Paco', dni: '01234567J', type: 'Regular', active: true },
      { name: 'Elena Moreno', dni: '11234567K', email: 'elena.moreno@email.com', type: 'Familiar', active: true },
      { name: 'Javier Álvarez', nickname: 'Javi', dni: '21234567L', email: 'javier.alvarez@email.com', type: 'VIP', active: true },
      { name: 'Rosa Romero', dni: '31234567M', type: 'Regular', active: true },
      { name: 'Antonio Navarro', nickname: 'Toño', dni: '41234567N', email: 'antonio.navarro@email.com', type: 'Regular', active: true },
      { name: 'Lucía Serrano', dni: '51234567O', email: 'lucia.serrano@email.com', type: 'Familiar', active: true },
      { name: 'Pedro Blanco', passport: 'GHI345678', email: 'pedro.blanco@email.com', type: 'Empresa', active: true },
      { name: 'Marta Suárez', nickname: 'Martita', dni: '61234567P', type: 'VIP', active: true },
      { name: 'Raúl Castro', dni: '71234567Q', email: 'raul.castro@email.com', type: 'Regular', active: true },
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