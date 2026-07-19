// Lightweight debug helpers to expose safe test hooks when available.
(function () {
  "use strict";

  function waitFor(fn, timeout = 3000, interval = 100) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      (function poll() {
        try {
          if (fn()) return resolve(true);
        } catch (e) {
          // ignore
        }
        if (Date.now() - start > timeout) return reject(new Error("timeout"));
        setTimeout(poll, interval);
      })();
    });
  }

  waitFor(() => window.renderLesson && window.navigate, 3000, 120)
    .then(() => {
      window.devHelpers = window.devHelpers || {};
      window.devHelpers.renderLesson = (id) => {
        try {
          window.renderLesson(id);
          return { ok: true };
        } catch (e) {
          return { ok: false, error: String(e) };
        }
      };
      window.devHelpers.navigate = (view, params) => {
        try {
          window.navigate(view, params || {});
          return { ok: true };
        } catch (e) {
          return { ok: false, error: String(e) };
        }
      };
      window.devHelpers.findLesson = (id) => {
        try {
          return window.findLesson ? window.findLesson(id) : null;
        } catch (e) {
          return null;
        }
      };
      window.devHelpers.ready = true;
      console.info("[devHelpers] ready");
    })
    .catch(() => {
      window.devHelpers = window.devHelpers || {};
      window.devHelpers.ready = false;
      console.warn("[devHelpers] not available (renderLesson/navigate not found)");
    });

// Always provide a direct renderer that uses the static lesson data model
window.devHelpers = window.devHelpers || {};
window.devHelpers.renderLessonDirect = function (lessonId) {
  try {
    const tracks = window.TG_QAWAY_TRACKS || [];
    let found = null;
    for (const t of tracks) {
      for (const c of t.courses || []) {
        for (const l of c.lessons || []) {
          if (l.id === lessonId) {
            found = { track: t, course: c, lesson: l };
            break;
          }
        }
        if (found) break;
      }
      if (found) break;
    }
    if (!found) return { ok: false, error: 'lesson not found' };

    const sidebarLessonsHtml = (found.course.lessons || [])
      .map((ll) => `<li class="sidebar-lesson" data-lesson="${ll.id}" tabindex="0" role="button">${ll.title}</li>`)
      .join('');

    // sanitize content to remove inline backgrounds that break dark theme
    const stripInlineBackgrounds = (html) => {
      if (!html) return html;
      let cleaned = html.replace(/background(?:-color)?\s*:\s*[^;\"']+;?/gi, '');
      cleaned = cleaned.replace(/style\s*=\s*\"\s*\"/gi, '');
      return cleaned;
    };

    const contentHtml = `<div class="lesson-layout"><aside class="lesson-sidebar"><div class="sidebar-track">${found.track.title}</div><div class="sidebar-course">${found.course.title}</div><ul class="sidebar-lessons">${sidebarLessonsHtml}</ul></aside><article class="lesson-content"><div class="lesson-header-row"><h1>${found.lesson.title}</h1></div><div class="lesson-meta-row"><span class="lesson-meta-item">${found.lesson.duration||''}</span></div><div class="lesson-body">${stripInlineBackgrounds(found.lesson.content)}</div></article></div>`;

    let zone = document.getElementById('lesson-detail');
    if (!zone) {
      zone = document.createElement('div');
      zone.id = 'lesson-detail';
      document.body.appendChild(zone);
    }
    zone.innerHTML = contentHtml;

    // attach click handlers
    zone.querySelectorAll('.sidebar-lesson').forEach((el) => {
      el.addEventListener('click', () => window.devHelpers.renderLessonDirect(el.dataset.lesson));
    });

    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
};
})();
