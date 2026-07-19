(function () {
  "use strict";

  function createFilterChipMarkup(filters, activeFilter, t) {
    return filters
      .map(
        (filter) =>
          `<button type="button" class="filter-chip ${activeFilter === filter ? "active" : ""}" data-filter="${filter}">${t("filter." + filter)}</button>`,
      )
      .join("");
  }

  function getAvatarState(progressPercent, lang) {
    const pct = Number(progressPercent) || 0;

    if (pct >= 70) {
      return {
        icon: "crown",
        iconSize: "48",
        iconClass: "nv-icon-accent",
        level: lang === "en" ? "Senior" : "Sênior",
        progressText:
          lang === "en"
            ? "Congratulations! You reached the highest level."
            : "Parabéns! Você atingiu o nível máximo",
      };
    }

    if (pct >= 35) {
      return {
        icon: "bolt",
        iconSize: "48",
        iconClass: "nv-icon-pink",
        level: lang === "en" ? "Intermediate" : "Intermediário",
        progressText: `${pct}% completed`,
      };
    }

    return {
      icon: "seedling",
      iconSize: "48",
      iconClass: "nv-icon-accent",
      level: lang === "en" ? "Beginner" : "Iniciante",
      progressText: `${pct}% completed`,
    };
  }

  function wireFilterBar(container, filters, activeFilter, t, onSelect) {
    if (!container) return;

    container.innerHTML = createFilterChipMarkup(filters, activeFilter, t);
    container.querySelectorAll(".filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        onSelect(btn.dataset.filter);
      });
    });
  }

  function bindAccessibleAction(element, onActivate) {
    if (!element) return;

    element.addEventListener("click", () => onActivate());
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onActivate();
      }
    });
  }

  function setActiveView(documentRef, view, activeNav) {
    const views = documentRef.querySelectorAll(".view") || [];
    views.forEach((v) => v.classList.remove("active"));

    const viewEl = documentRef.getElementById("view-" + view);
    if (viewEl) viewEl.classList.add("active");

    const navLinks = documentRef.querySelectorAll(".nav-links a[data-nav]") || [];
    navLinks.forEach((a) => {
      const nav = a.dataset.nav;
      a.classList.toggle(
        "active",
        nav === view || ((view === "track" || view === "lesson" || view === "quiz") && nav === activeNav),
      );
    });
  }

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
    banner.innerHTML = `
      <div class="continue-inner">
        <div>
          <div class="continue-label">${t("dashboard.continueTitle")}</div>
          <div class="continue-lesson">${escapeHtml(found.lesson.title)}</div>
          <div class="continue-track">${icons ? icons.get(getTrackIcon(found.track), 'search-result-icon', '14') + ' ' : found.track.icon} ${escapeHtml(found.track.title)}</div>
        </div>
        <button class="btn btn-primary" id="btn-continue">${t("dashboard.continueBtn")}</button>
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

  function renderHomeView(options) {
    const {
      global,
      tracks,
      persona,
      homeFilter,
      lang,
      avatarIcons,
      getTrackIcon,
      escapeHtml,
      t,
      renderTrackCard,
      renderHomeFilterBar,
      renderContinueBanner,
      renderHomeLessons,
      renderInstallBanner,
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
        : tracks.filter((tr) => TRACK_AUDIENCE[tr.id] === homeFilter);

    const grid = document.getElementById("home-tracks-grid");
    const emptyState = document.getElementById("home-tracks-empty");
    const summary = document.getElementById("home-tracks-summary");
    if (summary) summary.textContent = getHomeTrackSummary(filtered.length);

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

  function buildCertificateCard(track, existingCert, icons, lang, escapeHtml) {
    const title = escapeHtml(track.title || track.id);
    const label = existingCert
      ? `Gerado em ${new Date(existingCert.generatedAt).toLocaleDateString("pt-BR")}`
      : (lang === "en" ? "Certificate available" : "Certificado disponível");

    return `<div class="cert-card" style="border-left: 4px solid ${track.color}; padding: 1rem; background: var(--surface-2); border-radius: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">${track.icon} ${title}</h4>
          <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${label}</p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-cert-${track.id}" data-track="${track.id}" style="display:inline-flex;align-items:center;gap:0.4rem;">${icons ? icons.get('download','','14') : ''} ${lang === "en" ? "Download" : "Baixar"}</button>
      </div>
    </div>`;
  }

  function buildPortfolioTemplatesHtml(lang) {
    const isEn = lang === "en";
    return `
      <h3 class="section-title section-title-sm" style="margin-top: 2rem;">${isEn ? "Portfolio projects" : "Projetos para Portfólio"}</h3>
      <p class="section-sub">${isEn ? "Ready-made templates to build practical experience" : "Templates prontos para você ganhar experiência prática"}</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05)); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px;">
          <h4 style="margin-top: 0; color: #10b981;">${isEn ? "Starter QA Project" : "Starter QA Project"}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${isEn ? "10 manual tests + 3 automated ones. Great for getting started." : "10 testes manuais + 3 automatizados. Perfeito para começar."}</p>
          <a href="https://github.com/nullandvoid-qa/qa-templates/tree/main/starter-qa-project" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="width: 100%;">${isEn ? "Open template →" : "Acessar template →"}</a>
        </div>
        <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05)); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px;">
          <h4 style="margin-top: 0; color: #f59e0b;">${isEn ? "Web Automation Project" : "Web Automation Project"}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${isEn ? "20+ E2E tests with Page Object Model. Professional." : "20+ testes E2E com Page Object Model. Profissional."}</p>
          <a href="https://github.com/nullandvoid-qa/qa-templates/tree/main/web-automation-project" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="width: 100%;">${isEn ? "Open template →" : "Acessar template →"}</a>
        </div>
        <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05)); border: 1px solid rgba(139,92,246,0.3); border-radius: 12px;">
          <h4 style="margin-top: 0; color: #8b5cf6;">${isEn ? "View all templates" : "Ver todos os templates"}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${isEn ? "API, Performance, Mobile, Security, and more." : "API, Performance, Mobile, Security, e mais."}</p>
          <a href="https://github.com/nullandvoid-qa/qa-templates#-templates-dispon%C3%ADveis" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="width: 100%;">${isEn ? "Explore →" : "Explorar →"}</a>
        </div>
      </div>`;
  }

  function buildSearchResultsHtml(lessonMatches, glossaryMatches, icons, escapeHtml) {
    const lessonHtml = lessonMatches
      .slice(0, 8)
      .map(
        (l) => `
      <button type="button" class="search-result-item" data-lesson="${l.id}">
        <span class="search-result-icon">${icons ? icons.get('book','search-result-icon','16') : ''}</span>
        <span class="search-result-title">${escapeHtml(l.title)}</span>
        <span class="search-result-meta">${escapeHtml(l.trackTitle)} · ${escapeHtml(l.courseTitle)}</span>
      </button>`,
      )
      .join("");

    const glossaryHtml = glossaryMatches
      .slice(0, 3)
      .map(
        (g) => `
      <button type="button" class="search-result-item search-glossary-item" data-glossary="1">
        <span class="search-result-icon">${icons ? icons.get('book', 'search-result-icon', '16') : ''}</span>
        <span class="search-result-title">${escapeHtml(g.term)}</span>
        <span class="search-result-meta">${escapeHtml(g.def.substring(0, 80))}…</span>
      </button>`,
      )
      .join("");

    return lessonHtml + glossaryHtml;
  }

  function renderSearchResults(container, lessonMatches, glossaryMatches, icons, escapeHtml, t, onLessonOpen, onGlossaryOpen) {
    if (!container) return;

    if ((!lessonMatches || lessonMatches.length === 0) && (!glossaryMatches || glossaryMatches.length === 0)) {
      container.innerHTML = buildSearchEmptyStateHtml(t("dashboard.noResults"), escapeHtml);
      container.classList.remove("hidden");
      return;
    }

    container.innerHTML = buildSearchResultsHtml(lessonMatches, glossaryMatches, icons, escapeHtml);
    container.classList.remove("hidden");

    container.querySelectorAll(".search-result-item[data-lesson]").forEach((btn) => {
      btn.addEventListener("click", () => onLessonOpen(btn.dataset.lesson));
    });

    container.querySelectorAll(".search-glossary-item").forEach((btn) => {
      btn.addEventListener("click", () => onGlossaryOpen());
    });
  }

  function searchAndRender(container, query, getAllLessonsFn, glossaryItems, icons, escapeHtml, t, navigate) {
    if (!container) return;
    const q = String(query || "").trim().toLowerCase();
    if (!q) {
      container.classList.add("hidden");
      container.innerHTML = "";
      return;
    }

    const allLessons = typeof getAllLessonsFn === 'function' ? getAllLessonsFn() : [];
    const lessonMatches = allLessons.filter(
      (l) =>
        (String(l.title || '').toLowerCase().includes(q)) ||
        (String(l.trackTitle || '').toLowerCase().includes(q)) ||
        (String(l.courseTitle || '').toLowerCase().includes(q)),
    );

    const glossaryMatches = (Array.isArray(glossaryItems) ? glossaryItems : []).filter(
      (g) => (String(g.term || '').toLowerCase().includes(q)) || (String(g.def || '').toLowerCase().includes(q)),
    );

    renderSearchResults(
      container,
      lessonMatches,
      glossaryMatches,
      icons,
      escapeHtml,
      t,
      (lessonId) => {
        const input = document.getElementById('global-search');
        if (input) input.value = '';
        container.classList.add('hidden');
        if (typeof navigate === 'function') navigate('lesson', { lessonId });
      },
      () => {
        const input = document.getElementById('global-search');
        if (input) input.value = '';
        container.classList.add('hidden');
        if (typeof navigate === 'function') navigate('glossary');
      },
    );
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

  function bindTrackQuizHandlers(container, quizData, icons, lang, t, onBack, onRetry, onPassed) {
    if (!container) return;

    const form = container.querySelector("#quiz-form");
    const backBtn = container.querySelector("#btn-quiz-back");
    if (backBtn && typeof onBack === "function") {
      backBtn.addEventListener("click", (e) => {
        e.preventDefault();
        onBack();
      });
    }

    const quizState = { answers: {}, submitted: false };

    container.querySelectorAll(".quiz-radio").forEach((radio) => {
      radio.addEventListener("change", () => {
        const questionKey = radio.name.match(/^q(\d+)$/)?.[1];
        if (questionKey != null) {
          quizState.answers[questionKey] = parseInt(radio.value, 10);
        }
      });
    });

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (quizState.submitted) return;
      quizState.submitted = true;

      let correct = 0;
      quizData.questions.forEach((q, qi) => {
        const selected = quizState.answers[String(qi)];
        const explainEl = container.querySelector(`#explain-${qi}`);
        const qBlock = container.querySelector(`.quiz-question[data-qi="${qi}"]`);

        qBlock?.querySelectorAll(".quiz-option").forEach((lbl) => {
          const oi = parseInt(lbl.dataset.oi, 10);
          lbl.classList.add(oi === q.correct ? "correct" : "wrong-opt");
          if (selected === oi) lbl.classList.add("selected-opt");
        });
        qBlock?.querySelectorAll("input[type=radio]").forEach((r) => (r.disabled = true));

        if (selected === q.correct) correct++;
        if (explainEl && q.explain) {
          explainEl.textContent = q.explain;
          explainEl.classList.remove("hidden");
        }
      });

      const passed = correct >= quizData.passScore;
      const resultEl = container.querySelector("#quiz-result");
      if (resultEl) {
        resultEl.className = `quiz-result ${passed ? "quiz-passed" : "quiz-failed"}`;
        resultEl.innerHTML = buildQuizResultHtml(passed, correct, quizData.questions.length, icons, t, lang);
        resultEl.classList.remove("hidden");
      }

      if (passed && typeof onPassed === "function") {
        onPassed(correct);
      }

      if (!passed) {
        const retryBtn = container.querySelector("#btn-quiz-retry");
        if (retryBtn && typeof onRetry === "function") {
          retryBtn.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            onRetry();
          });
        }
      }
    });
  }

  function bindChecklistHandlers(container, trackId, data, checklistState, t, onSave, onComplete) {
    if (!container || !trackId || !data) return;

    container
      .querySelectorAll(`.checklist-check[data-track="${trackId}"]`)
      .forEach((cb) => {
        cb.addEventListener("change", () => {
          const idx = parseInt(cb.dataset.idx, 10);
          if (!Number.isFinite(idx)) return;

          if (!checklistState[trackId]) checklistState[trackId] = [];
          if (cb.checked) {
            if (!checklistState[trackId].includes(idx)) checklistState[trackId].push(idx);
          } else {
            checklistState[trackId] = checklistState[trackId].filter((x) => x !== idx);
          }

          if (typeof onSave === "function") onSave(checklistState);

          const progressEl = container.querySelector(`#ck-progress-${trackId}`);
          if (progressEl) {
            progressEl.textContent = `${checklistState[trackId].length}/${data.items.length} ${t("checklist.progress")}`;
          }
          cb.closest(".checklist-item")?.classList.toggle("checked", cb.checked);

          const allDone = checklistState[trackId].length >= data.items.length;
          if (allDone && typeof onComplete === "function") onComplete(trackId);
        });
      });
  }

  function bindLessonQuizHandlers(container, lessonId, quizData, icons, t, lang) {
    if (!container || !quizData || !lessonId) return;

    const form = container.querySelector(`#lq-form-${lessonId}`);
    if (!form) return;

    let submitted = false;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (submitted) return;
      submitted = true;

      let correct = 0;
      quizData.questions.forEach((q, qi) => {
        const selected = form.querySelector(`input[name="lq${lessonId}-q${qi}"]:checked`)?.value;
        const selectedIdx = selected ? parseInt(selected, 10) : -1;
        const explainEl = container.querySelector(`#lq-explain-${qi}`);

        form.querySelectorAll(`input[name="lq${lessonId}-q${qi}"]`).forEach((r) => {
          r.disabled = true;
          const label = r.closest(".lesson-quiz-option");
          if (!label) return;
          const value = parseInt(r.value, 10);
          if (selectedIdx === value) label.classList.add("selected-opt");
          if (value === q.correct) label.classList.add("correct-opt");
          else if (selectedIdx !== -1 && selectedIdx !== q.correct) label.classList.add("wrong-opt");
        });

        if (selectedIdx === q.correct) correct++;
        if (explainEl && q.explain) {
          explainEl.textContent = q.explain;
          explainEl.classList.remove("hidden");
        }
      });

      const passed = correct >= quizData.passScore;
      const resultEl = container.querySelector(`#lq-result-${lessonId}`);
      if (resultEl) {
        resultEl.className = `lesson-quiz-result ${passed ? "quiz-passed" : "quiz-failed"}`;
        resultEl.innerHTML = buildLessonQuizResultHtml(passed, correct, quizData.questions.length, icons, t, lang);
        resultEl.classList.remove("hidden");
      }
    });

    container.querySelector(`#lq-reset-${lessonId}`)?.addEventListener("click", () => {
      form.querySelectorAll("input[type='radio']").forEach((r) => {
        r.checked = false;
        r.disabled = false;
      });
      form.querySelectorAll(".lesson-quiz-option").forEach((opt) => {
        opt.classList.remove("selected-opt", "correct-opt", "wrong-opt");
      });
      form.querySelectorAll(".lesson-quiz-explain").forEach((e) => e.classList.add("hidden"));
      const resultElement = container.querySelector(`#lq-result-${lessonId}`);
      if (resultElement) resultElement.classList.add("hidden");
      submitted = false;
    });
  }

  function renderLessonQuiz(lessonId, container, quizData, lang, icons, escapeHtml, t) {
    if (!container || !quizData) return;

    container.insertAdjacentHTML(
      "beforeend",
      buildLessonQuizHtml(lessonId, quizData, lang, icons, escapeHtml),
    );
    bindLessonQuizHandlers(container, lessonId, quizData, icons, t, lang);
  }

  function bindLessonPageActions(options) {
    const {
      lessonId,
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
        if (typeof onReRender === "function") onReRender(lessonId);
      });
    }

    if (completeBtn) {
      completeBtn.addEventListener("click", () => {
        onCompleteToggle(rawLesson.id);
        if (typeof onReRender === "function") onReRender(lessonId);
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

  function cleanInlineBackgrounds(html) {
    if (!html || typeof html !== "string") return html;
    let cleaned = html.replace(/background(?:-color)?\s*:\s*[^;"']+;?/gi, "");
    cleaned = cleaned.replace(/style\s*=\s*"\s*"/gi, "");
    return cleaned;
  }

  function buildTrackCardHtml(track, options = {}) {
    const {
      prog,
      audience,
      isComplete,
      title,
      iconHtml,
      lang,
      icons,
      escapeHtml,
      t,
      tierLabel,
    } = options;

    const contentTitle = escapeHtml(title || track.title || track.id);
    const description = escapeHtml(track.description || "");
    const topics = Array.isArray(track.topics) ? track.topics : [];
    const topicTags = topics.slice(0, 3).map((topic) => `<span class="tag">${escapeHtml(topic)}</span>`).join("");

    return `
      <article class="track-card${isComplete ? " track-complete" : ""}" style="--track-color:${track.color || "#8b5cf6"};" role="button" tabindex="0">
        <div class="track-card-header">
          <span class="track-icon">${iconHtml}</span>
          <div class="track-badges">
            ${isComplete ? `<span class="badge-complete">${t("track.completed")}</span>` : ""}
            <span class="tier-badge tier-${audience}">${tierLabel(audience)}</span>
          </div>
        </div>
        <h3>${contentTitle}</h3>
        <p>${description}</p>
        <div class="track-meta">
          <span>${icons ? icons.get('package','','14') : ''} ${prog.total} ${t("track.modules")}</span>
          <span>${icons ? icons.get('clock','','14') : ''} ~${prog.total} ${t("track.hours")}</span>
        </div>
        <div class="track-tags">${topicTags}</div>
        <div class="track-progress">
          <div class="progress-bar"><div class="progress-fill" style="width:${prog.pct}%"></div></div>
          <div class="progress-text">${prog.done}/${prog.total} ${t("track.lessonsProgress")}${isComplete ? (icons ? icons.get('checkCircle','','16') : '✓') : ""}</div>
        </div>
      </article>`;
  }

  function buildTrackDetailHtml(track, coursesHtml, quizBtnHtml, prog, meta, helpers) {
    const { icons, escapeHtml, t, tierLabel, getTrackIcon } = helpers;
    const trackIconHtml = icons ? icons.get(getTrackIcon(track), 'track-icon-svg', '28') : track.icon;
    const trackTitle = escapeHtml(track.title || track.id);
    const trackDescription = escapeHtml(track.description || "");

    return `
      <div class="track-hero" style="--track-color:${track.color};border-left-color:${track.color}">
        <h1>${trackIconHtml} ${trackTitle}</h1>
        <p class="track-hero-desc">${trackDescription}</p>
        <div class="track-meta">
          <span>${icons ? icons.get('package','','14') : ''} ${meta.modules} ${t("track.modules")}</span>
          <span>${icons ? icons.get('clock','','14') : ''} ~${meta.hours} ${t("track.hoursLong")}</span>
          <span class="tier-badge tier-${meta.audience}">${tierLabel(meta.audience)}</span>
        </div>
        <div class="progress-bar" style="margin-top:1rem;max-width:400px">
          <div class="progress-fill" style="width:${prog.pct}%;background:${track.color}"></div>
        </div>
        <div class="progress-text">${prog.done}/${prog.total} ${t("track.lessonsDone")} ${prog.pct === 100 ? (icons ? icons.get('checkCircle','','16') : '✓') : ""}</div>
        <div class="track-hero-actions" style="margin-top:1rem;display:flex;gap:0.75rem;flex-wrap:wrap">
          ${quizBtnHtml}
        </div>
      </div>
      <div class="course-list">${coursesHtml}</div>`;
  }

  function buildDashboardStatsHtml(global, priceLabel, t, fallbackT) {
    const statsLabel = typeof t === "function" ? t : fallbackT;
    return `
      <div class="dash-card"><h3>${statsLabel("dashboard.lessonsCompleted")}</h3><div class="value">${global.done}/${global.total}</div></div>
      <div class="dash-card"><h3>${statsLabel("dashboard.overallProgress")}</h3>
        <div class="value">${global.pct}%</div>
        <div class="progress-bar" style="margin-top:0.5rem"><div class="progress-fill" style="width:${global.pct}%"></div></div>
      </div>
      <div class="dash-card"><h3>${statsLabel("dashboard.quizzesPassed")}</h3><div class="value">${global.passedCount}/9</div></div>
      <div class="dash-card"><h3>${statsLabel("dashboard.totalCost")}</h3><div class="value">${priceLabel}</div></div>`;
  }

  function buildBookmarksHtml(bookmarks, icons, escapeHtml, trackIconResolver) {
    if (!bookmarks.length) return "";

    return bookmarks
      .map((item) => {
        const iconName = typeof trackIconResolver === 'function' ? trackIconResolver(item) : trackIconResolver;
        return `
        <button class="search-result-item" data-lesson="${item.lessonId}">
          <span class="search-result-icon">${icons ? icons.get('bookmark','search-result-icon','16') : ''}</span>
          <span class="search-result-title">${escapeHtml(item.title)}</span>
          <span class="search-result-meta">${icons ? icons.get(iconName || 'bookmark','search-result-icon','14') : ''} ${escapeHtml(item.trackTitle)}</span>
        </button>`;
      })
      .join("");
  }

  function buildDashboardBookmarksSectionHtml(bookmarks, findLesson, icons, escapeHtml, trackIconResolver, emptyMessage) {
    if (!Array.isArray(bookmarks) || bookmarks.length === 0) {
      return buildDashboardEmptyStateHtml(emptyMessage || "", escapeHtml);
    }

    const items = bookmarks
      .map((lessonId) => {
        const found = findLesson(lessonId);
        if (!found) return null;
        return {
          lessonId,
          title: found.lesson.title,
          trackTitle: found.track.title,
          track: found.track,
        };
      })
      .filter(Boolean);

    const resolver = typeof trackIconResolver === 'function' ? (item) => trackIconResolver(item.track) : trackIconResolver;

    return items.length
      ? buildBookmarksHtml(items, icons, escapeHtml, resolver)
      : buildDashboardEmptyStateHtml(emptyMessage || "", escapeHtml);
  }

  function buildDashboardCertificatesSectionHtml(completedTracks, userCerts, localizedTrack, icons, lang, escapeHtml, emptyMessage) {
    if (!Array.isArray(completedTracks) || completedTracks.length === 0) {
      return buildDashboardEmptyStateHtml(emptyMessage || "", escapeHtml);
    }

    return completedTracks
      .map((track) => {
        const existingCert = Array.isArray(userCerts) ? userCerts.find((c) => c.trackId === track.id) : null;
        const localized = localizedTrack ? localizedTrack(track) : track;
        return buildCertificateCard(
          { ...track, title: localized.title, icon: track.icon },
          existingCert,
          icons,
          lang,
          escapeHtml,
        );
      })
      .join("");
  }

  function buildAchievementsHtml(achievementsList, unlocked, lang, escapeHtml, icons, t) {
    if (!Array.isArray(achievementsList)) return "";

    return achievementsList
      .map((ach) => {
        const isUnlocked = Array.isArray(unlocked) && unlocked.includes(ach.id);
        const data = (ach[lang] || ach.pt) || {};
        const lockedIcon = icons ? icons.get('lock', 'nv-icon-muted', '28') : '';
        return `<div class="achievement-card ${isUnlocked ? "unlocked" : "locked"}" title="${isUnlocked ? escapeHtml(data.desc || '') : "?"}">
          <div class="ach-icon">${isUnlocked ? ach.icon : lockedIcon}</div>
          <div class="ach-title">${isUnlocked ? escapeHtml(data.title || '') : "???"}</div>
          <div class="ach-desc">${isUnlocked ? escapeHtml(data.desc || '') : (lang === "en" ? "Keep learning to unlock" : "Continue estudando para desbloquear")}</div>
        </div>`;
      })
      .join("");
  }

  function bindDashboardBookmarkHandlers(container, navigate) {
    if (!container || typeof navigate !== "function") return;

    container.querySelectorAll("[data-lesson]").forEach((btn) => {
      btn.addEventListener("click", () => navigate("lesson", { lessonId: btn.dataset.lesson }));
    });
  }

  function bindDashboardCertificateHandlers(container, onDownload) {
    if (!container || typeof onDownload !== "function") return;

    container.querySelectorAll("[id^='btn-cert-']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!btn.dataset.track) return;
        await onDownload(btn.dataset.track);
      });
    });
  }

  function renderDashboardSections(targets, opts) {
    if (!targets || !opts) return;
    const {
      achievementsGrid,
      bookmarksSection,
      certificatesSection,
    } = targets;

    const {
      achievementsList,
      unlocked,
      bookmarks,
      findLesson,
      icons,
      escapeHtml,
      getTrackIcon,
      lang,
      t,
      getUserCertificates,
      completedTracks,
      onCertDownload,
      navigate,
    } = opts;

    if (achievementsGrid) {
      achievementsGrid.innerHTML = buildAchievementsHtml(
        achievementsList,
        unlocked,
        lang,
        escapeHtml,
        icons,
        t,
      );
    }

    if (bookmarksSection) {
      bookmarksSection.innerHTML = buildDashboardBookmarksSectionHtml(
        bookmarks,
        findLesson,
        icons,
        escapeHtml,
        getTrackIcon,
        lang === "en" ? "No bookmarked lessons yet." : "Nenhuma aula favoritada ainda.",
      );
      bindDashboardBookmarkHandlers(bookmarksSection, navigate);
    }

    if (certificatesSection) {
      const userCerts = typeof getUserCertificates === "function" ? getUserCertificates() : [];
      certificatesSection.innerHTML = buildDashboardCertificatesSectionHtml(
        completedTracks,
        userCerts,
        (track) => track,
        icons,
        lang,
        escapeHtml,
        lang === "en" ? "Complete a track to earn a certificate." : "Conclua uma trilha para ganhar um certificado.",
      );
      bindDashboardCertificateHandlers(certificatesSection, onCertDownload);
    }
  }

  function setupLessonHeader(lessonId, track, rawTrackId, lessonTitle, navigate, saveLastLesson, icons, getTrackIcon, escapeHtml) {
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
      showToast(t("toast.lessonUndone"));
    } else {
      progressObj[lessonId] = { completedAt: new Date().toISOString() };
      showToast(t("toast.lessonDone"));
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
      showToast(opts?.t ? opts.t('lesson.feedbackThanks') : 'Thanks for the feedback');
    } catch (e) {
      console.error(e);
    }
  }

  function buildGlossaryHtml(items, escapeHtml) {
    return items
      .map(
        (item) => `
      <article class="glossary-card">
        <h3>${escapeHtml(item.term)}</h3>
        <p>${escapeHtml(item.def)}</p>
      </article>`,
      )
      .join("");
  }

  function buildLabsHtml(labs, trackMap, icons, escapeHtml, getTrackIcon, lang) {
    const typeColors = {
      "Web E2E": "#3b82f6",
      Web: "#3b82f6",
      API: "#8b5cf6",
      Security: "#6366f1",
      Performance: "#ef4444",
      A11y: "#a855f7",
      Mobile: "#f59e0b",
      "Web + API": "#10b981",
    };

    return `<div class="labs-grid">${labs
      .map(
        (lab) => `
      <article class="lab-card">
        <div class="lab-header">
          <span class="lab-type-badge" style="background:${typeColors[lab.type] || "#10b981"}22;color:${typeColors[lab.type] || "#10b981"};border-color:${typeColors[lab.type] || "#10b981"}44">${escapeHtml(lab.type)}</span>
          <div class="lab-track-tags">${(lab.tracks || [])
            .map((tid) => {
              const tr = trackMap[tid];
              return tr
                ? `<span class="tag">${icons ? icons.get(getTrackIcon(tr), 'search-result-icon', '14') + ' ' : tr.icon} ${escapeHtml(tr.title)}</span>`
                : "";
            })
            .join("")}</div>
        </div>
        <h3><a href="${escapeHtml(lab.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(lab.name)}</a></h3>
        <p>${escapeHtml(lab.desc)}</p>
        <a href="${escapeHtml(lab.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm lab-open-btn">
          ${lang === "en" ? icons ? icons.get('externalLink','','14') + ' Open lab' : 'Open lab' : icons ? icons.get('externalLink','','14') + ' Abrir lab' : 'Abrir lab'}
        </a>
      </article>`,
      )
      .join("")}</div>`;
  }

  function buildSandboxExampleHtml(example, key, icons, escapeHtml, lang) {
    const explanation = example.explanation?.[lang] || example.explanation?.pt || "";
    const escapeHtmlFunc = (text) => {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
      return String(text).replace(/[&<>"']/g, (m) => map[m]);
    };

    return `
      <div class="sandbox-example-header">
        <h2>${escapeHtml(example.title)}</h2>
        <p class="sandbox-description">${escapeHtml(example.description)}</p>
      </div>

      <div class="sandbox-explanation">
        <strong>${icons ? icons.get('info','','18') + ' ' : ''}O que você aprende:</strong>
        <p>${escapeHtml(explanation)}</p>
      </div>

      <div class="sandbox-code-block">
        <div class="sandbox-code-header">
          <span class="sandbox-language">${escapeHtml(example.language)}</span>
          <button type="button" class="btn-copy-sandbox" onclick="window.copySandboxCode('${key}')">
            ${icons ? icons.get('copy','','18') + ' ' : ''}Copiar
          </button>
        </div>
        <pre class="sandbox-code"><code>${escapeHtmlFunc(example.code)}</code></pre>
      </div>

      ${example.output ? `
      <div class="sandbox-output">
        <strong>Output esperado:</strong>
        <pre>${escapeHtmlFunc(example.output)}</pre>
      </div>
      ` : ""}

      <div class="sandbox-cta">
        <p><strong>${icons ? icons.get('target','','18') + ' ' : ''}Próximos passos:</strong></p>
        <ul>
          <li>1. Copie o código acima (botão ${icons ? icons.get('copy','','18') : ''})</li>
          <li>2. Cole em seu arquivo de teste local</li>
          <li>3. Execute: <code>npm test</code> ou <code>k6 run</code></li>
          <li>4. Observe o output e entenda cada linha</li>
          <li>5. Modifique valores, experimente!</li>
        </ul>
      </div>`;
  }

  function buildSandboxPageHtml() {
    return `
      <div class="sandbox-view">
        <div class="sandbox-header">
          <h1>Interactive Sandbox</h1>
          <p>Exemplos de código interativos — copie, estude, execute em seu ambiente</p>
        </div>

        <div class="sandbox-container">
          <div class="sandbox-sidebar">
            <h3>Exemplos por trilha</h3>
            <div id="sandbox-menu" class="sandbox-menu"></div>
          </div>

          <div class="sandbox-main">
            <div id="sandbox-example" class="sandbox-example"></div>
          </div>
        </div>
      </div>`;
  }

  function buildSandboxMenuHtml(byTrack, trackTitles, escapeHtml) {
    return Object.entries(byTrack)
      .map(([track, examples]) => `
        <div class="sandbox-track-group">
          <div class="sandbox-track-title">${escapeHtml(trackTitles[track] || track)}</div>
          ${examples
            .map(
              (ex) => `<button type="button" class="sandbox-item" data-key="${escapeHtml(ex.key)}">${escapeHtml(ex.title)}</button>`,
            )
            .join("")}
        </div>`)
      .join("");
  }

  function buildQuizResultHtml(passed, correct, total, icons, t, lang) {
    const icon = passed
      ? (icons ? icons.get('checkCircle','','24') : '✓')
      : (icons ? icons.get('book','','24') : '');
    const title = passed ? t("quiz.passed") : t("quiz.failed");
    const scoreText = `${t("quiz.score")}: ${correct}/${total}`;

    return `
      <div class="quiz-result-icon">${icon}</div>
      <div class="quiz-result-title">${title}</div>
      <div class="quiz-result-score">${scoreText}</div>
      ${!passed ? `<button class="btn btn-primary btn-sm" id="btn-quiz-retry">${lang === "en" ? "Try Again" : "Tentar Novamente"}</button>` : ""}`;
  }

  function buildLessonQuizResultHtml(passed, correct, total, icons, t, lang) {
    const message = passed
      ? (icons ? icons.get('check','','14') + ' ' : '✓ ') + (lang === "en" ? "Great! You understand this." : "Ótimo! Você entendeu.")
      : (icons ? icons.get('book','','14') + ' ' : '') + (lang === "en" ? "Try again or review the lesson." : "Revise e tente novamente.");
    const scoreText = `${correct}/${total} ${lang === "en" ? "correct" : "correto"}`;

    return `
      <div class="lesson-quiz-result" style="padding: 1rem; background: ${passed ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"}; border-left: 3px solid ${passed ? "#10b981" : "#ef4444"}; border-radius: 8px;">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">${message}</div>
        <div style="font-size: 0.9rem; color: var(--text-muted);">${scoreText}</div>
      </div>`;
  }

  function buildTrackQuizHtml(track, quizData, quizState, lang, icons, escapeHtml, t) {
    const questionsHtml = quizData.questions
      .map(
        (q, qi) => `
      <div class="quiz-question" data-qi="${qi}">
        <p class="quiz-q-text"><strong>${qi + 1}.</strong> ${escapeHtml(q.q)}</p>
        <div class="quiz-options">
          ${q.options
            .map(
              (opt, oi) => `
            <label class="quiz-option" data-qi="${qi}" data-oi="${oi}">
              <input type="radio" name="q${qi}" value="${oi}" class="quiz-radio">
              <span class="quiz-option-text">${escapeHtml(opt)}</span>
            </label>`,
            )
            .join("")}
        </div>
        <div class="quiz-explain hidden" id="explain-${qi}"></div>
      </div>`,
      )
      .join("");

    return `
      <div class="quiz-card">
        <div class="quiz-track-header" style="border-left-color:${track.color}">
          <span class="track-icon">${track.icon}</span>
          <div>
            <h2>${escapeHtml(quizData.title)}</h2>
            <p class="quiz-meta">${quizData.questions.length} ${lang === "en" ? "questions" : "perguntas"} · ${lang === "en" ? "Pass" : "Aprovação"}: ${quizData.passScore}/${quizData.questions.length}</p>
          </div>
        </div>
        ${quizState.alreadyPassed ? `<div class="quiz-passed-banner">${icons ? icons.get('checkCircle','','16') + ' ' : ''}${lang === "en" ? "You already passed this quiz!" : "Você já passou neste quiz!"}</div>` : ""}
        <form id="quiz-form" class="quiz-form">
          ${questionsHtml}
          <div class="quiz-actions">
            <button type="submit" class="btn btn-primary">${t("quiz.submit")}</button>
            <button type="button" class="btn btn-secondary" id="btn-quiz-back">${t("quiz.backTrack")}</button>
          </div>
        </form>
        <div id="quiz-result" class="quiz-result hidden"></div>
      </div>`;
  }

  function buildChecklistHtml(trackId, data, savedItems, lang, icons, escapeHtml, t) {
    const allDone = savedItems.length >= data.items.length;
    const itemsHtml = data.items
      .map((item, i) => {
        const checked = savedItems.includes(i);
        return `<label class="checklist-item ${checked ? "checked" : ""}">
        <input type="checkbox" class="checklist-check" data-track="${trackId}" data-idx="${i}" ${checked ? "checked" : ""}>
        <span>${escapeHtml(item)}</span>
      </label>`;
      })
      .join("");

    return `<div class="checklist-box" id="checklist-${trackId}">
      <div class="checklist-header">
        <h3>${escapeHtml(data.title)}</h3>
        <span class="checklist-progress" id="ck-progress-${trackId}">${savedItems.length}/${data.items.length} ${t("checklist.progress")}</span>
      </div>
      <div class="checklist-items">${itemsHtml}</div>
      ${allDone ? `<div class="checklist-complete">${icons ? icons.get('checkCircle','','16') + ' ' : ''}${lang === "en" ? "Project complete! Great work." : "Projeto concluído! Parabéns."}</div>` : ""}
    </div>`;
  }

  function buildTrackCoursesHtml(track, progressMap, getEnrichment, localizedLesson, localizedCourse, escapeHtml, t, icons, getTrackIcon) {
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

        return `<div class="course-block"><div class="course-header"><span class="course-num">${idx + 1}</span>${escapeHtml(course.title)}</div><ul class="lesson-list">${lessonsHtml}</ul></div>`;
      })
      .join("");
  }

  function buildLessonQuizHtml(lessonId, quizData, lang, icons, escapeHtml) {
    const questionsHtml = quizData.questions
      .map((q, qi) => `
      <div class="lesson-quiz-question">
        <p><strong>${qi + 1}.</strong> ${escapeHtml(q.q)}</p>
        <div class="lesson-quiz-options">
          ${q.options
            .map((opt, oi) => `
            <label class="lesson-quiz-option">
              <input type="radio" name="lq${lessonId}-q${qi}" value="${oi}" class="lesson-quiz-radio">
              <span>${escapeHtml(opt)}</span>
            </label>`)
            .join("")}
        </div>
        <div class="lesson-quiz-explain hidden" id="lq-explain-${qi}"></div>
      </div>`)
      .join("");

    return `
      <div class="lesson-quiz-box" style="margin-top: 2rem; padding: 1.5rem; background: rgba(139, 92, 246, 0.1); border-left: 4px solid #8b5cf6; border-radius: 12px;">
        <h3 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem;">${icons ? icons.get('target','','18') + ' ' : ''}${escapeHtml(quizData.title)}</h3>
        <p style="color: var(--text-muted); margin: 0.5rem 0 1rem 0; font-size: 0.9rem;">${quizData.questions.length} ${lang === "en" ? "quick question(s)" : "pergunta(s) rápida(s)"} — ${lang === "en" ? "test your understanding" : "teste seu entendimento"}</p>
        <form id="lq-form-${lessonId}" class="lesson-quiz-form">
          ${questionsHtml}
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <button type="submit" class="btn btn-primary btn-sm">✓ ${lang === "en" ? "Check" : "Verificar"}</button>
            <button type="button" class="btn btn-secondary btn-sm" id="lq-reset-${lessonId}">${lang === "en" ? "Reset" : "Resetar"}</button>
          </div>
        </form>
        <div id="lq-result-${lessonId}" class="lesson-quiz-result hidden" style="margin-top: 1rem;"></div>
      </div>`;
  }

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
            <button type="button" class="btn btn-secondary btn-sm roadmap-go" data-track="${step.trackId}" data-lesson="${step.lessonId || ""}">${t("roadmap.start")}</button>
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

  function buildEmptyStateHtml(message, className, escapeHtml) {
    const classes = ["empty-state"];
    if (className) classes.push(className);
    return `<p class="${classes.join(" ")}">${escapeHtml(message)}</p>`;
  }

  function buildDashboardEmptyStateHtml(message, escapeHtml) {
    return buildEmptyStateHtml(message, "dashboard-empty-state", escapeHtml);
  }

  function buildSearchEmptyStateHtml(message, escapeHtml) {
    return `<div class="search-empty">${escapeHtml(message)}</div>`;
  }

  const api = {
    createFilterChipMarkup,
    getAvatarState,
    wireFilterBar,
    bindAccessibleAction,
    setActiveView,
    renderContinueBanner,
    renderInstallBanner,
    buildCertificateCard,
    buildPortfolioTemplatesHtml,
    buildSearchResultsHtml,
    buildTrackCardHtml,
    buildTrackDetailHtml,
    buildDashboardStatsHtml,
    buildBookmarksHtml,
    buildGlossaryHtml,
    buildLabsHtml,
    buildSandboxExampleHtml,
    buildQuizResultHtml,
    buildLessonQuizResultHtml,
    buildTrackQuizHtml,
    bindTrackQuizHandlers,
    bindChecklistHandlers,
    bindLessonQuizHandlers,
    renderLessonQuiz,
    bindLessonPageActions,
    setupLessonHeader,
    searchAndRender,
    toggleLessonComplete,
    submitLessonFeedback,
    buildAchievementsHtml,
    bindDashboardBookmarkHandlers,
    bindDashboardCertificateHandlers,
    cleanInlineBackgrounds,
    buildChecklistHtml,
    buildTrackCoursesHtml,
    buildLessonQuizHtml,
    buildRoadmapHtml,
    renderRoadmap,
    renderTrackDetail,
    buildEmptyStateHtml,
    buildDashboardEmptyStateHtml,
    buildSearchEmptyStateHtml,
    renderSearchResults,
    buildDashboardBookmarksSectionHtml,
    buildDashboardCertificatesSectionHtml,
    buildSandboxPageHtml,
    buildSandboxMenuHtml,
  };

  window.NVViewHelpers = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
