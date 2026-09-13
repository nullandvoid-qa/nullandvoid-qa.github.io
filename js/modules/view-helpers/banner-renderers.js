/**
 * Banner Rendering Functions
 * Continue banner and PWA installation banner
 */

const { createIconHtml } = require('./ui-helpers');

function renderContinueBanner(banner, lastLesson, findLesson, getTrackIcon, escapeHtml, t, navigate, icons, storageKey) {
  if (!banner) return;

  const lastId = localStorage.getItem(storageKey) || null;
  if (!lastId) {
    banner.classList.add("hidden");
    return;
  }

  const found = findLesson(lastId);
  if (!found) {
    banner.classList.add("hidden");
    return;
  }

  banner.classList.remove("hidden");
  banner.setAttribute && banner.setAttribute("aria-live", "polite");
  banner.setAttribute && banner.setAttribute("role", "status");
  banner.removeAttribute && banner.removeAttribute("aria-hidden");
  const trackIcon = createIconHtml(icons, getTrackIcon(found.track), "search-result-icon", "14");
  banner.innerHTML = `
    <div class="continue-card">
      <div class="continue-card-copy">
        <div class="continue-label">${t("dashboard.continueTitle")}</div>
        <div class="continue-lesson">${escapeHtml(found.lesson.title)}</div>
        <div class="continue-track">${trackIcon ? `${trackIcon} ` : ""}${escapeHtml(found.track.title)}</div>
      </div>
      <div class="continue-actions">
        <button class="btn btn-primary" id="btn-continue">${t("dashboard.continueBtn")}</button>
      </div>
    </div>`;

  const btn = document.getElementById("btn-continue");
  if (btn) {
    btn.addEventListener("click", () => navigate("lesson", { lessonId: lastId }));
  }
}

function renderInstallBanner(banner, installCallbacks) {
  if (!banner) return;

  const mediaQuery = window.matchMedia("(max-width: 768px)");
  const updateBannerVisibility = () => {
    if (!mediaQuery.matches) {
      banner.style.display = "none";
      return;
    }
  };

  updateBannerVisibility();
  mediaQuery.addEventListener("change", updateBannerVisibility);

  let deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (mediaQuery.matches) {
      banner.style.display = "flex";
    }
  });

  window.addEventListener("appinstalled", () => {
    banner.style.display = "none";
    deferredPrompt = null;
  });

  const btnInstall = document.getElementById("install-app-btn");
  const btnDismiss = document.getElementById("dismiss-install-btn");

  if (btnInstall) {
    btnInstall.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        banner.style.display = "none";
      }
      deferredPrompt = null;
    });
  }

  if (btnDismiss) {
    btnDismiss.addEventListener("click", () => {
      banner.style.display = "none";
      localStorage.setItem("pwa-dismissed", "true");
    });
  }

  const dismissed = localStorage.getItem("pwa-dismissed") === "true";
  if (dismissed || !("serviceWorker" in navigator)) {
    banner.style.display = "none";
  }

  if (typeof installCallbacks?.onRender === "function") {
    installCallbacks.onRender({ banner, deferredPrompt });
  }
}

module.exports = {
  renderContinueBanner,
  renderInstallBanner,
};
