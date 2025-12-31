// src/controllers/authController.js

const authService = require('../services/authService');

exports.signup = async (req, res) => {
    const { role } = req.params;
    const { name, email, password, contactNumber, licenseNumber, address } = req.body;

    if (!['User', 'Pharmacist', 'Driver'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified.' });
    }

    if (!name || !email || !password || !contactNumber) {
        return res.status(400).json({ error: 'Missing required fields: name, email, password, or contactNumber.' });
    }

    try {
        const result = await authService.register(role, {
            name, email, password, contactNumber, licenseNumber, address
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { role } = req.params;
    const { email, password } = req.body;

    if (!['User', 'Pharmacist', 'Driver'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified.' });
    }

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password.' });
    }

    try {
        const result = await authService.login(role, email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};