// src/controllers/requestController.js

const requestService = require('../services/requestService');

exports.createRequest = async (req, res) => {
    const userId = req.user.uid; 
    // Data comes from the frontend when the user selects a pharmacy and hits "Place Request"
    const { pharmacyId, medicineName, prescriptionUrl, deliveryType, userLocation } = req.body;

    if (!pharmacyId || !medicineName || !deliveryType || !userLocation) {
        return res.status(400).json({ error: 'Missing required request fields (pharmacyId, medicineName, deliveryType, userLocation).' });
    }
    
    try {
        const result = await requestService.createRequest(userId, pharmacyId, {
            medicineName,
            prescriptionUrl,
            deliveryType,
            userLocation
        });

        res.status(201).json({ 
            message: 'Medicine request created and sent for pharmacist review.', 
            requestId: result.requestId,
            status: result.status
        });
    } catch (error) {
        console.error('Request creation error:', error);
        res.status(500).json({ error: 'Failed to create request.' });
    }
};