const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  try {
    // Add user ID from authenticated user
    req.body.userId = req.user.id;

    const order = await Order.create(req.body);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: order.pricing.total * 100, // Convert to paise
      currency: 'INR',
      receipt: order.orderNumber,
    });

    res.status(201).json({
      status: 'success',
      data: {
        order,
        razorpayOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('restaurantId', 'name')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate('restaurantId', 'name');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      restaurantId: req.params.restaurantId,
    })
      .populate('userId', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Add status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note,
      updatedBy: req.user.id,
    });

    order.status = status;
    await order.save();

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('restaurantId', 'name')
      .populate('userId', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId', 'name')
      .populate('userId', 'name email');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    await order.remove();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
