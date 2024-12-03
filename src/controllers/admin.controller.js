const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Restaurant = require('../models/Restaurant');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../utils/errors');
const logger = require('../utils/logger');

const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role,
      restaurantId: admin.restaurantId,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (admin.status !== 'ACTIVE') {
      throw new UnauthorizedError('Account is not active');
    }

    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      throw new UnauthorizedError('Account is temporarily locked');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      await admin.incrementLoginAttempts();
      throw new UnauthorizedError('Invalid credentials');
    }

    // Reset login attempts on successful login
    await Admin.updateOne(
      { _id: admin._id },
      {
        $set: {
          loginAttempts: 0,
          lastLogin: new Date(),
        },
        $unset: { lockUntil: 1 },
      }
    );

    const token = generateToken(admin);

    res.json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          restaurantId: admin.restaurantId,
          permissions: admin.permissions,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createRestaurantAdmin = async (req, res, next) => {
  try {
    const { email, name, password, restaurantId, permissions } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new BadRequestError('Admin already exists with this email');
    }

    const admin = await Admin.create({
      email,
      name,
      passwordHash: password,
      role: 'RESTAURANT_ADMIN',
      restaurantId,
      permissions,
    });

    logger.info(
      `Restaurant admin created: ${admin._id} for restaurant: ${restaurantId}`
    );

    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        restaurantId: admin.restaurantId,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {
      name: req.body.name,
      email: req.body.email,
      permissions: req.body.permissions,
      status: req.body.status,
    };

    const admin = await Admin.findById(id);
    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    // Only super admin can update other admins
    if (req.user.role !== 'SUPER_ADMIN' && req.user.id !== id) {
      throw new UnauthorizedError('Not authorized to update this admin');
    }

    Object.assign(admin, updates);
    await admin.save();

    logger.info(`Admin updated: ${admin._id}`);

    res.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        restaurantId: admin.restaurantId,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    admin.passwordHash = newPassword;
    await admin.save();

    logger.info(`Password changed for admin: ${admin._id}`);

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  createRestaurantAdmin,
  updateAdmin,
  changePassword,
};
