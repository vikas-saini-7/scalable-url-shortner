const urlService = require('../services/urlService');

/**
 * Handle POST /api/shorten
 * Create a shortened URL
 */
async function shortenUrl(req, res, next) {
  try {
    const { longUrl, expiresAt } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;
    
    if (!longUrl) {
      return res.status(400).json({
        success: false,
        message: 'Long URL is required',
      });
    }
    
    const result = await urlService.createShortUrl(
      longUrl,
      userId,
      userEmail,
      expiresAt ? new Date(expiresAt) : null
    );
    
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handle GET /:shortCode
 * Redirect to long URL
 */
async function redirectUrl(req, res, next) {
  try {
    const { shortCode } = req.params;
    
    const { longUrl } = await urlService.getLongUrl(shortCode);
    
    // Track click asynchronously
    urlService.trackClick(shortCode);
    
    res.redirect(302, longUrl);
  } catch (err) {
    next(err);
  }
}

/**
 * Handle GET /api/stats
 * Get all URLs for authenticated user
 */
async function getStats(req, res, next) {
  try {
    const userId = req.user.id;
    
    const urls = await urlService.getUserUrls(userId);
    
    res.json({
      success: true,
      data: {
        total: urls.length,
        urls,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handle GET /api/stats/:shortCode
 * Get statistics for a specific URL
 */
async function getUrlStats(req, res, next) {
  try {
    const { shortCode } = req.params;
    const userId = req.user.id;
    
    const stats = await urlService.getUrlStats(shortCode, userId);
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  shortenUrl,
  redirectUrl,
  getStats,
  getUrlStats,
};
