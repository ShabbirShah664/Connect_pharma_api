const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route all auth requests through the controller
// Supports /api/auth/:role/signup and /api/auth/:role/login
router.post('/:role/signup', authController.signup);
router.post('/:role/login', authController.login);

module.exports = router;