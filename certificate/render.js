// Lightweight renderer to fill the template with data and export as data URL
(function(global){
  async function renderCertificate(data) {
    let root = document.getElementById('certificate-root');
    let wrapper = null;

    if (!root) {
      // Fetch template and inject hidden into DOM
      try {
        const res = await fetch('/certificate/template.html', { cache: 'no-store' });
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const tplRoot = doc.getElementById('certificate-root');
        const tplStyle = Array.from(doc.querySelectorAll('style')).map(s => s.textContent).join('\n');

        if (!tplRoot) throw new Error('Template root not found in template.html');

        wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.left = '-9999px';
        wrapper.id = 'nv-certificate-wrapper';

        if (tplStyle) {
          const style = document.createElement('style');
          style.textContent = tplStyle;
          wrapper.appendChild(style);
        }

        wrapper.appendChild(tplRoot);
        document.body.appendChild(wrapper);
        root = wrapper.querySelector('#certificate-root');
      } catch (err) {
        throw new Error('Failed to load certificate template: ' + err.message);
      }
    } else {
      // If root exists in page, we'll clone into a hidden wrapper to avoid layout shift
      wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      wrapper.id = 'nv-certificate-wrapper-clone';
      wrapper.appendChild(root.cloneNode(true));
      document.body.appendChild(wrapper);
      root = wrapper.querySelector('#certificate-root');
    }

    // populate fields inside the cloned root
    const setText = (id, value) => {
      const el = root.querySelector(`#${id}`);
      if (!el) return;
      if (id === 'description') el.innerHTML = value || '';
      else el.textContent = value || el.textContent;
    };

    const recipientName = data?.recipient?.name || data?.recipient || '';
    const courseTitle = data?.course?.name || data?.course || '';
    const courseDescription = data?.course?.description || data?.course?.subtitle || '';
    const durationValue = data?.course?.duration || data?.duration || '';
    const issuedValue = data?.credential?.issued ? new Date(data.credential.issued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (data.id) setText('cert-id-val', data.id);
    if (recipientName) setText('student-name', recipientName);
    if (courseTitle) setText('course-title', courseTitle);
    if (durationValue) setText('duration', durationValue);
    if (data.score) setText('score', data.score);
    setText('issued', issuedValue);
    if (courseDescription) setText('course-description', courseDescription);

    const width = 1200;
    const height = 850;

    // If html2canvas is present use it for full fidelity rendering.
    // Render the actual DOM node attached to the hidden wrapper.
    if (window.html2canvas) {
      const c = await window.html2canvas(root, { width, height });
      if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      return c.toDataURL('image/png');
    }

    // Simple fallback: draw minimal representation to ensure a valid PNG
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#07111f';
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(data.recipient || 'RECIPIENT', 60, 200);
    ctx.fillText(data.course || 'COURSE', 60, 240);

    if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    return canvas.toDataURL('image/png');
  }

  global.CertificateRenderer = { renderCertificate };
})(window);
