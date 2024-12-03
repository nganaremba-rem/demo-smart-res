const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      status: 'success',
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return next(new AppError('Email already exists', 400));
    }

    const user = await User.create({
      ...req.body,
      role: req.body.role || 'user', // Default role if not specified
    });

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // Prevent password update through this route
    if (req.body.password) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /update-password',
          400
        )
      );
    }

    // Check if email update and if it already exists
    if (req.body.email) {
      const existingUser = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.params.id },
      });
      if (existingUser) {
        return next(new AppError('Email already exists', 400));
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        // Prevent role update if not super-admin
        role: req.user.role === 'super-admin' ? req.body.role : undefined,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Prevent deletion of super-admin by non-super-admin
    if (user.role === 'super-admin' && req.user.role !== 'super-admin') {
      return next(
        new AppError('You do not have permission to delete this user', 403)
      );
    }

    await user.remove();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // Prevent password and role updates through this route
    if (req.body.password || req.body.role) {
      return next(
        new AppError(
          'This route is not for password/role updates. Please use the appropriate route',
          400
        )
      );
    }

    // Check if email update and if it already exists
    if (req.body.email) {
      const existingUser = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return next(new AppError('Email already exists', 400));
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
