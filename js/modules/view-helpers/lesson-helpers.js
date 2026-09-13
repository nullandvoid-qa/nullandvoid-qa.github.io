/**
 * Lesson Helper Functions
 * Lesson page actions, headers, completion, and feedback
 */

const { bindAccessibleAction } = require('./ui-helpers');

function setupLessonHeader(lessonId, track, rawTrackId, lessonTitle, navigate, saveLastLesson) {
  if (typeof saveLastLesson === 'function') saveLastLesson(lessonId);

  const trackLinkEl = document.getElementById('lesson-track-link');
  if (trackLinkEl) {
    trackLinkEl.textContent = track?.title || '';
    trackLinkEl.onclick = (e) => {
      e.preventDefault();
      if (typeof navigate === 'function') navigate('track', { trackId: rawTrackId });
    };
  }

  const breadcrumbEl = document.getElementById('lesson-breadcrumb');
  if (breadcrumbEl) breadcrumbEl.textContent = lessonTitle || '';
}

function toggleLessonComplete(lessonId, progressObj, saveProgressFn, checkAchievementsFn, t) {
  if (!lessonId || typeof progressObj !== 'object') return;
  if (progressObj[lessonId]) {
    delete progressObj[lessonId];
    window.showToast?.(t("toast.lessonUndone"));
  } else {
    progressObj[lessonId] = { completedAt: new Date().toISOString() };
    window.showToast?.(t("toast.lessonDone"));
  }
  if (typeof saveProgressFn === 'function') saveProgressFn();
  if (typeof checkAchievementsFn === 'function') checkAchievementsFn();
}

function submitLessonFeedback({ lessonId, rating, text }, opts = {}) {
  if (!lessonId) return;
  try {
    const feedbacks = JSON.parse(localStorage.getItem('nvqa_feedbacks') || '[]');
    feedbacks.push({ lessonId, rating, text, timestamp: new Date().toISOString() });
    localStorage.setItem('nvqa_feedbacks', JSON.stringify(feedbacks));
    if (opts && typeof opts.onAfter === 'function') opts.onAfter();
    window.showToast?.(opts?.t ? opts.t('lesson.feedbackThanks') : 'Thanks for the feedback');
  } catch (e) {
    console.error(e);
  }
}

function bindLessonPageActions(options) {
  const {
    rawLesson,
    prevLessonId,
    nextLessonId,
    navigate,
    onBookmarkToggle,
    onCompleteToggle,
    onReRender,
    onFeedbackSubmit,
    t,
  } = options;

  const bookmarkBtn = document.getElementById("btn-bookmark");
  const completeBtn = document.getElementById("btn-complete");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const feedbackBtn = document.getElementById("btn-feedback");
  const feedbackForm = document.getElementById("lesson-feedback-form");
  const feedbackSubmitBtn = document.getElementById("btn-feedback-submit");
  const feedbackCancelBtn = document.getElementById("btn-feedback-cancel");

  if (bookmarkBtn) {
    bookmarkBtn.addEventListener("click", () => {
      onBookmarkToggle(rawLesson.id);
      if (typeof onReRender === "function") onReRender(rawLesson.id);

      const bookmarkState = Array.isArray(window.NVApp?.state?.bookmarks)
        ? window.NVApp.state.bookmarks.includes(rawLesson.id)
        : false;
      bookmarkBtn.classList.toggle("bookmarked", bookmarkState);
      const bookmarkTitle = bookmarkState ? (t ? t("lesson.unbookmark") : "Unbookmark") : (t ? t("lesson.bookmark") : "Bookmark");
      bookmarkBtn.setAttribute("title", bookmarkTitle);
      bookmarkBtn.setAttribute("aria-label", bookmarkTitle);
    });
  }

  if (completeBtn) {
    completeBtn.addEventListener("click", () => {
      onCompleteToggle(rawLesson.id);
      if (typeof onReRender === "function") onReRender(rawLesson.id);

      const progressState = window.NVApp?.state?.progress || {};
      const isDone = !!progressState[rawLesson.id];
      completeBtn.textContent = isDone
        ? (t ? t("lesson.unmarkComplete") : "Unmark complete")
        : (t ? t("lesson.markComplete") : "Mark complete");
    });
  }

  if (btnPrev && prevLessonId) {
    btnPrev.addEventListener("click", () => navigate("lesson", { lessonId: prevLessonId }));
  }
  if (btnNext && nextLessonId) {
    btnNext.addEventListener("click", () => navigate("lesson", { lessonId: nextLessonId }));
  }

  if (feedbackBtn && feedbackForm) {
    feedbackBtn.addEventListener("click", () => {
      feedbackForm.style.display = feedbackForm.style.display === "none" ? "block" : "none";
    });
  }

  if (feedbackSubmitBtn) {
    feedbackSubmitBtn.addEventListener("click", () => {
      const rating = document.querySelector('input[name="feedback-rating"]:checked')?.value || "unrated";
      const text = document.getElementById("feedback-text").value;
      if (typeof onFeedbackSubmit === "function") {
        onFeedbackSubmit({ lessonId: rawLesson.id, rating, text });
      }
      if (feedbackForm) feedbackForm.style.display = "none";
    });
  }

  if (feedbackCancelBtn && feedbackForm) {
    feedbackCancelBtn.addEventListener("click", () => {
      feedbackForm.style.display = "none";
    });
  }

  document.querySelectorAll(".sidebar-lesson").forEach((el) => {
    const open = () => navigate("lesson", { lessonId: el.dataset.lesson });
    bindAccessibleAction(el, open);
  });
}

function buildTrackCoursesHtml(track, progressMap, getEnrichment, localizedLesson, localizedCourse, escapeHtml, t, icons) {
  if (!track?.courses?.length) return "";

  return track.courses
    .map((rawCourse, idx) => {
      if (!rawCourse || !rawCourse.lessons) return "";
      const course = localizedCourse(rawCourse);
      const lessonsHtml = rawCourse.lessons
        .map((rawLesson) => {
          const lesson = localizedLesson(rawLesson);
          const enr = getEnrichment(rawLesson.id);
          const done = !!progressMap[rawLesson.id];
          return `<li class="lesson-item ${done ? "completed" : ""}" data-lesson="${rawLesson.id}" tabindex="0" role="button" aria-label="${escapeHtml(lesson.title)}">
            <div class="lesson-check">${done ? (icons ? icons.get('check','','16') : '✓') : ''}</div>
            <div class="lesson-info">
              <div class="lesson-title">${escapeHtml(lesson.title)}</div>
              <div class="lesson-duration">${icons ? icons.get('clock','','12') + ' ' : ''}${escapeHtml(lesson.duration)} · <span class="tier-badge tier-${enr.tier}">${t("track.free")}</span></div>
            </div>
            <span class="lesson-unlock">${t("track.free")}</span>
          </li>`;
        })
        .join("");

      return `<div class="course-block course-card"><div class="course-header"><span class="course-num">${idx + 1}</span>${escapeHtml(course.title)}</div><ul class="lesson-list">${lessonsHtml}</ul></div>`;
    })
    .join("");
}

module.exports = {
  setupLessonHeader,
  toggleLessonComplete,
  submitLessonFeedback,
  bindLessonPageActions,
  buildTrackCoursesHtml,
};
