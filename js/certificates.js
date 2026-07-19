// Certificate generation module
(function() {
  "use strict";

  window.TG_CERTIFICATES = {
    /**
     * Generate a PDF certificate for completed track
     * @param {string} trackId - ID da trilha
     * @param {string} userName - Nome do usuário
     * @param {date} completedDate - Data de conclusão
     * @returns {Promise<Blob>} PDF blob
     */
    generateCertificate: async function(trackId, userName, completedDate) {
      try {
        // Check if user has jsPDF available (can be window.jsPDF or window.jspdf)
        const jsPDFLib = window.jsPDF || window.jspdf;
        if (!jsPDFLib) {
          // Wait a bit and check again (library may still be loading)
          await new Promise(resolve => setTimeout(resolve, 500));
          const jsPDFLib2 = window.jsPDF || window.jspdf;
          if (!jsPDFLib2) {
            throw new Error("jsPDF not loaded. Please ensure the jsPDF CDN script is loaded properly.");
          }
        }
        
        // Get the jsPDF constructor (it can be at different paths)
        const jsPDFConstructor = (window.jsPDF || window.jspdf).jsPDF || (window.jsPDF || window.jspdf);
        if (!jsPDFConstructor) {
          throw new Error("jsPDF constructor not found");
        }

        // Prefer the logged-in user's name when available
        try {
          if ((!userName || userName === '') && window.NVAuth && typeof window.NVAuth.getUserName === 'function') {
            userName = window.NVAuth.getUserName() || userName;
          }
        } catch (e) {
          // ignore
        }

        const trackData = this.getTrackData(trackId);
        if (!trackData) throw new Error("Track not found");

        // Create PDF
        const pdf = new jsPDFConstructor({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });

        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        const bgColor = [7, 11, 24];
        const darkPanel = [18, 28, 48];
        const lightPanel = [248, 250, 252];
        const titleColor = [17, 24, 39];
        const accentColor = [96, 165, 250];
        const accentColorDark = [139, 92, 246];
        const mutedColor = [100, 116, 139];

        // Full-page background
        pdf.setFillColor(...bgColor);
        pdf.rect(0, 0, width, height, "F");

        // Top gradient accent band
        pdf.setFillColor(...accentColor);
        pdf.rect(0, 0, width, 16, "F");
        pdf.setFillColor(...accentColorDark);
        pdf.rect(0, 16, width * 0.3, 10, "F");

        // Main certificate panel
        const panelX = 14;
        const panelY = 22;
        const panelWidth = width - panelX * 2;
        const panelHeight = height - panelY * 2;
        pdf.setFillColor(...lightPanel);
        if (typeof pdf.roundedRect === 'function') {
          pdf.roundedRect(panelX, panelY, panelWidth, panelHeight, 6, 6, "F");
        } else {
          pdf.rect(panelX, panelY, panelWidth, panelHeight, "F");
        }
        pdf.setDrawColor(...accentColor);
        pdf.setLineWidth(1.5);
        if (typeof pdf.roundedRect === 'function') {
          pdf.roundedRect(panelX, panelY, panelWidth, panelHeight, 6, 6);
        } else {
          pdf.rect(panelX, panelY, panelWidth, panelHeight);
        }

        // Header block
        pdf.setTextColor(...titleColor);
        pdf.setFontSize(22);
        pdf.setFont(undefined, "bold");
        pdf.text("CERTIFICATE OF COMPLETION", width / 2, panelY + 28, { align: "center" });

        pdf.setFontSize(9);
        pdf.setFont(undefined, "normal");
        pdf.setTextColor(...mutedColor);
        pdf.text("Certificado de Conclusão", width / 2, panelY + 34, { align: "center" });

        // Title badge
        pdf.setFillColor(...accentColor);
        pdf.rect(panelX + 18, panelY + 38, 70, 10, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text("Null and Void QA Course", panelX + 22, panelY + 45);

        // Recipient section
        pdf.setFontSize(12);
        pdf.setTextColor(...titleColor);
        pdf.text("This certifies that", width / 2, panelY + 55, { align: "center" });

        pdf.setFontSize(40);
        pdf.setFont(undefined, "bold");
        pdf.setTextColor(...titleColor);
        pdf.text(userName, width / 2, panelY + 82, { align: "center" });

        pdf.setFontSize(11);
        pdf.setFont(undefined, "normal");
        pdf.setTextColor(...mutedColor);
        pdf.text("has successfully completed the following learning track", width / 2, panelY + 92, { align: "center" });

        // Track detail card
        const trackBoxY = panelY + 100;
        const trackBoxHeight = 42;
        pdf.setFillColor(235, 247, 255);
        pdf.rect(panelX + 25, trackBoxY, panelWidth - 50, trackBoxHeight, "F");
        pdf.setDrawColor(...accentColorDark);
        pdf.setLineWidth(0.8);
        pdf.rect(panelX + 25, trackBoxY, panelWidth - 50, trackBoxHeight);

        pdf.setTextColor(...accentColorDark);
        pdf.setFontSize(15);
        pdf.setFont(undefined, "bold");
        pdf.text(`${trackData.icon || ""} ${trackData.title}`, width / 2, trackBoxY + 15, { align: "center" });

        pdf.setTextColor(...mutedColor);
        pdf.setFontSize(9.5);
        pdf.setFont(undefined, "normal");
        const description = trackData.description || "Avance sua carreira em QA com habilidades práticas e mindset crítico.";
        pdf.text(description, width / 2, trackBoxY + 28, { align: "center" });

        pdf.setTextColor(...titleColor);
        pdf.setFontSize(10);
        pdf.text(`Level: ${trackData.level || "N/A"} • Topics: ${Array.isArray(trackData.topics) ? trackData.topics.slice(0, 4).join(', ') : 'QA'}`, width / 2, trackBoxY + 38, { align: "center" });

        // Detail columns
        const detailY = trackBoxY + trackBoxHeight + 12;
        const detailGap = 57;
        const detailX = panelX + 36;
        pdf.setTextColor(...titleColor);
        pdf.setFontSize(10);
        pdf.setFont(undefined, "bold");
        pdf.text("ISSUE DATE", detailX, detailY);
        pdf.text("CERTIFICATE ID", detailX + detailGap, detailY);
        pdf.text("VERIFICATION", detailX + detailGap * 2, detailY);

        const issueDate = completedDate ? new Date(completedDate) : new Date();
        const issueDateStr = issueDate.toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const verifyCode = this.generateVerificationCode(userName, trackId, completedDate);
        const verifyUrl = `https://nullandvoid-qa.github.io/verify.html?code=${verifyCode}`;

        pdf.setTextColor(...mutedColor);
        pdf.setFontSize(9);
        pdf.setFont(undefined, "normal");
        pdf.text(issueDateStr, detailX, detailY + 6);
        pdf.text(verifyCode, detailX + detailGap, detailY + 6);
        pdf.text("Visit: " + verifyUrl, detailX + detailGap * 2, detailY + 6);

        // Bottom signature section
        const signY = height - 38;
        pdf.setDrawColor(...accentColor);
        pdf.setLineWidth(0.7);
        pdf.line(panelX + 35, signY, panelX + 85, signY);
        pdf.line(width - panelX - 85, signY, width - panelX - 35, signY);

        pdf.setFont(undefined, "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...titleColor);
        pdf.text("Kaio Garcia", panelX + 60, signY + 5);
        pdf.text("Program Coordinator", width - panelX - 60, signY + 5);

        pdf.setFontSize(8);
        pdf.setTextColor(...mutedColor);
        pdf.text("Powered by Null and Void QA Course", width / 2, height - 14, { align: "center" });

        // PDF metadata (helpful for printing/indexing)
        if (typeof pdf.setProperties === 'function') {
          pdf.setProperties({
            title: `${trackData.title} - Certificate of Completion`,
            subject: `Certificate for ${userName}`,
            author: 'Null and Void QA Course',
            keywords: 'certificate,qa,completion',
            creator: 'Null and Void QA Course'
          });
        }

        return pdf.output("blob");
      } catch (error) {
        console.error("Certificate generation failed:", error);
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
        hash = hash & hash; // Convert to 32bit integer
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
        // If NVAuth is present, require authentication to download certificates.
        if (window.NVAuth && !window.NVAuth.isAuthenticated) {
          this.notifyUser('Por favor, faça login para gerar e baixar certificados.');
          return;
        }
        const trackData = this.getTrackData(trackId);
        const trackTitle = trackData ? trackData.title : trackId;
        const sanitizedTitle = trackTitle.replace(/[^a-zA-Z0-9\-_]/g, '_');
        const blob = await this.generateCertificate(trackId, userName, completedDate);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Certificate_${sanitizedTitle}_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        this.notifyUser("Falha ao gerar o certificado. O jsPDF pode não estar carregado.");
      }
    },

    /**
     * Save certificate to local storage
     */
    saveCertificate: function(trackId, userName, completedDate) {
      // If NVAuth exists, require authentication to save certificates
      if (window.NVAuth && !window.NVAuth.isAuthenticated) {
        console.warn('Attempt to save certificate while unauthenticated');
        return null;
      }

      // Use authenticated user's name when available
      try {
        if ((!userName || userName === '') && window.NVAuth && typeof window.NVAuth.getUserName === 'function') {
          userName = window.NVAuth.getUserName() || userName;
        }
      } catch (e) {
        // ignore
      }

      const certificates = JSON.parse(localStorage.getItem("testers-guild-certificates") || "[]");
      const verifyCode = this.generateVerificationCode(userName, trackId, completedDate);
      certificates.push({
        trackId,
        userName,
        completedDate,
        generatedAt: new Date().toISOString(),
        verifyCode,
      });
      localStorage.setItem("testers-guild-certificates", JSON.stringify(certificates));
      return certificates[certificates.length - 1];
    },

    /**
     * Get all user certificates
     */
    getUserCertificates: function() {
      return JSON.parse(localStorage.getItem("testers-guild-certificates") || "[]");
    }
  };
})();
