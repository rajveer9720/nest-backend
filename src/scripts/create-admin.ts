import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function createAdminUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Check if admin user already exists
    const existingAdmin = await usersService.findByEmail('admin@speceal.com');
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      await app.close();
      return;
    }

    // Create admin user
    const adminUser = await usersService.create({
      username: 'admin',
      email: 'admin@speceal.com',
      password: 'admin123', // Change this in production
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@speceal.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }

  await app.close();
}

createAdminUser();
