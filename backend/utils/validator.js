/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

/**
 * Validate short code format (alphanumeric)
 * @param {string} code - Short code to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidShortCode(code) {
  return /^[a-zA-Z0-9]+$/.test(code);
}

module.exports = {
  isValidUrl,
  isValidShortCode,
};
