const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('/predict-surplus', authenticateJWT, aiController.predictSurplus);
router.post('/analyze-freshness', authenticateJWT, aiController.analyzeFreshness);

module.exports = router;
