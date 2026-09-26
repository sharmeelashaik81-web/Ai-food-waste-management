const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { authenticateJWT, requireRole } = require('../middleware/authMiddleware');

router.post('/', authenticateJWT, requireRole('restaurant', 'admin'), donationController.createDonation);
router.get('/', donationController.getAllDonations);
router.get('/my-restaurant', authenticateJWT, requireRole('restaurant', 'admin'), donationController.getRestaurantDonations);
router.get('/:id', donationController.getDonationById);

module.exports = router;
