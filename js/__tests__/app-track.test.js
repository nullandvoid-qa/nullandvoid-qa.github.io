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

  test('renderTrackCard fallback supports keyboard activation', () => {
    const navigateCalls = [];
    window.NVApp.helpers.navigate = (view, params) => navigateCalls.push({ view, params });

    window.NVAppTrack.renderTrackCard({ id: 'track-1', title: 'Track 1' }, 'tracks-grid');
    const card = document.querySelector('.track-card.fallback-card');
    expect(card).not.toBeNull();

    const clickEvent = new Event('click', { bubbles: true });
    card.dispatchEvent(clickEvent);

    const keyEvent = new window.KeyboardEvent('keydown', { key: ' ', bubbles: true });
    const preventSpy = jest.spyOn(keyEvent, 'preventDefault');
    card.dispatchEvent(keyEvent);

    expect(navigateCalls.length).toBe(2);
    expect(preventSpy).toHaveBeenCalled();
  });

  test('renderTrackCard binds keyboard activation when buildTrackCardHtml exists but bindAccessibleAction is absent', () => {
    const navigateCalls = [];
    window.NVApp.helpers.navigate = (view, params) => navigateCalls.push({ view, params });
    window.NVApp.helpers.localizedTrack = (track) => track;
    window.NVApp.helpers.getTrackProgress = () => ({ pct: 0, done: 0, total: 0 });
    window.NVApp.helpers.TRACK_AUDIENCE = { 'track-1': 'all' };
    window.NVAppTrack = window.NVAppTrack || {};
    window.NVApp.helpers.t = (key, fallback) => fallback || key;
    window.NVApp.helpers.tierLabel = (audience) => audience;
    window.NVApp.helpers.getTrackIcon = () => '';
    window.NVApp.helpers.normalizeTextLabel = (title) => title;
    window.NVApp.helpers.escapeHtml = (value) => String(value);

    window.NVViewHelpers = {
      buildTrackCardHtml: jest.fn(() => '<article class="track-card" role="button" tabindex="0"></article>'),
    };

    window.NVAppTrack.renderTrackCard({ id: 'track-1', title: 'Track 1' }, 'tracks-grid');
    const card = document.querySelector('.track-card');
    expect(card).not.toBeNull();
    expect(card.getAttribute('role')).toBe('button');
    expect(card.getAttribute('tabindex')).toBe('0');

    card.dispatchEvent(new Event('click', { bubbles: true }));
    const keyEvent = new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    const preventSpy = jest.spyOn(keyEvent, 'preventDefault');
    card.dispatchEvent(keyEvent);

    expect(navigateCalls.length).toBe(2);
    expect(preventSpy).toHaveBeenCalled();
  });

  test('renderTrackDetail renders empty state when helper track is missing', async () => {
    await window.NVAppTrack.renderTrackDetail('missing-track');
    expect(document.getElementById('track-detail').innerHTML).toContain('Trilha indisponível no momento.');
  });
});
