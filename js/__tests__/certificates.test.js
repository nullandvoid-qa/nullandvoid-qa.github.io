/**
 * Tests for certificate generation and storage behavior
 */

describe('TG_CERTIFICATES Module', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    delete window.NVAuth;

    // Re-import certificates.js to ensure fresh global state
    delete require.cache[require.resolve('../certificates.js')];
    require('../certificates.js');

    window.TG_QAWAY_TRACKS = [
      { id: 'web', title: 'Web Automation', icon: 'web' },
    ];

    window.jsPDF = function () {
      this.internal = {
        pageSize: {
          getWidth: () => 297,
          getHeight: () => 210,
        },
      };
      this.calls = [];
      window.lastPdf = this;
      return this;
    };

    window.jsPDF.prototype.setFillColor = jest.fn();
    window.jsPDF.prototype.rect = jest.fn();
    window.jsPDF.prototype.setTextColor = jest.fn();
    window.jsPDF.prototype.setFontSize = jest.fn();
    window.jsPDF.prototype.text = function (text, x, y, opts) {
      this.calls.push({ text, x, y, opts });
    };
    window.jsPDF.prototype.setFont = jest.fn();
    window.jsPDF.prototype.setDrawColor = jest.fn();
    window.jsPDF.prototype.setLineWidth = jest.fn();
    window.jsPDF.prototype.line = jest.fn();
    window.jsPDF.prototype.output = function (mode) {
      if (mode === 'blob') {
        return { type: 'application/pdf', textCalls: this.calls };
      }
      return null;
    };
  });

  test('generateCertificate includes Google user name when provided', async () => {
    const completedDate = new Date('2026-07-19T11:00:00Z');

    const blob = await window.TG_CERTIFICATES.generateCertificate('web', 'Google User', completedDate);

    expect(blob).toEqual(expect.objectContaining({ type: 'application/pdf' }));
    expect(window.lastPdf.calls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: 'Google User' }),
        expect.objectContaining({ text: expect.stringContaining('Web Automation') }),
      ]),
    );
  });

  test('generateCertificate uses blank name when user is not logged in', async () => {
    const completedDate = new Date('2026-07-19T11:00:00Z');

    const blob = await window.TG_CERTIFICATES.generateCertificate('web', '', completedDate);

    expect(blob).toEqual(expect.objectContaining({ type: 'application/pdf' }));
    expect(window.lastPdf.calls.some((call) => call.text === '')).toBe(true);
  });

  test('buildCertificatePayload maps track data into the new certificate engine shape', () => {
    window.TG_QAWAY_TRACKS = [
      {
        id: 'web',
        title: 'Web Automation',
        description: 'Build reliable browser automation flows.',
        level: 'Intermediate',
        topics: ['Playwright', 'Assertions', 'Debugging'],
      },
    ];

    const payload = window.TG_CERTIFICATES.buildCertificatePayload('web', 'Google User', new Date('2026-07-19T11:00:00Z'));

    expect(payload.recipient.name).toBe('Google User');
    expect(payload.course.name).toBe('Web Automation');
    expect(payload.course.subtitle).toContain('reliable browser automation');
    expect(payload.skills).toEqual(['Playwright', 'Assertions', 'Debugging']);
  });

  test('generateShareableCertificate returns an upload-friendly PNG blob', async () => {
    const completedDate = new Date('2026-07-19T11:00:00Z');

    const blob = await window.TG_CERTIFICATES.generateShareableCertificate('web', 'Google User', completedDate);

    expect(blob).toEqual(expect.objectContaining({ type: 'image/png' }));
  });

  test('downloadShareableCertificate persists a certificate entry after export', async () => {
    window.NVAuth = {
      isAuthenticated: true,
      getUserName: () => 'Google User',
    };

    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn(() => 'blob:test-share');
    }
    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = jest.fn();
    }

    const createObjectURL = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-share');
    const revokeObjectURL = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const generateShareableCertificate = jest.spyOn(window.TG_CERTIFICATES, 'generateShareableCertificate').mockResolvedValue(new Blob(['png-data'], { type: 'image/png' }));

    await window.TG_CERTIFICATES.downloadShareableCertificate('web', 'Google User', new Date('2026-07-19T11:00:00Z'));

    const stored = JSON.parse(localStorage.getItem('testers-guild-certificates') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual(expect.objectContaining({ trackId: 'web', userName: 'Google User' }));

    createObjectURL.mockRestore();
    revokeObjectURL.mockRestore();
    generateShareableCertificate.mockRestore();
  });

  test('saveCertificate persists certificate with the provided user name or blank string', () => {
    const first = window.TG_CERTIFICATES.saveCertificate('web', 'Google User', new Date('2026-07-19T11:00:00Z'));
    const second = window.TG_CERTIFICATES.saveCertificate('web', '', new Date('2026-07-19T11:00:00Z'));

    const stored = JSON.parse(localStorage.getItem('testers-guild-certificates'));
    expect(stored).toHaveLength(2);
    expect(stored[0].userName).toBe('Google User');
    expect(stored[1].userName).toBe('');
    expect(first.verifyCode).toBeDefined();
    expect(second.verifyCode).toBeDefined();
  });
});
