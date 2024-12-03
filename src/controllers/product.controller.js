const Product = require('../models/Product');
const AppError = require('../utils/AppError');

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('categoryId', 'name')
      .populate('restaurantId', 'name');

    res.status(200).json({
      status: 'success',
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name')
      .populate('restaurantId', 'name');

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByRestaurant = async (req, res, next) => {
  try {
    const products = await Product.find({
      restaurantId: req.params.restaurantId,
    })
      .populate('categoryId', 'name')
      .sort('categoryId');

    res.status(200).json({
      status: 'success',
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({
      categoryId: req.params.categoryId,
    }).populate('restaurantId', 'name');

    res.status(200).json({
      status: 'success',
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(async (file, index) => {
        const url = await uploadFile(file);
        return {
          url,
          alt: `${req.body.name} image ${index + 1}`,
          isPrimary: index === 0, // First image is primary
        };
      });

      const images = await Promise.all(imagePromises);
      req.body.images = images;
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    // Handle multiple image uploads if files are provided
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(async (file, index) => {
        const url = await uploadFile(file);
        return {
          url,
          alt: `${req.body.name || 'product'} image ${index + 1}`,
          isPrimary: index === 0,
        };
      });

      const newImages = await Promise.all(imagePromises);
      req.body.images = newImages;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    await product.remove(); // This will trigger the pre-remove middleware

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkCreateProducts = async (req, res, next) => {
  try {
    const products = await Product.insertMany(req.body.products);

    res.status(201).json({
      status: 'success',
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkUpdateProducts = async (req, res, next) => {
  try {
    const updates = req.body.products.map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: { $set: product },
      },
    }));

    await Product.bulkWrite(updates);

    res.status(200).json({
      status: 'success',
      message: 'Products updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getAvailableProducts = async (req, res, next) => {
  try {
    const { restaurantId } = req.query;
    const currentDate = new Date();
    const day = currentDate.toLocaleString('en-US', { weekday: 'uppercase' });

    const products = await Product.find({
      restaurantId,
      'availability.isAvailable': true,
      'availability.days': day,
    }).populate('categoryId', 'name');

    // Filter products based on time
    const availableProducts = products.filter((product) =>
      product.isAvailableAt(currentDate)
    );

    res.status(200).json({
      status: 'success',
      data: { products: availableProducts },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProductAvailability = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { availability: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProductCustomization = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { customization: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};
