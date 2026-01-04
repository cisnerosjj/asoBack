import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Employee } from '../models/Employee';
import { connectDB } from '../utils/database';

// Cargar variables de entorno
dotenv.config();

/**
 * Script para crear usuarios administradores de prueba
 * 
 * Ejecutar con: npm run create:admin
 */

async function createAdminUsers() {
  try {
    console.log('🔄 Iniciando creación de usuarios admin...');
    
    // Conectar a la base de datos
    await connectDB();
    console.log('✅ Conectado a la base de datos');

    // Usuario 1: Admin
    const adminData = {
      name: 'Administrador',
      username: 'admin',
      password: 'admin123',
      position: 'Administrador',
      role: 'admin' as const,
      active: true,
    };

    // Usuario 2: Super Admin
    const superAdminData = {
      name: 'Super Administrador',
      username: 'superadmin',
      password: 'super123',
      position: 'Super Administrador',
      role: 'super-admin' as const,
      active: true,
    };

    // Verificar si ya existe el usuario admin
    let adminUser = await Employee.findOne({ username: 'admin' });
    if (adminUser) {
      console.log('⚠️  Usuario "admin" ya existe, actualizando...');
      adminUser.name = adminData.name;
      adminUser.password = adminData.password;
      adminUser.position = adminData.position;
      adminUser.role = adminData.role;
      adminUser.active = adminData.active;
      await adminUser.save();
      console.log('✅ Usuario "admin" actualizado');
    } else {
      adminUser = await Employee.create(adminData);
      console.log('✅ Usuario "admin" creado');
    }

    // Verificar si ya existe el usuario superadmin
    let superAdminUser = await Employee.findOne({ username: 'superadmin' });
    if (superAdminUser) {
      console.log('⚠️  Usuario "superadmin" ya existe, actualizando...');
      superAdminUser.name = superAdminData.name;
      superAdminUser.password = superAdminData.password;
      superAdminUser.position = superAdminData.position;
      superAdminUser.role = superAdminData.role;
      superAdminUser.active = superAdminData.active;
      await superAdminUser.save();
      console.log('✅ Usuario "superadmin" actualizado');
    } else {
      superAdminUser = await Employee.create(superAdminData);
      console.log('✅ Usuario "superadmin" creado');
    }

    console.log('\n📋 Resumen de usuarios creados/actualizados:');
    console.log('\n1️⃣  Usuario Admin:');
    console.log(`   - Nombre: ${adminUser.name}`);
    console.log(`   - Username: admin`);
    console.log(`   - Password: admin123`);
    console.log(`   - Rol: ${adminUser.role}`);
    
    console.log('\n2️⃣  Usuario Super Admin:');
    console.log(`   - Nombre: ${superAdminUser.name}`);
    console.log(`   - Username: superadmin`);
    console.log(`   - Password: super123`);
    console.log(`   - Rol: ${superAdminUser.role}`);
    
    console.log('\n✅ ¡Proceso completado! Ahora puedes iniciar sesión con estos usuarios.\n');

  } catch (error) {
    console.error('❌ Error en la creación de usuarios:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Desconectado de la base de datos');
    process.exit(0);
  }
}

// Ejecutar script
createAdminUsers();
