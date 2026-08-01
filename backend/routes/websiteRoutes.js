const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteController');
const { optionalAuthMiddleware } = require('../middleware/authMiddleware');

router.use(optionalAuthMiddleware);

// GET all website analyses
router.get('/', websiteController.getAllAnalyses);

// GET website analysis by ID
router.get('/:id', websiteController.getAnalysisById);

// POST create new website analysis
router.post('/', websiteController.createAnalysis);

module.exports = router;