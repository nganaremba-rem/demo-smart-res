const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth.js');
const restaurantController = require('../controllers/restaurant.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Multiple file upload fields
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]);

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/active', restaurantController.getActiveRestaurants);
router.get('/:slug', restaurantController.getRestaurantBySlug);
router.get('/:id/menu', restaurantController.getRestaurantMenu);

// Protected routes
router.use(protect);
router.use(authorize('admin', 'super-admin'));

router.post('/', uploadFields, restaurantController.createRestaurant);
router.put('/:id', uploadFields, restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);

// Restaurant settings and customization
router.put('/:id/settings', restaurantController.updateRestaurantSettings);
router.put(
  '/:id/customization',
  restaurantController.updateRestaurantCustomization
);

// Operating status
router.put('/:id/toggle-status', restaurantController.toggleRestaurantStatus);
router.put('/:id/toggle-orders', restaurantController.toggleAcceptingOrders);

module.exports = router;
