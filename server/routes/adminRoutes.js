const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateJWT, requireRole } = require('../middleware/authMiddleware');

router.get('/users', authenticateJWT, requireRole('admin'), adminController.getUsers);
router.post('/user-status', authenticateJWT, requireRole('admin'), adminController.updateUserStatus);
router.get('/overview', authenticateJWT, requireRole('admin'), adminController.getAdminOverview);

module.exports = router;
