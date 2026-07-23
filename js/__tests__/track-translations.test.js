/**
 * Tests for track translation coverage.
 */

describe('Track translation coverage', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../../data/tracks.js')];
    delete require.cache[require.resolve('../../data/translations-en.js')];
    require('../../data/tracks.js');
    require('../../data/translations-en.js');
  });

  test('all top-level track IDs have English translations', () => {
    const trackIds = Array.isArray(window.TG_QAWAY_TRACKS)
      ? window.TG_QAWAY_TRACKS.map((track) => track.id)
      : [];
    const translationIds = window.TG_QAWAY_EN && window.TG_QAWAY_EN.tracks
      ? Object.keys(window.TG_QAWAY_EN.tracks)
      : [];

    expect(trackIds).not.toHaveLength(0);
    trackIds.forEach((id) => {
      expect(translationIds).toContain(id);
    });
  });
});
