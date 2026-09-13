/**
 * Track Helper Functions
 * Track detail rendering and navigation
 */

const { bindAccessibleAction } = require('./ui-helpers');
const { buildTrackDetailHtml } = require('./card-builders');

function renderTrackDetail(container, track, coursesHtml, prog, meta, helpers, navigate, hasQuiz) {
  if (!container || !track) return;

  const quizBtnHtml = hasQuiz
    ? `<button class="btn btn-secondary" id="btn-take-quiz">${helpers.icons ? helpers.icons.get('target','','16') + ' ' : ''}${helpers.t("quiz.takeQuiz")}</button>`
    : "";

  container.innerHTML = buildTrackDetailHtml(
    track,
    coursesHtml,
    quizBtnHtml,
    prog,
    meta,
    helpers,
  );

  container.querySelectorAll(".lesson-item").forEach((el) => {
    const open = () => navigate("lesson", { lessonId: el.dataset.lesson });
    bindAccessibleAction(el, open);
  });

  container.querySelector("#btn-take-quiz")?.addEventListener("click", () => navigate("quiz", { trackId: track.id }));
}

module.exports = {
  renderTrackDetail,
};
