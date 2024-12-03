const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.js');
const categoryController = require('../controllers/category.controller');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get(
  '/restaurant/:restaurantId',
  categoryController.getCategoriesByRestaurant
);

// Protected routes
router.use(protect);
router.use(authorize('admin', 'restaurant-admin'));

router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

// Bulk operations
router.post('/bulk', categoryController.bulkCreateCategories);
router.put('/bulk', categoryController.bulkUpdateCategories);

module.exports = router;
