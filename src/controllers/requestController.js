// src/controllers/requestController.js

const requestService = require('../services/requestService');

exports.broadcastRequest = async (req, res) => {
    console.log('Broadcast Request Body:', req.body);
    const { medicineName, userLocation } = req.body;
    const uid = req.user.uid;

    if (!medicineName || !userLocation) {
        return res.status(400).json({ error: 'Missing medicineName or userLocation.' });
    }

    try {
        const result = await requestService.createBroadcastRequest(uid, {
            medicineName,
            userLocation,
            radius: 5 // Default start radius
        });

        res.status(201).json({
            message: 'Request broadcasted successfully.',
            requestId: result.requestId,
            status: result.status
        });
    } catch (error) {
        console.error('Broadcast error:', error);
        res.status(500).json({ error: 'Failed to broadcast request.' });
    }
};

exports.getRequestStatus = async (req, res) => {
    const { requestId } = req.params;
    try {
        const statusData = await requestService.getRequestStatus(requestId);
        if (!statusData) return res.status(404).json({ error: 'Request not found' });
        res.status(200).json(statusData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.expandRadius = async (req, res) => {
    const { requestId } = req.params;
    try {
        await requestService.expandRadius(requestId);
        res.status(200).json({ message: 'Radius expanded' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.respondToRequest = async (req, res) => {
    const { requestId } = req.params;
    const { status, pharmacyName, location, suggestedMedicine } = req.body;
    const pharmacistId = req.user.uid;

    if (!status || !pharmacyName || !location) {
        return res.status(400).json({ error: 'Missing status, pharmacyName, or location.' });
    }

    try {
        const result = await requestService.respondToRequest(requestId, pharmacistId, {
            status,
            pharmacyName,
            location,
            suggestedMedicine
        });
        res.status(200).json({ message: 'Response recorded.', response: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAvailableRequests = async (req, res) => {
    try {
        // Simple mock for now: return all active requests
        // In reality, we would filter by distance using req.user's coords
        const requests = await requestService.getAllActiveRequests();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};