// src/controllers/searchController.js

const searchService = require('../services/searchService');

exports.search = async (req, res) => {
    // req.user is attached by authMiddleware and contains {uid, role}
    const { location, medicineName } = req.body; 
    
    if (!location || !location.lat || !location.lng || !medicineName) {
        return res.status(400).json({ error: 'Missing location coordinates or medicine name.' });
    }

    const userLocation = { lat: location.lat, lng: location.lng };

    try {
        const searchResult = await searchService.searchMedicine(userLocation, medicineName);

        if (searchResult.found) {
            res.status(200).json({ 
                success: true, 
                message: 'Pharmacies found.', 
                results: searchResult.results 
            });
        } else {
            // Return success with specific action for frontend (Ask For Suggestions)
            res.status(200).json({ 
                success: false, 
                message: searchResult.message,
                action: searchResult.action 
            });
        }

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error during search.' });
    }
};