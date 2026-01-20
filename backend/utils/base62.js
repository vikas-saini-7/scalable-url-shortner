const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = CHARSET.length;

/**
 * Encode a number to Base62 string
 * @param {number} num - Positive integer to encode
 * @returns {string} Base62 encoded string
 */
function encode(num) {
  if (num === 0) return CHARSET[0];
  
  let encoded = '';
  while (num > 0) {
    encoded = CHARSET[num % BASE] + encoded;
    num = Math.floor(num / BASE);
  }
  
  return encoded;
}

/**
 * Decode a Base62 string to number
 * @param {string} str - Base62 encoded string
 * @returns {number} Decoded integer
 */
function decode(str) {
  let decoded = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const value = CHARSET.indexOf(char);
    
    if (value === -1) {
      throw new Error(`Invalid Base62 character: ${char}`);
    }
    
    decoded = decoded * BASE + value;
  }
  
  return decoded;
}

module.exports = { encode, decode };
