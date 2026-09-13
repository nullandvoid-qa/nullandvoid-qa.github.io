/**
 * View Renderer Functions
 * Main view rendering (home view)
 */

const { getAvatarState } = require('./ui-helpers');

function renderHomeView(options) {
  const {
    global,
    tracks,
    persona,
    homeFilter,
    lang,
    avatarIcons,
    renderTrackCard,
    renderHomeFilterBar,
    renderContinueBanner,
    renderHomeLessons,
    renderInstallBanner,
    sortTracksForPersona,
    trackAudience,
    getHomeTrackSummary,
  } = options;

  const avatarState = getAvatarState(global.pct, lang);
  const avatarEmoji = document.getElementById("avatar-icon");
  const avatarLevel = document.getElementById("avatar-level");
  const avatarProgress = document.getElementById("avatar-progress");

  document.getElementById("stat-lessons").textContent = global.total;
  document.getElementById("stat-tracks").textContent = tracks.length;

  document.querySelectorAll(".persona-card").forEach((el) => {
    el.classList.toggle("active", el.dataset.persona === persona);
  });

  if (avatarEmoji && avatarLevel && avatarProgress) {
    avatarEmoji.setAttribute("data-icon", avatarState.icon);
    avatarEmoji.setAttribute("data-icon-size", avatarState.iconSize);
    avatarEmoji.innerHTML = avatarIcons
      ? avatarIcons.get(avatarState.icon, avatarState.iconClass, avatarState.iconSize)
      : "";
    avatarLevel.textContent = avatarState.level;
    avatarProgress.textContent = avatarState.progressText;
  }

  renderHomeFilterBar();

  const filtered =
    homeFilter === "all"
      ? sortTracksForPersona(tracks)
      : tracks.filter((tr) => trackAudience[tr.id] === homeFilter);

  const grid = document.getElementById("home-tracks-grid");
  const emptyState = document.getElementById("home-tracks-empty");
  const summary = document.getElementById("home-tracks-summary");
  if (summary && typeof getHomeTrackSummary === "function") summary.textContent = getHomeTrackSummary(filtered.length);

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.classList.add("hidden");
    if (emptyState) emptyState.classList.remove("hidden");
  } else {
    grid.classList.remove("hidden");
    if (emptyState) emptyState.classList.add("hidden");
    filtered.forEach((tr) => renderTrackCard(tr, "home-tracks-grid", { showRecommend: true }));
  }

  renderContinueBanner();
  renderHomeLessons();
  renderInstallBanner();
}

module.exports = {
  renderHomeView,
};
