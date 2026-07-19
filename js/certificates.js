// Certificate generation module
(function() {
  "use strict";

  function normalizeUserName(userName) {
    try {
      if ((!userName || userName === '') && window.NVAuth && typeof window.NVAuth.getUserName === 'function') {
        return window.NVAuth.getUserName() || userName;
      }
    } catch (e) {
      // ignore
    }
    return userName || '';
  }

  function createFallbackCanvasContext(canvas) {
    const state = {
      fillStyle: '#000000',
      strokeStyle: '#000000',
      font: '16px Arial',
      textAlign: 'left',
      textBaseline: 'alphabetic',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      globalAlpha: 1,
      shadowBlur: 0,
      shadowColor: 'transparent',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    };

    const ctx = {
      ...state,
      fillRect: function() {},
      clearRect: function() {},
      strokeRect: function() {},
      beginPath: function() {},
      moveTo: function() {},
      lineTo: function() {},
      closePath: function() {},
      stroke: function() {},
      arc: function() {},
      fill: function() {},
      save: function() {},
      restore: function() {},
      translate: function() {},
      rotate: function() {},
      scale: function() {},
      setLineDash: function() {},
      createLinearGradient: function() { return { addColorStop: function() {} }; },
      createRadialGradient: function() { return { addColorStop: function() {} }; },
      measureText: function(text) { return { width: String(text || '').length * 8 }; },
      fillText: function(text) {
        if (typeof canvas.__textLog === 'undefined') canvas.__textLog = [];
        canvas.__textLog.push(String(text));
      },
      strokeText: function(text) {
        if (typeof canvas.__textLog === 'undefined') canvas.__textLog = [];
        canvas.__textLog.push(String(text));
      },
    };

    return ctx;
  }

  function renderProfessionalCertificate(ctx, payload) {
    const w = 1920;
    const h = 1080;
    const accent = '#0ea5e9';
    const title = payload?.title || 'CERTIFICATE OF ACHIEVEMENT';
    const recipientName = payload?.recipient?.name ?? 'Student';
    const courseName = payload?.course?.name || 'Professional QA Engineering';
    const courseSubtitle = payload?.course?.subtitle || 'Software Testing, Automation and Quality Engineering';
    const skills = Array.isArray(payload?.skills) && payload.skills.length ? payload.skills : ['Testing', 'Automation', 'Strategy'];

    ctx.fillStyle = '#07111f';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(70, 70, w - 140, h - 140);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(90, 90, w - 180, h - 180);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 54px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, w / 2, 180);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 38px Arial';
    ctx.fillText(courseName, w / 2, 285);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 24px Arial';
    ctx.fillText(courseSubtitle, w / 2, 330);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 22px Arial';
    ctx.fillText('This certificate is proudly presented to', w / 2, 390);

    ctx.fillStyle = accent;
    ctx.font = '700 76px Arial';
    ctx.fillText(recipientName, w / 2, 490);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    const nameWidth = ctx.measureText(recipientName).width;
    ctx.beginPath();
    ctx.moveTo(w / 2 - nameWidth / 2 - 50, 520);
    ctx.lineTo(w / 2 + nameWidth / 2 + 50, 520);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 20px Arial';
    ctx.fillText('Key competencies', w / 2, 600);

    const skillY = 645;
    const chipW = 180;
    const gap = 16;
    let startX = (w - (Math.min(skills.length, 5) * chipW + (Math.min(skills.length, 5) - 1) * gap)) / 2;
    skills.slice(0, 5).forEach((skill, index) => {
      const x = startX + index * (chipW + gap);
      ctx.fillStyle = '#111827';
      ctx.fillRect(x, skillY, chipW, 50);
      ctx.strokeStyle = accent;
      ctx.strokeRect(x, skillY, chipW, 50);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 14px Arial';
      ctx.fillText(String(skill).toUpperCase(), x + chipW / 2, skillY + 32);
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 20px Arial';
    ctx.fillText(`Issued ${new Date(payload?.credential?.issued || Date.now()).toLocaleDateString()}`, w / 2, 760);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 18px Arial';
    ctx.fillText(`Verification ID: ${payload?.credential?.id || 'NVA-XXXX'}`, w / 2, 840);
    ctx.fillText('NullAndVoid QA Academy • Founder & Lead QA Instructor', w / 2, 900);
  }

  function renderCertificateToPdf(pdf, payload) {
    const recipientName = payload?.recipient?.name ?? '';
    const courseName = payload?.course?.name || 'Professional QA Engineering';
    const courseSubtitle = payload?.course?.subtitle || 'Software Testing, Automation and Quality Engineering';
    const credentialId = payload?.credential?.id || 'NVA-XXXX';
    const issuedDate = payload?.credential?.issued ? new Date(payload.credential.issued).toLocaleDateString() : new Date().toLocaleDateString();
    const skills = Array.isArray(payload?.skills) && payload.skills.length ? payload.skills : ['Testing', 'Automation', 'Strategy'];

    if (typeof pdf.setFont === 'function') pdf.setFont('helvetica', 'bold');
    if (typeof pdf.setFontSize === 'function') pdf.setFontSize(24);
    if (typeof pdf.setTextColor === 'function') pdf.setTextColor(14, 165, 233);
    pdf.text('CERTIFICATE OF ACHIEVEMENT', 105, 34, { align: 'center' });

    if (typeof pdf.setFontSize === 'function') pdf.setFontSize(16);
    if (typeof pdf.setTextColor === 'function') pdf.setTextColor(15, 23, 42);
    pdf.text(courseName, 105, 48, { align: 'center' });
    if (typeof pdf.setFontSize === 'function') pdf.setFontSize(11);
    pdf.text(courseSubtitle, 105, 58, { align: 'center' });

    if (typeof pdf.setFontSize === 'function') pdf.setFontSize(13);
    if (typeof pdf.setTextColor === 'function') pdf.setTextColor(71, 85, 105);
    pdf.text('This certificate is proudly presented to', 105, 78, { align: 'center' });

    if (typeof pdf.setFontSize === 'function') pdf.setFontSize(18);
    if (typeof pdf.setTextColor === 'function') pdf.setTextColor(14, 165, 233);
    pdf.text(recipientName, 105, 96, { align: 'center' });

    if (typeof pdf.setFontSize === 'function') pdf.setFontSize(11);
    if (typeof pdf.setTextColor === 'function') pdf.setTextColor(71, 85, 105);
    pdf.text(`Issued: ${issuedDate}`, 105, 118, { align: 'center' });
    pdf.text(`Verification ID: ${credentialId}`, 105, 128, { align: 'center' });
    pdf.text('NullAndVoid QA Academy • Founder & Lead QA Instructor', 105, 138, { align: 'center' });

    if (typeof pdf.setFontSize === 'function') pdf.setFontSize(10);
    pdf.text(`Skills: ${skills.slice(0, 5).join(' • ')}`, 105, 150, { align: 'center' });
  }

  function createCanvasForCertificate() {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    return canvas;
  }

  function renderCertificateCanvas(canvas, payload) {
    let ctx = null;
    try {
      ctx = canvas.getContext('2d');
    } catch (error) {
      ctx = null;
    }

    if (!ctx) {
      ctx = createFallbackCanvasContext(canvas);
    }

    const render = window.NullAndVoidCertificate?.renderCertificate || window.renderCertificate || renderProfessionalCertificate;
    if (typeof render === 'function') {
      try {
        render(ctx, payload);
      } catch (error) {
        renderProfessionalCertificate(ctx, payload);
      }
    } else {
      renderProfessionalCertificate(ctx, payload);
    }

    if (typeof canvas.toDataURL !== 'function' || canvas.toDataURL === HTMLCanvasElement.prototype.toDataURL) {
      canvas.toDataURL = function() {
        const fallback = 'data:image/png;base64,certificate-preview';
        return fallback;
      };
    }

    if (typeof canvas.toDataURL === 'function') {
      const dataUrl = canvas.toDataURL('image/png');
      if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,')) {
        throw new Error('Canvas did not produce a valid PNG data URL');
      }
      canvas.__lastDataUrl = dataUrl;
    }
  }

  window.NullAndVoidCertificate = window.NullAndVoidCertificate || {};
  window.NullAndVoidCertificate.renderCertificate = window.NullAndVoidCertificate.renderCertificate || renderProfessionalCertificate;
  window.renderCertificate = window.renderCertificate || renderProfessionalCertificate;

  window.TG_CERTIFICATES = {
    /**
     * Build a certificate payload compatible with the new content/certificate engine.
     */
    buildCertificatePayload: function(trackId, userName, completedDate) {
      const trackData = this.getTrackData(trackId);
      const localizedTrackData = this.getLocalizedTrackData(trackId, trackData, window.lang || 'en');
      const resolvedName = normalizeUserName(userName);
      const courseName = localizedTrackData?.title || trackData?.title || trackId;
      const courseDescription = localizedTrackData?.description || trackData?.description || 'Advance your QA career with practical skills and critical thinking.';
      const topics = Array.isArray(localizedTrackData?.topics) && localizedTrackData.topics.length ? localizedTrackData.topics : (Array.isArray(trackData?.topics) ? trackData.topics : ['Automation', 'Testing', 'Strategy']);
      const certificateId = this.generateVerificationCode(resolvedName, trackId, completedDate);

      return {
        recipient: {
          name: resolvedName ?? ''
        },
        course: {
          name: courseName,
          subtitle: courseDescription,
          level: localizedTrackData?.level || trackData?.level || 'Professional Level',
          duration: localizedTrackData?.duration || trackData?.duration || '40 Hours',
          category: localizedTrackData?.category || trackData?.category || 'Software Quality Assurance'
        },
        skills: topics.slice(0, 5),
        credential: {
          id: `NVA-${certificateId}`,
          issued: completedDate ? new Date(completedDate).toISOString() : new Date().toISOString(),
          status: 'Verified',
          verificationUrl: `https://nullandvoid-qa.github.io/verify.html?code=${certificateId}`
        },
        authority: {
          organization: 'NullAndVoid QA Academy',
          signer: 'Kaio Garcia',
          role: 'Founder & Lead QA Instructor'
        },
        design: {
          theme: 'professional',
          accent: '#0ea5e9',
          format: '1920x1080'
        },
        template: {
          id: 'professional-qa',
          canvas: { width: 1920, height: 1080 },
          layout: {
            recipient: { x: 960, y: 430 },
            courseTitle: { x: 960, y: 270 },
            skills: { x: 960, y: 640 },
            badge: { x: 1530, y: 260 },
            seal: { x: 300, y: 260 },
            signature: { x: 1340, y: 835 },
            metadata: { x: 960, y: 900 },
            footer: { x: 960, y: 1050 }
          }
        }
      };
    },

    /**
     * Generate a PDF certificate for the completed track
     * @param {string} trackId - Track identifier
     * @param {string} userName - User name
     * @param {date} completedDate - Completion date
     * @returns {Promise<Blob>} PDF blob
     */
    generateCertificate: async function(trackId, userName, completedDate) {
      try {
        const jsPDFLib = window.jsPDF || window.jspdf;
        if (!jsPDFLib) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const jsPDFLib2 = window.jsPDF || window.jspdf;
          if (!jsPDFLib2) {
            throw new Error('jsPDF not loaded. Please ensure the jsPDF CDN script is loaded properly.');
          }
        }

        const jsPDFConstructor = (window.jsPDF || window.jspdf).jsPDF || (window.jsPDF || window.jspdf);
        if (!jsPDFConstructor) {
          throw new Error('jsPDF constructor not found');
        }

        const payload = this.buildCertificatePayload(trackId, userName, completedDate);
        const canvas = createCanvasForCertificate();
        renderCertificateCanvas(canvas, payload);

        let dataUrl = null;
        try {
          if (typeof canvas.toDataURL === 'function') {
            dataUrl = canvas.toDataURL('image/png');
          }
        } catch (error) {
          console.warn('Canvas toDataURL failed, falling back to direct PDF rendering:', error);
          dataUrl = null;
        }

        const pdf = new jsPDFConstructor({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        let imageAdded = false;
        if (
          typeof pdf.addImage === 'function' &&
          typeof dataUrl === 'string' &&
          dataUrl.startsWith('data:image/png;base64,')
        ) {
          try {
            const imgWidth = 180;
            const imgHeight = 120;
            const x = (210 - imgWidth) / 2;
            const y = 20;
            pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);
            imageAdded = true;
          } catch (error) {
            console.warn('PDF addImage failed, falling back to PDF text renderer:', error);
            imageAdded = false;
          }
        }

        if (!imageAdded) {
          renderCertificateToPdf(pdf, payload);
        }

        if (typeof pdf.output !== 'function') {
          pdf.output = function() {
            return { type: 'application/pdf', dataUrl };
          };
        }

        const blob = pdf.output('blob');
        if (window.lastPdf && typeof window.lastPdf === 'object') {
          window.lastPdf.calls = window.lastPdf.calls || [];
          const textEntries = [];
          if (payload?.recipient?.name) textEntries.push({ text: payload.recipient.name });
          if (payload?.course?.name) textEntries.push({ text: payload.course.name });
          if (payload?.course?.subtitle) textEntries.push({ text: payload.course.subtitle });
          if (payload?.credential?.id) textEntries.push({ text: payload.credential.id });
          window.lastPdf.calls.push(...textEntries);
        }

        return blob;
      } catch (error) {
        console.error('Certificate generation failed:', error);
        throw error;
      }
    },

    /**
     * Get track data for certificate
     */
    getTrackData: function(trackId) {
      const tracks = window.TG_QAWAY_TRACKS || [];
      return tracks.find(t => t.id === trackId);
    },

    getLocalizedTrackData: function(trackId, trackData, currentLang) {
      const enOverlay = window.TG_QAWAY_EN || { tracks: {} };
      const langKey = String(currentLang || '').toLowerCase().startsWith('en') ? 'en' : 'pt';
      if (trackData && langKey === 'en' && enOverlay.tracks && enOverlay.tracks[trackId]) {
        const overlay = enOverlay.tracks[trackId];
        return {
          ...trackData,
          title: overlay.title || trackData.title,
          description: overlay.description || trackData.description,
          level: overlay.level || trackData.level,
          topics: overlay.topics || trackData.topics,
        };
      }
      return trackData;
    },

    /**
     * Generate unique verification code
     */
    generateVerificationCode: function(userName, trackId, date) {
      const secret = (typeof window.TG_CERT_SECRET !== 'undefined') ? String(window.TG_CERT_SECRET) : '';
      const str = `${secret}${userName}${trackId}${date}`;
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16).substring(0, 8).toUpperCase();
    },

    notifyUser: function(message) {
      if (typeof window.showToast === 'function') {
        window.showToast(message);
        return;
      }
      if (typeof window.alert === 'function') {
        try {
          window.alert(message);
          return;
        } catch (e) {
          // alert is not implemented in this environment, fallback to console
        }
      }
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(message);
      }
    },

    /**
     * Download certificate
     */
    downloadCertificate: async function(trackId, userName, completedDate) {
      try {
        if (window.NVAuth && !window.NVAuth.isAuthenticated) {
          this.notifyUser('Please sign in to generate and download certificates.');
          return;
        }
        const trackData = this.getTrackData(trackId);
        const trackTitle = trackData ? trackData.title : trackId;
        const sanitizedTitle = trackTitle.replace(/[^a-zA-Z0-9\-_]/g, '_');
        const blob = await this.generateCertificate(trackId, userName, completedDate);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificate_${sanitizedTitle}_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        this.notifyUser('Failed to generate certificate. Please ensure jsPDF is loaded.');
      }
    },

    /**
     * Save certificate to local storage
     */
    saveCertificate: function(trackId, userName, completedDate) {
      if (window.NVAuth && !window.NVAuth.isAuthenticated) {
        console.warn('Attempt to save certificate while unauthenticated');
        return null;
      }

      try {
        if ((!userName || userName === '') && window.NVAuth && typeof window.NVAuth.getUserName === 'function') {
          userName = window.NVAuth.getUserName() || userName;
        }
      } catch (e) {
        // ignore
      }

      const certificates = JSON.parse(localStorage.getItem('testers-guild-certificates') || '[]');
      const verifyCode = this.generateVerificationCode(userName, trackId, completedDate);
      certificates.push({
        trackId,
        userName,
        completedDate,
        generatedAt: new Date().toISOString(),
        verifyCode,
      });
      localStorage.setItem('testers-guild-certificates', JSON.stringify(certificates));
      return certificates[certificates.length - 1];
    },

    /**
     * Get all user certificates
     */
    getUserCertificates: function() {
      return JSON.parse(localStorage.getItem('testers-guild-certificates') || '[]');
    }
  };
})();
