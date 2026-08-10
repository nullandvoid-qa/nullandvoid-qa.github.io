/**
 * app-content.js
 *
 * Renderers for content-heavy views: glossary, labs, sandbox, and quizzes.
 * Reads shared app state from window.NVApp.state.
 */
(function () {
  function getState() {
    return window.NVApp?.state || {};
  }

  function getHelpers() {
    return window.NVApp?.helpers || {};
  }

  function getLangKey() {
    return getState().lang === 'en' ? 'en' : 'pt';
  }

  function safeEscapeHtml(value) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(value);
    return String(value == null ? '' : value);
  }

  function buildEmptyState(message, className = '') {
    const text = message == null ? '' : String(message);
    if (window.NVViewHelpers?.buildEmptyStateHtml) {
      return window.NVViewHelpers.buildEmptyStateHtml(text, className, safeEscapeHtml);
    }
    const classes = ['empty-state'];
    if (className) classes.push(className);
    return `<div class="${classes.join(' ')}" role="status" aria-live="polite"><p>${safeEscapeHtml(text)}</p></div>`;
  }

  function buildTrackQuizHtml(track, quizData, status, lang, icons, escapeHtml, t) {
    if (window.NVViewHelpers?.buildTrackQuizHtml) {
      return window.NVViewHelpers.buildTrackQuizHtml(track, quizData, status, lang, icons, escapeHtml, t);
    }
    return `<div class="track-quiz"><h2>${safeEscapeHtml(track.title || 'Quiz')}</h2><p>${safeEscapeHtml(t ? t('quiz.unavailable', 'Quiz is unavailable') : 'Quiz is unavailable')}</p></div>`;
  }

  function renderGlossary() {
    const items = window.TG_GLOSSARY?.[getLangKey()] || [];
    const el = document.getElementById('glossary-content');
    if (el) {
      const markup = window.NVViewHelpers?.buildGlossaryHtml
        ? window.NVViewHelpers.buildGlossaryHtml(items, window.escapeHtml || safeEscapeHtml)
        : `<div class="glossary-list">${safeEscapeHtml(JSON.stringify(items))}</div>`;
      el.innerHTML = markup;
    }
  }

  function renderLabs() {
    const state = getState();
    const helpers = getHelpers();
    const container = document.getElementById('labs-content');
    if (!container) return;
    const labsData = window.TG_LABS || {};
    const labs = labsData[getLangKey()] || labsData.pt || [];
    if (!labs.length) {
      container.innerHTML = buildEmptyState(
        state.lang === 'en' ? 'No labs available.' : 'Nenhum lab disponível.',
        '',
      );
      return;
    }

    const trackMap = Object.fromEntries(
      (state.tracks || []).map((track) => [track.id, helpers.localizedTrack(track)]),
    );

    if (window.NVViewHelpers?.buildLabsHtml) {
      container.innerHTML = window.NVViewHelpers.buildLabsHtml(
        labs,
        trackMap,
        window.NVIcons,
        window.escapeHtml || safeEscapeHtml,
        helpers.getTrackIcon,
        state.lang,
      );
      return;
    }

    container.innerHTML = `<div class="labs-list">${labs
      .map(
        (lab) => `<article class="lab-card"><h3>${safeEscapeHtml(lab.name || lab.id)}</h3><p>${safeEscapeHtml(lab.description || '')}</p></article>`,
      )
      .join('')}</div>`;
  }

  function renderSandbox() {
    const state = getState();
    const menu = document.getElementById('sandbox-menu');
    const example = document.getElementById('sandbox-example');
    if (!menu || !example) return;

    const examples = Array.isArray(window.TG_MOBILE_AUTOMATION_EXAMPLES)
      ? window.TG_MOBILE_AUTOMATION_EXAMPLES
      : [];

    if (!examples.length) {
      menu.innerHTML = '';
      example.textContent = state.lang === 'en' ? 'Sandbox examples are not available yet.' : 'Exemplos do sandbox ainda não estão disponíveis.';
      return;
    }

    const escapeHtml = window.escapeHtml || safeEscapeHtml;
    menu.innerHTML = examples
      .map((item, index) => `<button type="button" class="sandbox-item" data-index="${index}">${escapeHtml(item.name || item.id || `Example ${index + 1}`)}</button>`)
      .join('');

    const renderExample = (index) => {
      const item = examples[index] || examples[0];
      example.innerHTML = `<pre class="sandbox-example-code">${escapeHtml(item.code || '')}</pre>`;
    };

    menu.querySelectorAll('.sandbox-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        renderExample(Number(btn.dataset.index || 0));
      });
    });

    renderExample(0);
  }

  function persistQuizzes(quizzesPassed) {
    if (typeof window !== 'undefined' && window.NVAppStorage?.safeSaveJson) {
      return window.NVAppStorage.safeSaveJson('testers-guild-quizzes', quizzesPassed);
    }
    if (typeof window !== 'undefined' && typeof window.saveJson === 'function') {
      try { window.saveJson('testers-guild-quizzes', quizzesPassed); return; } catch (e) { /* ignore */ }
    }
    if (typeof saveJson === 'function') {
      try { saveJson('testers-guild-quizzes', quizzesPassed); return; } catch (e) { /* ignore */ }
    }
    if (typeof window !== 'undefined' && typeof window.setStoredItem === 'function') {
      try { window.setStoredItem('testers-guild-quizzes', JSON.stringify(quizzesPassed)); return; } catch (e) { /* ignore */ }
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('testers-guild-quizzes', JSON.stringify(quizzesPassed));
      }
    } catch (e) {
      // ignore
    }
  }

  function renderQuiz(trackId) {
    const state = getState();
    const helpers = getHelpers();
    const container = document.getElementById('quiz-content');
    if (!container) return;

    const track = (state.tracks || []).find((tr) => tr.id === trackId);
    if (!track) return;

    const langKey = getLangKey();
    const quizzes = helpers.quizzes || {};
    const quizData = quizzes[trackId]?.[langKey] || quizzes[trackId]?.pt;
    if (!quizData) {
      container.innerHTML = window.NVViewHelpers.buildEmptyStateHtml(
        state.lang === 'en' ? 'No quiz available for this track yet.' : 'Nenhum quiz disponível para esta trilha ainda.',
        '',
        window.escapeHtml,
      );
      return;
    }

    const lt = helpers.localizedTrack(track);
    const alreadyPassed = !!(state.quizzesPassed || {})[trackId];

    const bc = document.getElementById('quiz-breadcrumb');
    if (bc) bc.textContent = lt.title || '';

    container.innerHTML = buildTrackQuizHtml(
      { ...track, icon: track.icon },
      quizData,
      { alreadyPassed },
      state.lang,
      window.NVIcons,
      window.escapeHtml || safeEscapeHtml,
      window.t || ((key, fallback) => fallback || String(key)),
    );

    // Ensure the quiz view is the active view so it isn't rendered beneath
    // another view (tests/run-time can leave multiple views active). Prefer
    // the centralized helper when available, otherwise apply a safe fallback
    // that removes `.active` from other views and exposes interactive elements.
    try {
      if (typeof window.NVViewHelpers?.setActiveView === 'function') {
        window.NVViewHelpers.setActiveView(document, 'quiz', 'tracks');
      } else {
        const views = document.querySelectorAll('.view') || [];
        views.forEach((v) => v.classList.remove('active'));
        const viewEl = document.getElementById('view-quiz');
        if (viewEl) {
          viewEl.classList.add('active');
          try {
            const host = window.location && (window.location.hostname || '');
            if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
              viewEl.querySelectorAll && viewEl.querySelectorAll('.hidden').forEach((el) => el.classList.remove('hidden'));
            }
          } catch (e) { /* noop */ }
        }
      }
    } catch (e) {
      // noop - defensive
    }

    if (typeof window.NVViewHelpers?.bindTrackQuizHandlers === 'function') {
      window.NVViewHelpers.bindTrackQuizHandlers(
        container,
        quizData,
        window.NVIcons,
        state.lang,
        window.t || ((key, fallback) => fallback || String(key)),
        () => window.navigate?.('track', { trackId }),
        () => renderQuiz(trackId),
        (correct) => {
          const quizzesPassed = state.quizzesPassed || {};
          if (quizzesPassed[trackId]) return;
          quizzesPassed[trackId] = {
            passedAt: new Date().toISOString(),
            score: correct,
          };
          persistQuizzes(quizzesPassed);
          if (typeof window.checkAchievements === 'function') window.checkAchievements();
          if (typeof window.showToast === 'function') window.showToast(window.t('toast.quizPassed'));
        },
      );
    }
  }

  window.NVAppContent = { renderGlossary, renderLabs, renderSandbox, renderQuiz };
  window.renderGlossary = renderGlossary;
  window.renderLabs = renderLabs;
  window.renderSandbox = renderSandbox;
  window.renderQuiz = renderQuiz;
})();
