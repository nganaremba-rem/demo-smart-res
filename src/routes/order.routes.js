const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.js');
const orderController = require('../controllers/order.controller');

// Customer routes
router.use(protect);
router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/my-orders/:id', orderController.getMyOrderById);

// Restaurant admin routes
router.use(authorize('admin', 'restaurant-admin'));
router.get('/restaurant/:restaurantId', orderController.getRestaurantOrders);
router.put('/:id/status', orderController.updateOrderStatus);

// Admin routes
router.use(authorize('admin', 'super-admin'));
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
