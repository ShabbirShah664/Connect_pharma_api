const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const requestController = require('../controllers/requestController');

// --- User Routes ---
// @route   POST /api/requests/broadcast
router.post('/broadcast', protect, restrictTo('user'), requestController.broadcastRequest);

// @route   GET /api/requests/:requestId/status
router.get('/:requestId/status', protect, restrictTo('user'), requestController.getRequestStatus);

// @route   POST /api/requests/:requestId/expand
router.post('/:requestId/expand', protect, restrictTo('user'), requestController.expandRadius);

// Legacy/Other routes? keeping standard available/respond for pharmacists
// router.get('/available', protect, restrictTo('pharmacist'), requestController.getAvailableRequests);
// router.put('/:id/respond', protect, restrictTo('pharmacist'), requestController.respondToRequest);

router.get('/available', requestController.getAvailableRequests);
router.post('/:requestId/respond', requestController.respondToRequest);

module.exports = router;