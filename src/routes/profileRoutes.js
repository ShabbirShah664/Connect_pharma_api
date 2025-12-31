// connect-pharma-api/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   GET /api/profile
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.uid);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        delete user.passwordHash;

        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile.' });
    }
});

module.exports = router;