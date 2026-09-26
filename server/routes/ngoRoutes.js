const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const { authenticateJWT, requireRole } = require('../middleware/authMiddleware');

router.post('/claim', authenticateJWT, requireRole('ngo', 'admin'), ngoController.claimDonation);
router.get('/my-claims', authenticateJWT, requireRole('ngo', 'admin'), ngoController.getNGOClaims);
router.get('/stats', authenticateJWT, requireRole('ngo', 'admin'), ngoController.getNGOStats);

module.exports = router;
