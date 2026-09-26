const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authenticateJWT, requireRole } = require('../middleware/authMiddleware');

router.get('/my-deliveries', authenticateJWT, requireRole('driver', 'admin'), driverController.getAssignedDeliveries);
router.post('/status', authenticateJWT, requireRole('driver', 'admin'), driverController.updateStatus);
router.post('/verify-otp', authenticateJWT, requireRole('driver', 'admin'), driverController.verifyOTPAndComplete);

module.exports = router;
