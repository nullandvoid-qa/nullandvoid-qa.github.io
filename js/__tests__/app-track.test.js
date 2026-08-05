describe('app-track fallback rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="tracks-grid"></div>
      <div id="track-detail"></div>
      <div id="track-breadcrumb"></div>
    `;

    window.NVApp = {
      state: {
        lang: 'pt',
        tracks: [{ id: 'track-1', title: 'Track 1' }],
        progress: {},
      },
      helpers: {
        localizedTrack: (track) => track,
        getTrackProgress: () => ({ pct: 0, done: 0, total: 0 }),
        TRACK_AUDIENCE: { 'track-1': 'all' },
      },
    };

    window.NVIcons = {};
    window.escapeHtml = (value) => String(value);

    jest.resetModules();
    require('../app-track.js');
  });

  afterEach(() => {
    delete window.NVApp;
    delete window.NVIcons;
    delete window.escapeHtml;
    delete window.NVAppTrack;
    delete window.renderTrackDetail;
  });

  test('renderTrackCard falls back when buildTrackCardHtml is missing', () => {
    window.NVAppTrack.renderTrackCard({ id: 'track-1', title: 'Track 1' }, 'tracks-grid');
    expect(document.getElementById('tracks-grid').textContent).toContain('Track 1');
  });

  test('renderTrackDetail renders empty state when helper track is missing', async () => {
    await window.NVAppTrack.renderTrackDetail('missing-track');
    expect(document.getElementById('track-detail').innerHTML).toContain('Trilha indisponível no momento.');
  });
});
