/**
 * Dashboard Helper Functions
 * Dashboard sections, bookmarks, certificates, achievements
 */

const { buildDashboardEmptyStateHtml } = require('./state-helpers');
const { buildCertificateCard, buildBookmarksHtml } = require('./card-builders');
const { notifyUser } = require('./ui-helpers');

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

function buildDashboardCertificatesSectionHtml(completedTracks, userCerts, localizedTrack, icons, lang, escapeHtml, emptyMessage, t) {
  const translate = typeof t === 'function'
    ? (key, fallback) => t(key, fallback)
    : (key, fallback) => fallback || key;

  // Determine first completed track and user name to make preview dynamic
  const firstTrack = Array.isArray(completedTracks) && completedTracks.length ? completedTracks[0] : null;
  const isAuthenticated = window.NVAuth && window.NVAuth.isAuthenticated;
  const userName = isAuthenticated
    ? ((typeof window.NVAuth.getUserName === 'function') ? (window.NVAuth.getUserName() || 'Ana Silva') : (window.NVAuth.user && window.NVAuth.user.name) || 'Ana Silva')
    : 'Please sign in to generate your certificate';
  const trackTitle = firstTrack ? (localizedTrack ? localizedTrack(firstTrack).title : firstTrack.title) : 'Web Testing Track • Intermediate Level';
  const issueDate = new Date().toLocaleDateString('en-US');

  const previewActions = firstTrack && isAuthenticated
    ? `<div style="margin-top:0.5rem">
        <button class="btn btn-secondary btn-sm" id="btn-cert-preview" data-track="${escapeHtml(firstTrack.id)}" data-action="preview">${translate('dashboard.preview', lang === 'en' ? 'Preview' : 'Visualizar')}</button>
        <button class="btn btn-primary btn-sm" id="btn-cert-download" data-track="${escapeHtml(firstTrack.id)}" data-action="download">${translate('dashboard.download', lang === 'en' ? 'Download' : 'Baixar')}</button>
        <button class="btn btn-secondary btn-sm" id="btn-cert-download-image" data-track="${escapeHtml(firstTrack.id)}" data-action="download-image">${translate('dashboard.downloadImage', lang === 'en' ? 'Download image' : 'Download imagem')}</button>
      </div>`
    : `<div style="margin-top:0.5rem; color: #cbd5e1; font-size: 0.95rem;">${translate('dashboard.signInToAccessCertificates', lang === 'en' ? 'Sign in to access your certificates.' : 'Faça login para acessar seus certificados.')}</div>`;

  const previewBadge = firstTrack
    ? translate('dashboard.certificatePreviewBadge', lang === 'en' ? 'Certificate' : 'Certificado')
    : translate('dashboard.exampleBadge', lang === 'en' ? 'Example' : 'Exemplo');

  const previewHtml = `
    <div class="cert-preview" role="img" aria-label="${translate('dashboard.certificatePreviewAria', lang === 'en' ? 'Certificate preview' : 'Pré-visualização do certificado')}">
      <div class="cert-preview__badge">${previewBadge}</div>
      <div class="cert-preview__title">${translate('dashboard.certificatePreviewTitle', lang === 'en' ? 'CERTIFICATE OF COMPLETION' : 'CERTIFICADO DE CONCLUSÃO')}</div>
      <div class="cert-preview__name">${escapeHtml(userName)}</div>
      <div class="cert-preview__track">${escapeHtml(trackTitle)}</div>
      <div class="cert-preview__footer">${translate('dashboard.issuedOn', lang === 'en' ? 'Issued on' : 'Emitido em')} ${issueDate}
        ${previewActions}
      </div>
    </div>`;

  if (!Array.isArray(completedTracks) || completedTracks.length === 0) {
    return `${previewHtml}${buildDashboardEmptyStateHtml(emptyMessage || translate('dashboard.certificatesEmpty', lang === 'en' ? 'Complete a track to earn a certificate.' : 'Conclua uma trilha para ganhar um certificado.'), escapeHtml)}`;
  }

  return `${previewHtml}${completedTracks
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
    .join("")}`;
}

function buildAchievementsHtml(achievementsList, unlocked, lang, escapeHtml, icons) {
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

  // Bind to any element with a data-track attribute inside the container.
  container.querySelectorAll("[data-track]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const trackId = btn.dataset.track;
      if (!trackId) return;
      const action = btn.dataset.action || 'download';

      if (!window.NVAuth || !window.NVAuth.isAuthenticated) {
        notifyUser('Faça login para acessar seus certificados.');
        return;
      }

      if (action === 'preview') {
        if (!window.TG_CERTIFICATES) return;
        try {
          const userName = (typeof window.NVAuth.getUserName === 'function') ? (window.NVAuth.getUserName() || '') : (window.NVAuth.user && window.NVAuth.user.name) || '';
          const blob = await window.TG_CERTIFICATES.generateCertificate(trackId, userName, new Date());
          const { showCertificateModal } = require('./certificate-helpers');
          showCertificateModal(blob, `${trackId}-certificate.pdf`, trackId);
        } catch (e) {
          console.error('Certificate preview failed:', e);
        }
        return;
      }

      if (action === 'download-image') {
        try {
          const userName = (typeof window.NVAuth.getUserName === 'function') ? (window.NVAuth.getUserName() || '') : (window.NVAuth.user && window.NVAuth.user.name) || '';
          if (window.TG_CERTIFICATES && typeof window.TG_CERTIFICATES.downloadShareableCertificate === 'function') {
            await window.TG_CERTIFICATES.downloadShareableCertificate(trackId, userName, new Date());
          } else if (window.TG_CERTIFICATES && typeof window.TG_CERTIFICATES.generateShareableCertificate === 'function') {
            const blob = await window.TG_CERTIFICATES.generateShareableCertificate(trackId, userName, new Date());
            const shareUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = shareUrl;
            a.download = `${trackId}-certificate-share.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(shareUrl), 200);
            return;
          }
        } catch (e) {
          console.error('Certificate image download failed:', e);
        }
        return;
      }

      await onDownload(trackId);
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
      t,
    );
    bindDashboardCertificateHandlers(certificatesSection, onCertDownload);
  }
}

module.exports = {
  buildDashboardBookmarksSectionHtml,
  buildDashboardCertificatesSectionHtml,
  buildAchievementsHtml,
  bindDashboardBookmarkHandlers,
  bindDashboardCertificateHandlers,
  renderDashboardSections,
};
