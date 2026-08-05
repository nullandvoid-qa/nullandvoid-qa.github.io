(function () {
  function getState() {
    return window.NVApp?.state || {};
  }

  function getHelpers() {
    return window.NVApp?.helpers || {};
  }

  function getLangKey() {
    return getState().lang === "en" ? "en" : "pt";
  }

  function safeEscapeHtml(value) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(value);
    return String(value == null ? '' : value);
  }

  function buildEmptyState(message, className = 'lesson-empty-state') {
    const text = message == null ? '' : String(message);
    if (window.NVViewHelpers?.buildEmptyStateHtml) {
      return window.NVViewHelpers.buildEmptyStateHtml(text, className, safeEscapeHtml);
    }
    const classes = ['empty-state', className].filter(Boolean);
    return `<div class="${classes.join(' ')}" role="status" aria-live="polite"><p>${safeEscapeHtml(text)}</p></div>`;
  }

  function safeSaveJson(key, data) {
    if (typeof window !== 'undefined' && window.NVAppStorage?.safeSaveJson) {
      try { window.NVAppStorage.safeSaveJson(key, data); return; } catch (e) { /* ignore */ }
    }
    if (typeof window !== 'undefined' && typeof window.saveJson === 'function') {
      try { window.saveJson(key, data); return; } catch (e) { /* ignore */ }
    }
    if (typeof saveJson === 'function') {
      try { saveJson(key, data); return; } catch (e) { /* ignore */ }
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      // ignore
    }
  }

  function buildLessonSkeleton() {
    if (window.NVViewHelpers?.buildLessonSkeletonHtml) {
      return window.NVViewHelpers.buildLessonSkeletonHtml();
    }
    return '<div class="lesson-skeleton"><p>Loading lesson...</p></div>';
  }

  function renderChecklist(trackId, container) {
    const state = getState();
    const helpers = getHelpers();
    const data = window.TG_CHECKLISTS?.[trackId]?.[getLangKey()] || window.TG_CHECKLISTS?.[trackId]?.pt;
    if (!data) return "";

    if (typeof window.NVViewHelpers?.buildChecklistHtml !== 'function') return "";

    const savedItems = state.checklistState?.[trackId] || [];
    const html = window.NVViewHelpers.buildChecklistHtml(
      trackId,
      data,
      savedItems,
      state.lang,
      window.NVIcons,
      window.escapeHtml,
      helpers.t,
    );

    if (container) {
      container.insertAdjacentHTML("beforeend", html);
      if (typeof window.NVViewHelpers?.bindChecklistHandlers === 'function') {
        window.NVViewHelpers.bindChecklistHandlers(
          container,
          trackId,
          data,
          state.checklistState,
          helpers.t,
          (updatedState) => safeSaveJson("testers-guild-checklists", updatedState),
          () => {
            helpers.checkAchievements?.();
            if (typeof window.showToast === 'function') {
              window.showToast(
                state.lang === "en"
                  ? "Project checklist complete!"
                  : "Checklist do projeto completo!",
              );
            }
          },
        );
      }
    }
    return html;
  }

  function renderLessonQuiz(lessonId, container) {
    const lessonQuizzes = window.TG_LESSON_QUIZZES || {};
    const quizData = lessonQuizzes[lessonId]?.[getLangKey()] || lessonQuizzes[lessonId]?.pt;
    if (!quizData || !container) return;
    if (typeof window.NVViewHelpers?.renderLessonQuiz !== 'function') return;

    window.NVViewHelpers.renderLessonQuiz(
      lessonId,
      container,
      quizData,
      getState().lang,
      window.NVIcons,
      window.escapeHtml,
      getHelpers().t,
    );
  }

  async function renderLesson(lessonId) {
    const state = getState();
    const helpers = getHelpers();
    const lessonDetail = document.getElementById("lesson-detail");
    if (lessonDetail) {
      lessonDetail.innerHTML = buildLessonSkeleton();
    }

    const frameWait = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
      ? new Promise((resolve) => window.requestAnimationFrame(resolve))
      : Promise.resolve();

    await frameWait;

    const found = helpers.findLesson(lessonId);
    if (!found) {
      if (lessonDetail) {
        lessonDetail.innerHTML = buildEmptyState(
          helpers.t?.("lesson.notFound", "Esta lição não está disponível no momento.") || "Esta lição não está disponível no momento.",
          "lesson-empty-state",
        );
      }
      return;
    }

    const { track, course, lesson, rawTrack, rawCourse, rawLesson } = found;
    const enr = helpers.getEnrichment(rawLesson.id);
    const isBookmarked = state.bookmarks.includes(rawLesson.id);
    let lessonContent = rawLesson?.content
      ? {
          content: rawLesson.content,
          title: rawLesson.title || lesson.title,
          duration: rawLesson.duration || lesson.duration,
        }
      : window.NVLessonContent?.loadLessonContent
        ? await window.NVLessonContent.loadLessonContent(rawLesson, {
            markdownMap: window.TG_LESSON_MARKDOWN_MAP,
          })
        : { content: lesson.content, title: lesson.title, duration: lesson.duration };

    if (!lessonContent?.content && !lessonContent?.title) {
      lessonContent = {
        content: helpers.t?.("lesson.loadError", "Conteúdo indisponível no momento. Tente novamente mais tarde.") || "Conteúdo indisponível no momento. Tente novamente mais tarde.",
        title: lesson.title || rawLesson.title || helpers.t?.("lesson.loadErrorTitle", "Lição indisponível") || "Lição indisponível",
        duration: lesson.duration || rawLesson.duration || "",
      };
    }

    const contentLesson = {
      ...lesson,
      title: lessonContent.title || lesson.title,
      duration: lessonContent.duration || lesson.duration,
      content: lessonContent.content,
    };

    if (typeof window.NVViewHelpers?.setupLessonHeader === 'function') {
      window.NVViewHelpers.setupLessonHeader(
        lessonId,
        track,
        rawTrack.id,
        contentLesson.title,
        helpers.navigate,
        helpers.saveLastLesson,
        window.NVIcons,
        helpers.getTrackIcon,
        window.escapeHtml,
      );
    }

    const primerText = !state.seniorMode
      ? enr.primer?.[getLangKey()] || enr.primer?.pt
      : null;
    const seniorText = enr.seniorNote?.[getLangKey()] || enr.seniorNote?.pt;
    const primerHtml = primerText
      ? `<aside class="lesson-box lesson-box-beginner"><h3>${helpers.t("lesson.primerTitle")}</h3><p>${window.escapeHtml(primerText)}</p></aside>`
      : "";
    const seniorHtml = seniorText
      ? `<aside class="lesson-box lesson-box-senior"><h3>${helpers.t("lesson.seniorTitle")}</h3><p>${window.escapeHtml(seniorText)}</p></aside>`
      : "";

    const allLessons = Array.isArray(rawTrack?.courses)
      ? rawTrack.courses.flatMap((c) => c.lessons || [])
      : [];
    const idx = allLessons.findIndex((l) => l.id === rawLesson.id);
    const prev = allLessons[idx - 1];
    const next = allLessons[idx + 1];
    const isFinalProject =
      rawLesson.id.endsWith("-l1") &&
      ["s12", "w10", "a9", "m8", "p8", "sec6", "dev5", "a11y5", "lead4"].includes(rawCourse.id);

    const sanitized = typeof window.NVViewHelpers?.cleanInlineBackgrounds === 'function'
      ? window.NVViewHelpers.cleanInlineBackgrounds(contentLesson.content)
      : contentLesson.content;
    const processedContent = typeof helpers.highlightCode === 'function'
      ? helpers.highlightCode(sanitized)
      : String(sanitized);
    if (typeof window.NVLessonRenderers?.buildLessonPageHtml === 'function') {
      lessonDetail.innerHTML = window.NVLessonRenderers.buildLessonPageHtml({
        rawCourse,
        rawLesson,
        course,
        track,
        lesson: contentLesson,
        progressMap: state.progress,
        isBookmarked,
        prev,
        next,
        lang: state.lang,
        t: helpers.t,
        tierLabel: helpers.tierLabel,
        escapeHtml: window.escapeHtml,
        icons: window.NVIcons,
        getTrackIcon: helpers.getTrackIcon,
        getEnrichment: helpers.getEnrichment,
        localizedLesson: helpers.localizedLesson,
        processedContent,
        primerHtml,
        seniorHtml,
      });
    } else {
      lessonDetail.innerHTML = `<article class="lesson-page"><h1>${safeEscapeHtml(contentLesson.title)}</h1><div class="lesson-body">${safeEscapeHtml(processedContent)}</div></article>`;
    }

    helpers.attachCopyButtons(document.getElementById("lesson-detail"));

    if (isFinalProject) {
      const zone = document.getElementById("lesson-checklist-zone");
      renderChecklist(rawTrack.id, zone);
    }

    const quizZone = document.getElementById("lesson-quiz-zone");
    if (quizZone) {
      renderLessonQuiz(rawLesson.id, quizZone);
    }

    if (typeof window.NVViewHelpers?.bindLessonPageActions === 'function') {
      window.NVViewHelpers.bindLessonPageActions({
        lessonId,
        rawLesson,
        prevLessonId: prev?.id,
        nextLessonId: next?.id,
        navigate: helpers.navigate,
        onBookmarkToggle: helpers.toggleBookmark,
        onCompleteToggle: (lessonIdToToggle) => {
          if (typeof window.NVViewHelpers?.toggleLessonComplete === 'function') {
            window.NVViewHelpers.toggleLessonComplete(
              lessonIdToToggle,
              state.progress,
              () => helpers.saveProgress(state.progress),
              helpers.checkAchievements,
              helpers.t,
            );
          }
        },
        onReRender: renderLesson,
        onFeedbackSubmit: ({ lessonId: submittedLessonId, rating, text }) => {
          if (typeof window.NVViewHelpers?.submitLessonFeedback === 'function') {
            window.NVViewHelpers.submitLessonFeedback(
              { lessonId: submittedLessonId, rating, text },
              {
                onAfter: () => {
                  const ft = document.getElementById("feedback-text");
                  if (ft) ft.value = "";
                  document.querySelectorAll("input[name=\"feedback-rating\"]").forEach((r) => (r.checked = false));
                },
                t: helpers.t,
              },
            );
          }
        },
        t: helpers.t,
      });
    }
  }

  window.NVAppLesson = {
    renderChecklist,
    renderLessonQuiz,
    renderLesson,
  };
  window.renderLesson = renderLesson;
})();
