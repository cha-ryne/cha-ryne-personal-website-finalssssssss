// src/utils/formatters.js

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date error';
    }
  }
  
  /**
   * Detect if current browser is likely iPad Safari
   * @returns {boolean} True if browser is likely iPad Safari
   */
  export function isIPadSafari() {
    return /iPad/.test(navigator.userAgent) || 
           (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document);
  }
  
  /**
   * Create a timeout promise that rejects after specified milliseconds
   * @param {number} ms - Milliseconds before timeout
   * @returns {Promise} Promise that rejects after timeout
   */
  export function timeout(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), ms);
    });
  }
  
  /**
   * Generate a unique user ID
   * @returns {string} Generated user ID
   */
  export function generateUserId() {
    return 'user_' + Math.random().toString(36).substring(2, 9);
  }