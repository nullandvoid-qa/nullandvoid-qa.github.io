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

        const localizedTrackData = this.getLocalizedTrackData(trackId, trackData, window.lang || 'en');

        // Create PDF
        const pdf = new jsPDFConstructor({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });

        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        const bgColor = [10, 15, 38];
        const panelColor = [18, 26, 52];
        const cardColor = [22, 34, 72];
        const titleColor = [236, 72, 153];
        const accentBlue = [96, 165, 250];
        const neonPink = [255, 115, 168];
        const mutedColor = [179, 189, 212];
        const textColor = [235, 238, 245];

        // Full-page background
        pdf.setFillColor(...bgColor);
        pdf.rect(0, 0, width, height, "F");

        // Border accent lines
        pdf.setDrawColor(...accentBlue);
        pdf.setLineWidth(1.5);
        pdf.line(8, 8, width - 8, 8);
        pdf.line(8, height - 8, width - 8, height - 8);
        pdf.line(8, 8, 8, height - 8);
        pdf.line(width - 8, 8, width - 8, height - 8);

        // Main certificate panel
        const panelX = 16;
        const panelY = 22;
        const panelWidth = width - panelX * 2;
        const panelHeight = height - panelY * 2;
        pdf.setFillColor(...panelColor);
        if (typeof pdf.roundedRect === 'function') {
          pdf.roundedRect(panelX, panelY, panelWidth, panelHeight, 8, 8, "F");
        } else {
          pdf.rect(panelX, panelY, panelWidth, panelHeight, "F");
        }
        pdf.setDrawColor(...accentBlue);
        pdf.setLineWidth(2);
        if (typeof pdf.roundedRect === 'function') {
          pdf.roundedRect(panelX, panelY, panelWidth, panelHeight, 8, 8);
        } else {
          pdf.rect(panelX, panelY, panelWidth, panelHeight);
        }

        // Header block
        pdf.setTextColor(...titleColor);
        pdf.setFontSize(24);
        pdf.setFont(undefined, "bold");
        pdf.text("CERTIFICATE of ACHIEVEMENT", width / 2, panelY + 32, { align: "center" });

        pdf.setFontSize(10);
        pdf.setFont(undefined, "normal");
        pdf.setTextColor(...mutedColor);
        pdf.text("Recognizes", width / 2, panelY + 40, { align: "center" });

        // Title badge
        pdf.setFillColor(...neonPink);
        pdf.rect(panelX + 18, panelY + 42, 76, 10, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text("Null and Void QA Course", panelX + 22, panelY + 49);

        // Recipient section
        pdf.setFontSize(12);
        pdf.setTextColor(...mutedColor);
        pdf.text("Presented to", width / 2, panelY + 64, { align: "center" });

        pdf.setFontSize(42);
        pdf.setFont(undefined, "bold");
        pdf.setTextColor(...textColor);
        pdf.text(userName, width / 2, panelY + 88, { align: "center" });

        pdf.setFontSize(11);
        pdf.setFont(undefined, "normal");
        pdf.setTextColor(...mutedColor);
        pdf.text("For successfully completing the following learning path", width / 2, panelY + 102, { align: "center" });

        // Track detail card
        const trackBoxY = panelY + 100;
        const trackBoxHeight = 42;
        pdf.setFillColor(...cardColor);
        pdf.rect(panelX + 25, trackBoxY, panelWidth - 50, trackBoxHeight, "F");
        pdf.setDrawColor(...neonPink);
        pdf.setLineWidth(0.9);
        pdf.rect(panelX + 25, trackBoxY, panelWidth - 50, trackBoxHeight);

        pdf.setTextColor(...textColor);
        pdf.setFontSize(15);
        pdf.setFont(undefined, "bold");
        pdf.text(`${localizedTrackData.icon || ""} ${localizedTrackData.title}`, width / 2, trackBoxY + 15, { align: "center" });

        pdf.setTextColor(...mutedColor);
        pdf.setFontSize(9.5);
        pdf.setFont(undefined, "normal");
        const description = localizedTrackData.description || "Advance your QA career with practical skills and critical thinking.";
        pdf.text(description, width / 2, trackBoxY + 28, { align: "center" });

        pdf.setTextColor(...textColor);
        pdf.setFontSize(10);
        const levelLabel = localizedTrackData.level || "N/A";
        const topicsLabel = Array.isArray(localizedTrackData.topics) ? localizedTrackData.topics.slice(0, 4).join(', ') : 'QA';
        pdf.text(`Level: ${levelLabel.toUpperCase()} • Topics: ${topicsLabel}`, width / 2, trackBoxY + 38, { align: "center" });

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
        const issueDateStr = issueDate.toLocaleDateString("en-US", {
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
        pdf.setDrawColor(...accentBlue);
        pdf.setLineWidth(0.7);
        pdf.line(panelX + 35, signY, panelX + 85, signY);
        pdf.line(width - panelX - 85, signY, width - panelX - 35, signY);

        pdf.setFont(undefined, "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...textColor);
        pdf.text("Kaio Garcia", panelX + 40, signY + 5);
        pdf.text("Program Coordinator", width - panelX - 40, signY + 5, { align: "right" });

        pdf.setFontSize(8);
        pdf.setTextColor(...mutedColor);
        pdf.text("Powered by Null and Void QA Course", width / 2, height - 14, { align: "center" });

        // PDF metadata (helpful for printing/indexing)
        if (typeof pdf.setProperties === 'function') {
          pdf.setProperties({
            title: `${trackData.title} - Certificate of Achievement`,
            subject: `Certificate for ${userName}`,
            author: 'Null and Void QA Course',
            keywords: 'certificate,qa,achievement',
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

    getLocalizedTrackData: function(trackId, trackData, currentLang) {
      const enOverlay = window.TG_QAWAY_EN || { tracks: {} };
      if (trackData && currentLang === "en" && enOverlay.tracks && enOverlay.tracks[trackId]) {
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
          this.notifyUser('Please sign in to generate and download certificates.');
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
        this.notifyUser("Failed to generate certificate. Please ensure jsPDF is loaded.");
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
