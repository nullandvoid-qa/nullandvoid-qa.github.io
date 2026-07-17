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
        // Check if user has jsPDF available
        if (!window.jsPDF) {
          throw new Error("jsPDF not loaded. Please add: <script src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'></script>");
        }

        const { jsPDF } = window;
        const trackData = this.getTrackData(trackId);
        if (!trackData) throw new Error("Track not found");

        // Create PDF
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });

        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        // Background gradient effect (solid color approximation)
        pdf.setFillColor(16, 185, 129); // Green
        pdf.rect(0, 0, width, height * 0.15, "F");
        pdf.rect(0, height * 0.85, width, height, "F");

        // Title
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(28);
        pdf.text("Certificate of Completion", width / 2, 20, { align: "center" });

        // Border
        pdf.setDrawColor(16, 185, 129);
        pdf.setLineWidth(2);
        pdf.rect(10, 10, width - 20, height - 20);

        // Content
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(14);
        pdf.text("This certifies that", width / 2, 45, { align: "center" });

        pdf.setFontSize(24);
        pdf.setFont(undefined, "bold");
        pdf.text(userName, width / 2, 60, { align: "center" });

        pdf.setFont(undefined, "normal");
        pdf.setFontSize(14);
        pdf.text("has successfully completed the track", width / 2, 75, { align: "center" });

        pdf.setFontSize(18);
        pdf.setFont(undefined, "bold");
        pdf.setTextColor(16, 185, 129);
        pdf.text(`${trackData.icon} ${trackData.title}`, width / 2, 92, { align: "center" });

        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, "normal");
        pdf.setFontSize(12);
        const completedDateStr = new Date(completedDate).toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        pdf.text(`Completed on: ${completedDateStr}`, width / 2, 110, { align: "center" });

        // Verification code
        const verifyCode = this.generateVerificationCode(userName, trackId, completedDate);
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Verification Code: ${verifyCode}`, width / 2, height - 25, { align: "center" });

        // QR Code placeholder (would need qrcode.js library)
        pdf.setFontSize(9);
        pdf.text(`nullandvoid-qa.github.io/verify/${verifyCode}`, width / 2, height - 18, { align: "center" });

        // Signature line
        pdf.setLineWidth(0.5);
        pdf.line(width / 2 - 30, height - 35, width / 2 + 30, height - 35);
        pdf.text("Null and Void QA Course", width / 2, height - 30, { align: "center" });

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
      const str = `${userName}${trackId}${date}`;
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16).substring(0, 8).toUpperCase();
    },

    /**
     * Download certificate
     */
    downloadCertificate: async function(trackId, userName, completedDate) {
      try {
        const blob = await this.generateCertificate(trackId, userName, completedDate);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Certificate_${trackId}_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to generate certificate. jsPDF library may not be loaded.");
      }
    },

    /**
     * Save certificate to local storage
     */
    saveCertificate: function(trackId, userName, completedDate) {
      const certificates = JSON.parse(localStorage.getItem("testers-guild-certificates") || "[]");
      certificates.push({
        trackId,
        userName,
        completedDate,
        generatedAt: new Date().toISOString(),
        verifyCode: this.generateVerificationCode(userName, trackId, completedDate)
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
