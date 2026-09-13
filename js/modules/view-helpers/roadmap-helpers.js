/**
 * Roadmap Helper Functions
 * Learning roadmap rendering and navigation
 */

function buildRoadmapHtml(roadmaps, lang, t, escapeHtml) {
  const locale = lang === "en" ? "en" : "pt";
  const routes = [{ key: "beginner", icon: "" }, { key: "senior", icon: "" }];
  return routes
    .map(({ key, icon }) => {
      const data = roadmaps[key]?.[locale] || roadmaps[key]?.pt;
      if (!data) return "";
      const steps = data.steps
        .map(
          (step, i) => `
      <div class="roadmap-step">
        <div class="roadmap-step-num">${i + 1}</div>
        <div class="roadmap-step-body">
          <strong>${escapeHtml(step.label)}</strong>
          <p class="roadmap-why"><em>${t("roadmap.why")}:</em> ${escapeHtml(step.why)}</p>
          <button type="button" class="btn btn-secondary btn-sm roadmap-go" data-track="${step.trackId}" data-lesson="${step.lessonId || ""}" aria-label="${escapeHtml(t("roadmap.start") + ": " + step.label)}">${t("roadmap.start")}</button>
        </div>
      </div>`,
        )
        .join("");
      return `<article class="roadmap-card">
      <h3>${icon} ${escapeHtml(data.title)}</h3>
      <p>${escapeHtml(data.desc)}</p>
      <div class="roadmap-steps">${steps}</div>
    </article>`;
    })
    .join("");
}

function renderRoadmap(container, roadmaps, lang, t, escapeHtml, navigate) {
  if (!container) return;

  container.innerHTML = buildRoadmapHtml(roadmaps, lang, t, escapeHtml);
  container.querySelectorAll(".roadmap-go").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lesson) navigate("lesson", { lessonId: btn.dataset.lesson });
      else navigate("track", { trackId: btn.dataset.track });
    });
  });
}

module.exports = {
  buildRoadmapHtml,
  renderRoadmap,
};
