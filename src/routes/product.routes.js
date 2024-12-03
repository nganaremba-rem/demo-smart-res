const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth.js');
const productController = require('../controllers/product.controller.js');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get(
  '/restaurant/:restaurantId',
  productController.getProductsByRestaurant
);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/available', productController.getAvailableProducts);

// Protected routes
router.use(protect);
router.use(authorize('admin', 'restaurant-admin'));

router.post('/', upload.array('images', 5), productController.createProduct);
router.put('/:id', upload.array('images', 5), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Bulk operations
router.post('/bulk', productController.bulkCreateProducts);
router.put('/bulk', productController.bulkUpdateProducts);

// Availability management
router.put('/:id/availability', productController.updateProductAvailability);
router.put('/:id/customization', productController.updateProductCustomization);

module.exports = router;
