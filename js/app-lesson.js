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

  function renderChecklist(trackId, container) {
    const state = getState();
    const helpers = getHelpers();
    const data = window.TG_CHECKLISTS?.[trackId]?.[getLangKey()] || window.TG_CHECKLISTS?.[trackId]?.pt;
    if (!data) return "";

    const savedItems = state.checklistState[trackId] || [];
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
      window.NVViewHelpers.bindChecklistHandlers(
        container,
        trackId,
        data,
        state.checklistState,
        helpers.t,
        (updatedState) => window.saveJson("testers-guild-checklists", updatedState),
        () => {
          helpers.checkAchievements();
          window.showToast(
            state.lang === "en"
              ? "Project checklist complete!"
              : "Checklist do projeto completo!",
          );
        },
      );
    }
    return html;
  }

  function renderLessonQuiz(lessonId, container) {
    const lessonQuizzes = window.TG_LESSON_QUIZZES || {};
    const quizData = lessonQuizzes[lessonId]?.[getLangKey()] || lessonQuizzes[lessonId]?.pt;
    if (!quizData) return;

    if (container) {
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
  }

  async function renderLesson(lessonId) {
    const state = getState();
    const helpers = getHelpers();
    const found = helpers.findLesson(lessonId);
    if (!found) return;

    const { track, course, lesson, rawTrack, rawCourse, rawLesson } = found;
    const enr = helpers.getEnrichment(rawLesson.id);
    const isBookmarked = state.bookmarks.includes(rawLesson.id);
    const lessonContent = rawLesson?.content
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
    const contentLesson = {
      ...lesson,
      title: lessonContent.title || lesson.title,
      duration: lessonContent.duration || lesson.duration,
      content: lessonContent.content,
    };

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

    const sanitized = window.NVViewHelpers.cleanInlineBackgrounds(contentLesson.content);
    const processedContent = helpers.highlightCode(sanitized);
    document.getElementById("lesson-detail").innerHTML = window.NVLessonRenderers.buildLessonPageHtml({
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

    helpers.attachCopyButtons(document.getElementById("lesson-detail"));

    if (isFinalProject) {
      const zone = document.getElementById("lesson-checklist-zone");
      renderChecklist(rawTrack.id, zone);
    }

    const quizZone = document.getElementById("lesson-quiz-zone");
    if (quizZone) {
      renderLessonQuiz(rawLesson.id, quizZone);
    }

    window.NVViewHelpers.bindLessonPageActions({
      lessonId,
      rawLesson,
      prevLessonId: prev?.id,
      nextLessonId: next?.id,
      navigate: helpers.navigate,
      onBookmarkToggle: helpers.toggleBookmark,
      onCompleteToggle: (lessonIdToToggle) => {
        window.NVViewHelpers.toggleLessonComplete(
          lessonIdToToggle,
          state.progress,
          () => helpers.saveProgress(state.progress),
          helpers.checkAchievements,
          helpers.t,
        );
      },
      onReRender: renderLesson,
      onFeedbackSubmit: ({ lessonId: submittedLessonId, rating, text }) => {
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
      },
      t: helpers.t,
    });
  }

  window.NVAppLesson = {
    renderChecklist,
    renderLessonQuiz,
    renderLesson,
  };
  window.renderLesson = renderLesson;
})();
