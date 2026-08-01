const express = require('express');
const router = express.Router();
const rssController = require('../controllers/rssController');

// GET all RSS sources
router.get('/sources', rssController.getSources);

// POST add new RSS source
router.post('/sources', rssController.addSource);

// GET fetch live RSS items from URL
router.get('/fetch', rssController.fetchFeedItems);

module.exports = router;