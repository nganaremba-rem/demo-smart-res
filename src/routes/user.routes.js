const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.js');
const userController = require('../controllers/user.controller');

router.use(protect);
router.use(authorize('admin', 'super-admin'));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
