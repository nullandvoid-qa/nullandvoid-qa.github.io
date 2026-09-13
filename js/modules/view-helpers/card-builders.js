/**
 * Card Builder Functions
 * HTML generation for cards and components (track cards, certificate cards, etc.)
 */

function buildCertificateCard(track, existingCert, icons, lang, escapeHtml) {
  const title = escapeHtml(track.title || track.id);
  const label = existingCert
    ? `Gerado em ${new Date(existingCert.generatedAt).toLocaleDateString("pt-BR")}`
    : (lang === "en" ? "Certificate available" : "Certificado disponível");
  const iconHtml = icons
    ? icons.get(track.icon || 'certificate', 'track-icon-svg', '18')
    : escapeHtml(track.icon || '');

  return `<div class="cert-card" style="--cert-accent:${track.color};">
    <div class="cert-card__header">
      <div>
        <h4>${iconHtml} ${title}</h4>
        <p>${label}</p>
      </div>
      <div class="cert-card__actions">
        <button class="btn btn-primary btn-sm cert-card__action" id="btn-cert-${track.id}" data-track="${track.id}" data-action="download">${icons ? icons.get('download','','14') : ''} ${lang === "en" ? "Download" : "Baixar"}</button>
        <button class="btn btn-secondary btn-sm cert-card__action" id="btn-cert-image-${track.id}" data-track="${track.id}" data-action="download-image">${lang === "en" ? "Export image" : "Exportar imagem"}</button>
      </div>
    </div>
  </div>`;
}

function buildPortfolioTemplatesHtml(lang) {
  const isEn = lang === "en";
  return `
    <h3 class="section-title section-title-sm section-title-margin-top">${isEn ? "Portfolio projects" : "Projetos para Portfólio"}</h3>
    <p class="section-sub">${isEn ? "Ready-made templates to build practical experience" : "Templates prontos para você ganhar experiência prática"}</p>
    <div class="portfolio-grid">
      <article class="portfolio-template-card portfolio-template-card--green">
        <h4 class="portfolio-template-card__title">${isEn ? "Starter QA Project" : "Starter QA Project"}</h4>
        <p class="portfolio-template-card__desc">${isEn ? "10 manual tests + 3 automated ones. Great for getting started." : "10 testes manuais + 3 automatizados. Perfeito para começar."}</p>
        <a href="https://github.com/nullandvoid-qa/qa-templates/tree/main/starter-qa-project" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm portfolio-template-card__link">${isEn ? "Open template →" : "Acessar template →"}</a>
      </article>
      <article class="portfolio-template-card portfolio-template-card--yellow">
        <h4 class="portfolio-template-card__title">${isEn ? "Web Automation Project" : "Web Automation Project"}</h4>
        <p class="portfolio-template-card__desc">${isEn ? "20+ E2E tests with Page Object Model. Professional." : "20+ testes E2E com Page Object Model. Profissional."}</p>
        <a href="https://github.com/nullandvoid-qa/qa-templates/tree/main/web-automation-project" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm portfolio-template-card__link">${isEn ? "Open template →" : "Acessar template →"}</a>
      </article>
      <article class="portfolio-template-card portfolio-template-card--purple">
        <h4 class="portfolio-template-card__title">${isEn ? "View all templates" : "Ver todos os templates"}</h4>
        <p class="portfolio-template-card__desc">${isEn ? "API, Performance, Mobile, Security, and more." : "API, Performance, Mobile, Security, e mais."}</p>
        <a href="https://github.com/nullandvoid-qa/qa-templates#-templates-dispon%C3%ADveis" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm portfolio-template-card__link">${isEn ? "Explore →" : "Explorar →"}</a>
      </article>
    </div>`;
}

function buildTrackCardHtml(track, options = {}) {
  const {
    prog,
    audience,
    isComplete,
    title,
    iconHtml,
    icons,
    escapeHtml,
    t,
    tierLabel,
  } = options;

  const translate = (key, fallback) => {
    const result = typeof t === 'function' ? t(key, fallback) : undefined;
    return typeof result === 'string' && result !== key ? result : (fallback || key);
  };

  const contentTitle = escapeHtml(title || track.title || track.id);
  const description = escapeHtml(track.description || "");
  const topics = Array.isArray(track.topics) ? track.topics : [];
  const topicTags = topics.slice(0, 3).map((topic) => `<span class="tag">${escapeHtml(topic)}</span>`).join("");

  return `
    <article class="track-card${isComplete ? " track-complete" : ""}" style="--track-color:${track.color || "#8b5cf6"};" role="button" tabindex="0" aria-label="${escapeHtml(translate("track.open", "Open track") + ": " + contentTitle)}">
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
        <div class="progress-text">
          <span class="progress-pill">${prog.done}/${prog.total} ${t("track.lessonsProgress")}</span>
          ${isComplete ? `<span class="progress-pill progress-pill-complete">${icons ? icons.get('checkCircle','','14') : '✓'} ${t("track.completed")}</span>` : `<span class="progress-pill progress-pill-active">${t("track.inProgress")}</span>`}
        </div>
      </div>
    </article>`;
}

function buildTrackDetailHtml(track, coursesHtml, quizBtnHtml, prog, meta, helpers) {
  const { icons, escapeHtml, t, tierLabel, getTrackIcon } = helpers;
  const trackIconHtml = icons ? icons.get(getTrackIcon(track), 'track-icon-svg', '28') : track.icon;
  const trackTitle = escapeHtml(track.title || track.id);
  const trackDescription = escapeHtml(track.description || "");

  return `
    <div class="track-hero" style="--track-color:${track.color};">
      <h1>${trackIconHtml} ${trackTitle}</h1>
      <p class="track-hero-desc">${trackDescription}</p>
      <div class="track-meta">
        <span>${icons ? icons.get('package','','14') : ''} ${meta.modules} ${t("track.modules")}</span>
        <span>${icons ? icons.get('clock','','14') : ''} ~${meta.hours} ${t("track.hoursLong")}</span>
        <span class="tier-badge tier-${meta.audience}">${tierLabel(meta.audience)}</span>
      </div>
      <div class="progress-bar track-hero-progress">
        <div class="progress-fill" style="width:${prog.pct}%"></div>
      </div>
      <div class="progress-text progress-text-hero">
        <span class="progress-pill">${prog.done}/${prog.total} ${t("track.lessonsDone")}</span>
        ${prog.pct === 100 ? `<span class="progress-pill progress-pill-complete">${icons ? icons.get('checkCircle','','14') : '✓'} ${t("track.completed")}</span>` : `<span class="progress-pill progress-pill-active">${Math.round(prog.pct)}% ${t("dashboard.overallProgress")}</span>`}
      </div>
      <div class="track-hero-actions">
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
      <div class="progress-bar dash-progress-bar"><div class="progress-fill" style="width:${global.pct}%"></div></div>
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
        <span class="lab-type-badge" style="--lab-badge-color:${typeColors[lab.type] || "#10b981"}">${escapeHtml(lab.type)}</span>
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

module.exports = {
  buildCertificateCard,
  buildPortfolioTemplatesHtml,
  buildTrackCardHtml,
  buildTrackDetailHtml,
  buildDashboardStatsHtml,
  buildBookmarksHtml,
  buildGlossaryHtml,
  buildLabsHtml,
};
