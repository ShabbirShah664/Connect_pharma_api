// src/routes/searchRoutes.js

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

router.post('/medicine', protect, searchController.search);

module.exports = router;