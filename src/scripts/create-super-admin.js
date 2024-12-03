require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const superAdmin = await Admin.create({
      email: 'admin@example.com',
      passwordHash: 'admin123', // Will be hashed by the model middleware
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      permissions: [
        'MANAGE_MENU',
        'MANAGE_ORDERS',
        'MANAGE_STAFF',
        'VIEW_ANALYTICS',
        'MANAGE_SETTINGS',
      ],
    });

    logger.info(`Super admin created with ID: ${superAdmin._id}`);
    process.exit(0);
  } catch (error) {
    logger.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
