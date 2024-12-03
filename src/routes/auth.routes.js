const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.js');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.put('/update-password', authController.updatePassword);
router.put('/update-profile', authController.updateProfile);

module.exports = router;
