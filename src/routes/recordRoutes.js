// connect-pharma-api/routes/recordRoutes.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const MedicalRecord = require('../models/MedicalRecord');

// @route   POST /api/records
router.post('/', protect, restrictTo('user'), async (req, res) => {
    const { title, storageUrl, recordType } = req.body;
    try {
        const newRecord = await MedicalRecord.create({
            userId: req.user.id,
            title,
            storageUrl, 
            recordType,
        });
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload record.' });
    }
});

// @route   GET /api/records
router.get('/', protect, restrictTo('user'), async (req, res) => {
    try {
        const records = await MedicalRecord.findByUserId(req.user.id);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch records.' });
    }
});

module.exports = router;