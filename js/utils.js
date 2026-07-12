/**
 * Utility functions for Testers Guild QA Course
 */

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Gets the current language key for i18n
 * @returns {string} "en" or "pt"
 */
function getCurrentLangKey() {
  // Check if lang is defined globally (from app.js) or use fallback
  if (typeof window !== "undefined" && window.lang) {
    return window.lang === "en" ? "en" : "pt";
  }
  // Fallback for testing or if lang is not defined
  return "pt";
}

// Export for Node.js/test environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = { escapeHtml, getCurrentLangKey };
}

// Export for browser environment
if (typeof window !== "undefined") {
  window.escapeHtml = escapeHtml;
  window.getCurrentLangKey = getCurrentLangKey;
}
