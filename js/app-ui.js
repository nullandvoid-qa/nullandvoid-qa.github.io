/**
 * app-ui.js
 *
 * Shared UI helpers: toast notifications and shared utilities
 * used across multiple view modules.
 */
(function () {
  window.nvToast = window.nvToast || { queue: [], isShowing: false, timer: null };

  function showToast(msg) {
    const safeMessage = msg == null ? '' : String(msg);
    const el = typeof document !== 'undefined' ? document.getElementById('toast') : null;
    if (!el) return;
    if (!window.nvToast) {
      window.nvToast = { queue: [], isShowing: false, timer: null };
    }
    window.nvToast.queue.push(safeMessage);
    if (window.nvToast.isShowing) return;

    const showNext = () => {
      if (!window.nvToast || window.nvToast.queue.length === 0) {
        if (window.nvToast) window.nvToast.isShowing = false;
        return;
      }
      const nextMsg = window.nvToast.queue.shift();
      el.textContent = nextMsg;
      el.classList.add('show');
      window.nvToast.isShowing = true;
      clearTimeout(window.nvToast.timer);
      window.nvToast.timer = setTimeout(() => {
        el.classList.remove('show');
        if (window.nvToast) window.nvToast.isShowing = false;
        showNext();
      }, 2800);
    };

    showNext();
  }
  window.showToast = showToast;

  window.NVAppUI = { showToast };
})();
