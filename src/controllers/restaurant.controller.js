const Restaurant = require('../models/Restaurant');
const AppError = require('../utils/AppError');
const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({
      status: 'success',
      data: { restaurants },
    });
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantBySlug = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    if (req.files) {
      if (req.files.image) {
        req.body.image = req.files.image[0];
      }
      if (req.files.logo) {
        req.body.logoFile = req.files.logo[0];
      }
      if (req.files.coverImage) {
        req.body.coverFile = req.files.coverImage[0];
      }
    }

    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    if (req.files) {
      if (req.files.image) {
        req.body.image = req.files.image[0];
      }
      if (req.files.logo) {
        req.body.logoFile = req.files.logo[0];
      }
      if (req.files.coverImage) {
        req.body.coverFile = req.files.coverImage[0];
      }
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    await restaurant.remove(); // This will trigger the pre-remove middleware

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRestaurantSettings = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { settings: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRestaurantCustomization = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { customization: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};

exports.getActiveRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({
      'settings.isActive': true,
      'settings.acceptingOrders': true,
    });

    res.status(200).json({
      status: 'success',
      data: { restaurants },
    });
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantMenu = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    const categories = await Category.find({
      restaurantId: restaurant._id,
    }).sort('order');

    const products = await Product.find({
      restaurantId: restaurant._id,
      'availability.isAvailable': true,
    }).populate('categoryId');

    res.status(200).json({
      status: 'success',
      data: {
        restaurant,
        categories,
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleRestaurantStatus = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    restaurant.settings.isActive = !restaurant.settings.isActive;
    await restaurant.save();

    res.status(200).json({
      status: 'success',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleAcceptingOrders = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    restaurant.settings.acceptingOrders = !restaurant.settings.acceptingOrders;
    await restaurant.save();

    res.status(200).json({
      status: 'success',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};
