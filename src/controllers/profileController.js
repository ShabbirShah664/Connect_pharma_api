// src/controllers/profileController.js

const profileService = require('../services/profileService');

exports.getProfile = async (req, res) => {
    // Get user identity from the JWT payload attached by the middleware
    const { uid, role } = req.user;
    
    try {
        const profile = await profileService.getProfile(uid, role);
        res.status(200).json(profile);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { uid, role } = req.user;
    const updates = req.body;
    
    try {
        const updatedProfile = await profileService.updateProfile(uid, role, updates);
        res.status(200).json({ 
            message: 'Profile updated successfully',
            profile: updatedProfile
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};