// connect-pharma-api/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { email, password, role, name } = req.body;
    try {
        const userExists = await User.findByEmail(email);

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            passwordHash: hashedPassword,
            role: role || 'user',
        });
        
        const userResponse = { ...newUser };
        delete userResponse.passwordHash;

        const token = jwt.sign(
            { id: newUser.id, role: newUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        );

        res.status(201).json({ token, user: userResponse });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            
            const userResponse = { ...user };
            delete userResponse.passwordHash;

            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '30d' }
            );

            res.json({ token, user: userResponse });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;