const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/csv', reportController.exportCSV);
router.get('/pdf', reportController.exportPDF);

module.exports = router;
