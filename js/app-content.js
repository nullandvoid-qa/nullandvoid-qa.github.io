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

  function renderGlossary() {
    const items = window.TG_GLOSSARY?.[getLangKey()] || [];
    const el = document.getElementById('glossary-content');
    if (el) {
      el.innerHTML = window.NVViewHelpers.buildGlossaryHtml(items, window.escapeHtml);
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
      container.innerHTML = window.NVViewHelpers.buildEmptyStateHtml(
        state.lang === 'en' ? 'No labs available.' : 'Nenhum lab disponível.',
        '',
        window.escapeHtml,
      );
      return;
    }

    const trackMap = Object.fromEntries(
      (state.tracks || []).map((track) => [track.id, helpers.localizedTrack(track)]),
    );

    container.innerHTML = window.NVViewHelpers.buildLabsHtml(
      labs,
      trackMap,
      window.NVIcons,
      window.escapeHtml,
      helpers.getTrackIcon,
      state.lang,
    );
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

    menu.innerHTML = examples
      .map((item, index) => `<button type="button" class="sandbox-item" data-index="${index}">${window.escapeHtml(item.name || item.id || `Example ${index + 1}`)}</button>`)
      .join('');

    const renderExample = (index) => {
      const item = examples[index] || examples[0];
      example.innerHTML = `<pre class="sandbox-example-code">${window.escapeHtml(item.code || '')}</pre>`;
    };

    menu.querySelectorAll('.sandbox-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        renderExample(Number(btn.dataset.index || 0));
      });
    });

    renderExample(0);
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
    if (bc) bc.textContent = lt.title;

    container.innerHTML = window.NVViewHelpers.buildTrackQuizHtml(
      { ...track, icon: track.icon },
      quizData,
      { alreadyPassed },
      state.lang,
      window.NVIcons,
      window.escapeHtml,
      window.t,
    );

    window.NVViewHelpers.bindTrackQuizHandlers(
      container,
      quizData,
      window.NVIcons,
      state.lang,
      window.t,
      () => window.navigate('track', { trackId }),
      () => renderQuiz(trackId),
      (correct) => {
        const quizzesPassed = state.quizzesPassed || {};
        if (quizzesPassed[trackId]) return;
        quizzesPassed[trackId] = {
          passedAt: new Date().toISOString(),
          score: correct,
        };
        try { localStorage.setItem('testers-guild-quizzes', JSON.stringify(quizzesPassed)); } catch (e) { /* ignore */ }
        if (typeof window.checkAchievements === 'function') window.checkAchievements();
        window.showToast(window.t('toast.quizPassed'));
      },
    );
  }

  window.NVAppContent = { renderGlossary, renderLabs, renderSandbox, renderQuiz };
  window.renderGlossary = renderGlossary;
  window.renderLabs = renderLabs;
  window.renderSandbox = renderSandbox;
  window.renderQuiz = renderQuiz;
})();
