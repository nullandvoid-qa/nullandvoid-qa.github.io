/* app-bootstrap-helpers.js
 * Small helper to register global NVApp bindings from a central bootstrap.
 * Exposes `window.NVAppBootstrap.ensureGlobalNVApp(state, helpers)` which
 * can be used by the main app bootstrap to attach global state and helpers
 * in a single well-known place.
 */
(function () {
  if (typeof window === 'undefined') return;

  window.NVAppBootstrap = window.NVAppBootstrap || {};

  window.NVAppBootstrap.ensureGlobalNVApp = function ensureGlobalNVApp(state, helpers) {
    try {
      window.NVApp = window.NVApp || {};
      window.NVApp.state = window.NVApp.state || state || {};
      window.NVApp.helpers = window.NVApp.helpers || helpers || {};
    } catch (e) {
      // noop in environments without window availability
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ensureGlobalNVApp: window.NVAppBootstrap.ensureGlobalNVApp };
  }
})();
