/**
 * Quiz Helper Functions
 * Quiz rendering, event binding, and result display
 */

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
    <div class="lesson-quiz-result ${passed ? 'quiz-passed' : 'quiz-failed'}">
      <div class="lesson-quiz-result__message">${message}</div>
      <div class="lesson-quiz-result__score">${scoreText}</div>
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
            <label class="quiz-option" data-qi="${qi}" data-oi="${oi}" role="button" tabindex="0" aria-label="${escapeHtml(opt)}">
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
      <div class="quiz-track-header" style="--quiz-border-color:${track.color}">
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

  // make quiz option labels keyboard-activatable (Enter / Space)
  try {
    container.querySelectorAll('.quiz-option').forEach((lbl) => {
      try {
        if (typeof lbl.setAttribute === 'function') {
          lbl.setAttribute('tabindex', '0');
          lbl.setAttribute('role', 'button');
        }
        lbl.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
            ev.preventDefault();
            const input = lbl.querySelector('input[type="radio"]');
            if (input) input.click();
          }
        });
      } catch (e) {
        // noop
      }
    });
  } catch (e) {
    // noop
  }

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

function buildLessonQuizHtml(lessonId, quizData, lang, icons, escapeHtml) {
  const questionsHtml = quizData.questions
    .map((q, qi) => `
    <div class="lesson-quiz-question">
      <p><strong>${qi + 1}.</strong> ${escapeHtml(q.q)}</p>
      <div class="lesson-quiz-options">
        ${q.options
          .map((opt, oi) => `
          <label class="lesson-quiz-option" role="button" tabindex="0" aria-label="${escapeHtml(opt)}">
            <input type="radio" name="lq${lessonId}-q${qi}" value="${oi}" class="lesson-quiz-radio">
            <span>${escapeHtml(opt)}</span>
          </label>`)
          .join("")}
      </div>
      <div class="lesson-quiz-explain hidden" id="lq-explain-${qi}"></div>
    </div>`)
    .join("");

  return `
    <div class="lesson-quiz-box">
      <h3 class="lesson-quiz-box__title">${icons ? icons.get('target','','18') + ' ' : ''}${escapeHtml(quizData.title)}</h3>
      <p class="lesson-quiz-box__subtitle">${quizData.questions.length} ${lang === "en" ? "quick question(s)" : "pergunta(s) rápida(s)"} — ${lang === "en" ? "test your understanding" : "teste seu entendimento"}</p>
      <form id="lq-form-${lessonId}" class="lesson-quiz-form">
        ${questionsHtml}
        <div class="lesson-quiz-actions">
          <button type="submit" class="btn btn-primary btn-sm">✓ ${lang === "en" ? "Check" : "Verificar"}</button>
          <button type="button" class="btn btn-secondary btn-sm" id="lq-reset-${lessonId}">${lang === "en" ? "Reset" : "Resetar"}</button>
        </div>
      </form>
      <div id="lq-result-${lessonId}" class="lesson-quiz-result hidden"></div>
    </div>`;
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

  const resetButton = container.querySelector(`#lq-reset-${lessonId}`);
  if (resetButton) {
    resetButton.addEventListener("click", () => {
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
}

function renderLessonQuiz(lessonId, container, quizData, lang, icons, escapeHtml, t) {
  if (!container || !quizData) return;

  container.insertAdjacentHTML(
    "beforeend",
    buildLessonQuizHtml(lessonId, quizData, lang, icons, escapeHtml),
  );
  bindLessonQuizHandlers(container, lessonId, quizData, icons, t, lang);
}

module.exports = {
  buildQuizResultHtml,
  buildLessonQuizResultHtml,
  buildTrackQuizHtml,
  bindTrackQuizHandlers,
  buildLessonQuizHtml,
  bindLessonQuizHandlers,
  renderLessonQuiz,
};
