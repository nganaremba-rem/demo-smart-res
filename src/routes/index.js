const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const restaurantRoutes = require('./restaurant.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const orderRoutes = require('./order.routes');
const userRoutes = require('./user.routes');

// API Routes
router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
