/**
 * Certificate Helper Functions
 * Certificate modal display and PDF handling
 */

const { notifyUser } = require('./ui-helpers');

function showCertificateModal(blob, filename, trackId) {
  if (!blob) return;
  // If modal already exists, remove it
  const existing = document.getElementById('cert-modal-root');
  if (existing) existing.remove();

  const url = typeof URL.createObjectURL === 'function'
    ? URL.createObjectURL(blob)
    : '';
  const root = document.createElement('div');
  root.id = 'cert-modal-root';
  root.className = 'cert-modal';
  root.innerHTML = `
    <div class="cert-modal__overlay" id="cert-modal-overlay"></div>
    <div class="cert-modal__content" role="dialog" aria-modal="true" aria-labelledby="cert-modal-title">
      <button class="cert-modal__close" id="cert-modal-close" aria-label="Close certificate preview">×</button>
      <h2 class="sr-only" id="cert-modal-title">Certificate preview</h2>
      <div class="cert-modal__frame-wrap">
        <iframe class="cert-modal__iframe" src="${url}" title="Certificate preview"></iframe>
      </div>
      <div class="cert-modal__actions">
        <button class="btn btn-secondary" id="cert-modal-download" aria-label="Baixar certificado">Baixar</button>
        <button class="btn btn-secondary" id="cert-modal-download-shareable" aria-label="Download certificate image">Download image</button>
        <button class="btn" id="cert-modal-close-2" aria-label="Close certificate preview">Fechar</button>
      </div>
    </div>
  `;

  document.body.appendChild(root);
  document.body.classList.add('modal-open');

  const content = document.getElementById('cert-modal-content') || root.querySelector('.cert-modal__content');
  const closeButton = document.getElementById('cert-modal-close');
  const closeButtons = [closeButton, document.getElementById('cert-modal-close-2')].filter(Boolean);

  function close() {
    root.remove();
    document.body.classList.remove('modal-open');
    if (url && typeof URL.revokeObjectURL === 'function') {
      setTimeout(() => URL.revokeObjectURL(url), 200);
    }
  }

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  document.addEventListener('keydown', handleKeydown);
  root.addEventListener('keydown', handleKeydown);

  closeButtons.forEach((button) => button.addEventListener('click', close));
  document.getElementById('cert-modal-overlay').addEventListener('click', close);
  if (content) {
    content.setAttribute('tabindex', '-1');
    content.focus({ preventScroll: true });
  } else if (closeButton) {
    closeButton.focus({ preventScroll: true });
  }

  document.getElementById('cert-modal-download').addEventListener('click', () => {
    // prefer using TG_CERTIFICATES.downloadCertificate if available to maintain naming
    if (window.TG_CERTIFICATES && typeof window.TG_CERTIFICATES.downloadCertificate === 'function') {
      // Trigger the same download flow (this will re-generate PDF) in background
      window.TG_CERTIFICATES.downloadCertificate(trackId, (window.NVAuth && typeof window.NVAuth.getUserName === 'function') ? (window.NVAuth.getUserName() || '') : (window.NVAuth && window.NVAuth.user && window.NVAuth.user.name) || '', new Date()).catch((err) => {
        console.warn('Download via downloadCertificate failed, using direct blob link', err);
        // fallback to direct blob download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'certificate.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'certificate.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });

  document.getElementById('cert-modal-download-shareable')?.addEventListener('click', async () => {
    if (!window.TG_CERTIFICATES || typeof window.TG_CERTIFICATES.generateShareableCertificate !== 'function') return;
    try {
      const userName = (window.NVAuth && typeof window.NVAuth.getUserName === 'function')
        ? (window.NVAuth.getUserName() || '')
        : (window.NVAuth && window.NVAuth.user && window.NVAuth.user.name) || '';
      const shareBlob = await window.TG_CERTIFICATES.generateShareableCertificate(trackId, userName, new Date());
      const shareUrl = URL.createObjectURL(shareBlob);
      const a = document.createElement('a');
      a.href = shareUrl;
      a.download = `${trackId}-certificate-share.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(shareUrl), 200);
    } catch (err) {
      console.warn('Shareable certificate image download failed:', err);
    }
  });
}

module.exports = {
  showCertificateModal,
};
