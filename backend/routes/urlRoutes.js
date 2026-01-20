const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const authMiddleware = require('../middlewares/auth');
const rateLimitMiddleware = require('../middlewares/rateLimit');

// Public route - redirect
router.get('/:shortCode', urlController.redirectUrl);

// Protected routes
router.post('/api/shorten', authMiddleware, rateLimitMiddleware, urlController.shortenUrl);
router.get('/api/stats', authMiddleware, urlController.getStats);
router.get('/api/stats/:shortCode', authMiddleware, urlController.getUrlStats);

module.exports = router;
