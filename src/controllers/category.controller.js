const Category = require('../models/Category');
const AppError = require('../utils/AppError');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('restaurantId', 'name');

    res.status(200).json({
      status: 'success',
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      'restaurantId',
      'name'
    );

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoriesByRestaurant = async (req, res, next) => {
  try {
    const categories = await Category.find({
      restaurantId: req.params.restaurantId,
    }).sort('order');

    res.status(200).json({
      status: 'success',
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    // Set the order if not provided
    if (!req.body.order) {
      const lastCategory = await Category.findOne({
        restaurantId: req.body.restaurantId,
      })
        .sort('-order')
        .limit(1);
      req.body.order = lastCategory ? lastCategory.order + 1 : 1;
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // Check if category has products
    const Product = require('../models/Product');
    const hasProducts = await Product.exists({ categoryId: category._id });

    if (hasProducts) {
      return next(
        new AppError(
          'Cannot delete category with associated products. Please move or delete the products first.',
          400
        )
      );
    }

    await category.remove();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkCreateCategories = async (req, res, next) => {
  try {
    // If order is not provided, set it sequentially
    const lastCategory = await Category.findOne({
      restaurantId: req.body.categories[0].restaurantId,
    })
      .sort('-order')
      .limit(1);
    let nextOrder = lastCategory ? lastCategory.order + 1 : 1;

    const categoriesToCreate = req.body.categories.map((category) => ({
      ...category,
      order: category.order || nextOrder++,
    }));

    const categories = await Category.insertMany(categoriesToCreate);

    res.status(201).json({
      status: 'success',
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkUpdateCategories = async (req, res, next) => {
  try {
    const updates = req.body.categories.map((category) => ({
      updateOne: {
        filter: { _id: category._id },
        update: { $set: category },
      },
    }));

    await Category.bulkWrite(updates);

    res.status(200).json({
      status: 'success',
      message: 'Categories updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.reorderCategories = async (req, res, next) => {
  try {
    const { categories } = req.body;

    // Update each category's order
    const updates = categories.map((category) => ({
      updateOne: {
        filter: { _id: category._id },
        update: { $set: { order: category.order } },
      },
    }));

    await Category.bulkWrite(updates);

    res.status(200).json({
      status: 'success',
      message: 'Categories reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};
