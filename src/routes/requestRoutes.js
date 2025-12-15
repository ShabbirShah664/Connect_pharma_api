// connect-pharma-api/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const Request = require('../models/Request');

// --- User Routes ---
// @route   POST /api/requests
router.post('/', protect, restrictTo('user'), async (req, res) => {
    const { medicineDetails, deliveryLocation, preferredTime } = req.body;
    try {
        const newRequest = await Request.create({
            userId: req.user.id,
            medicineDetails,
            deliveryLocation, // { lat: X, lng: Y, address: '...' }
            preferredTime,
            status: 'pending'
        });
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create request.' });
    }
});

// @route   GET /api/requests/user
router.get('/user', protect, restrictTo('user'), async (req, res) => {
    try {
        const requests = await Request.findByUserId(req.user.id);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user requests.' });
    }
});

// --- Pharmacist Routes ---
// @route   GET /api/requests/available
router.get('/available', protect, restrictTo('pharmacist'), async (req, res) => {
    try {
        const availableRequests = await Request.findNearbyPending(/* coords from req.query */);
        res.json(availableRequests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch available requests.' });
    }
});

// @route   PUT /api/requests/:id/respond
router.put('/:id/respond', protect, restrictTo('pharmacist'), async (req, res) => {
    const { responseStatus, estimatedPrice } = req.body;
    const requestId = req.params.id;

    try {
        const updatedRequest = await Request.update(requestId, {
            status: responseStatus,
            pharmacistId: req.user.id,
            estimatedPrice: estimatedPrice || null,
        });
        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update request status.' });
    }
});

module.exports = router;