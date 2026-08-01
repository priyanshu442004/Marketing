const express = require('express');
const router = express.Router();
const marketingController = require('../controllers/marketingController');
const { optionalAuthMiddleware } = require('../middleware/authMiddleware');

router.use(optionalAuthMiddleware);

// GET all marketing runs
router.get('/runs', marketingController.getAllRuns);

// GET marketing run by ID
router.get('/runs/:id', marketingController.getRunById);

// POST create new marketing run
router.post('/runs', marketingController.createRun);

// PATCH update asset approval status
router.patch('/assets/:id/status', marketingController.updateAssetStatus);

module.exports = router;