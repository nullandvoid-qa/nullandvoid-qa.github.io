(function () {
  "use strict";

  function buildLessonSidebarHtml(rawCourse, rawLesson, localizedLesson, progressMap, track, course, t, icons, getTrackIcon, tierLabel, escapeHtml) {
    const sidebarLessons = rawCourse.lessons
      .map((rl) => {
        const ll = localizedLesson(rl);
        return `<li class="sidebar-lesson ${rl.id === rawLesson.id ? "active" : ""} ${progressMap[rl.id] ? "done" : ""}" data-lesson="${rl.id}" tabindex="0" role="button">${escapeHtml(ll.title)}</li>`;
      })
      .join("");

    return `
      <aside class="lesson-sidebar">
        <div class="sidebar-track">${icons ? icons.get(getTrackIcon(track), 'track-icon-svg', '18') + ' ' : track.icon} ${escapeHtml(track.title)}</div>
        <div class="sidebar-course">${escapeHtml(course.title)}</div>
        <ul class="sidebar-lessons">${sidebarLessons}</ul>
      </aside>`;
  }

  function buildLessonBodyHtml({ lesson, processedContent, primerHtml: primerMarkup, seniorHtml: seniorMarkup, resourcesHtml, rawLesson, rawTrack, rawCourse, done, isBookmarked, prev, next, lang, t, tierLabel, escapeHtml, icons, getTrackIcon, getEnrichment }) {
    const enr = getEnrichment(rawLesson.id);
    const primerText = enr.primer?.[lang === "en" ? "en" : "pt"] || enr.primer?.pt;
    const seniorText = enr.seniorNote?.[lang === "en" ? "en" : "pt"] || enr.seniorNote?.pt;
    const primerHtml = primerMarkup || (primerText ? `<aside class="lesson-box lesson-box-beginner"><h3>${t("lesson.primerTitle")}</h3><p>${escapeHtml(primerText)}</p></aside>` : "");
    const seniorHtml = seniorMarkup || (seniorText ? `<aside class="lesson-box lesson-box-senior"><h3>${t("lesson.seniorTitle")}</h3><p>${escapeHtml(seniorText)}</p></aside>` : "");
    const resourcesHtmlMarkup = rawLesson.resources?.length
      ? `<div class="lesson-resources"><h3>${icons ? icons.get('link', '', '16') + ' ' : ''}${t("lesson.resources")}</h3>${rawLesson.resources
          .map((r) => `<a class="resource-link" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${icons ? icons.get('externalLink', '', '16') + ' ' : ''}${escapeHtml(r.label)}</a>`)
          .join("")}</div>`
      : "";
    const lessonHeader = `
      <div class="lesson-header-row">
        <h1>${escapeHtml(lesson.title)}</h1>
        <div style="display:flex;gap:0.5rem;align-items:center;flex-shrink:0">
          <span class="tier-badge tier-${enr.tier}">${tierLabel(enr.tier)}</span>
          <button class="btn-bookmark ${isBookmarked ? "bookmarked" : ""}" id="btn-bookmark" title="${isBookmarked ? t("lesson.unbookmark") : t("lesson.bookmark")}" aria-label="${isBookmarked ? t("lesson.unbookmark") : t("lesson.bookmark")}">
            ${icons ? icons.get(isBookmarked ? 'bookmarkFilled' : 'bookmark', '', '18') : ''}
          </button>
        </div>
      </div>`;
    const metaRow = `<div class="lesson-meta-row">
      <span class="lesson-meta-item">${icons ? icons.get('clock', '', '14') + ' ' : ''}${escapeHtml(lesson.duration)}</span>
      <span class="lesson-meta-item">${done ? (icons ? icons.get('check', '', '14') + ' ' : '✓ ') + t("lesson.completed") : (icons ? icons.get('book', '', '14') + ' ' : '') + t("lesson.inProgress")}</span>
    </div>`;

    return `
      <article class="lesson-content">
        ${lessonHeader}
        ${metaRow}
        ${primerHtml}
        <div class="lesson-body">${processedContent}</div>
        ${seniorHtml}
        ${resourcesHtmlMarkup}
        <div id="lesson-checklist-zone"></div>
        <div id="lesson-quiz-zone"></div>
        <div class="lesson-actions">
          <button class="btn btn-primary" id="btn-complete">${done ? t("lesson.unmarkComplete") : t("lesson.markComplete")}</button>
          ${prev ? `<button class="btn btn-secondary" id="btn-prev">${icons ? icons.get('arrowLeft', '', '16') + ' ' : '← '}${t("lesson.prev")}</button>` : ""}
          ${next ? `<button class="btn btn-secondary" id="btn-next">${t("lesson.next")} ${icons ? icons.get('arrowRight', '', '16') : '→'}</button>` : ""}
          <button class="btn btn-outline" id="btn-feedback" style="margin-left: auto; display:inline-flex; align-items:center; gap:0.4rem;">${icons ? icons.get('feedback', '', '16') + ' ' : ''}${lang === "en" ? "Feedback" : "Feedback"}</button>
        </div>
      </article>`;
  }

  function buildLessonFeedbackHtml(lang, icons, t) {
    return `
      <div class="lesson-feedback-form" id="lesson-feedback-form" style="display:none;margin-top:1rem;padding:1rem;background:var(--surface-2);border-radius:10px;">
        <h3 style="margin-top:0;">${lang === "en" ? "Feedback" : "Feedback"}</h3>
        <div class="feedback-rating" style="display:flex;gap:0.5rem;margin-bottom:0.75rem;flex-wrap:wrap;">
          ${["1", "2", "3", "4", "5"].map((value) => `
            <label style="display:flex;align-items:center;gap:0.25rem;">
              <input type="radio" name="feedback-rating" value="${value}">
              <span>${value}</span>
            </label>`).join("")}
        </div>
        <textarea id="feedback-text" rows="4" style="width:100%;resize:vertical;" placeholder="${lang === "en" ? "Tell us what was helpful or confusing" : "Conte-nos o que foi útil ou confuso"}"></textarea>
        <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
          <button class="btn btn-primary btn-sm" id="btn-feedback-submit">${t("lesson.feedbackThanks")}</button>
          <button class="btn btn-secondary btn-sm" id="btn-feedback-cancel">${lang === "en" ? "Cancel" : "Cancelar"}</button>
        </div>
      </div>`;
  }

  function buildLessonPageHtml(options) {
    const {
      rawCourse,
      rawLesson,
      course,
      track,
      lesson,
      progressMap,
      isBookmarked,
      prev,
      next,
      lang,
      t,
      tierLabel,
      escapeHtml,
      icons,
      getTrackIcon,
      getEnrichment,
      localizedLesson,
      processedContent,
      primerHtml,
      seniorHtml,
    } = options;

    const sidebarHtml = buildLessonSidebarHtml(
      rawCourse,
      rawLesson,
      localizedLesson,
      progressMap,
      track,
      course,
      t,
      icons,
      getTrackIcon,
      tierLabel,
      escapeHtml,
    );

    const bodyHtml = buildLessonBodyHtml({
      lesson,
      processedContent,
      primerHtml,
      seniorHtml,
      rawLesson,
      rawTrack: track,
      rawCourse,
      done: !!progressMap[rawLesson.id],
      isBookmarked,
      prev,
      next,
      lang,
      t,
      tierLabel,
      escapeHtml,
      icons,
      getTrackIcon,
      getEnrichment,
    });

    return `
      <div class="lesson-layout">
        ${sidebarHtml}
        ${bodyHtml}
        ${buildLessonFeedbackHtml(lang, icons, t)}
      </div>`;
  }

  const api = {
    buildLessonSidebarHtml,
    buildLessonBodyHtml,
    buildLessonFeedbackHtml,
    buildLessonPageHtml,
  };

  window.NVLessonRenderers = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
