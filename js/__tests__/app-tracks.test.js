describe('app-tracks helper', () => {
  beforeEach(() => {
    delete window.NVAppTracks;
    delete window.TG_QAWAY_TRACKS;
    delete window.TG_PERFORMANCE_TRACK;
    delete window.TG_MENTORSHIP;
    delete window.TG_MOBILE_LABS;
    jest.resetModules();
  });

  afterEach(() => {
    delete window.NVAppTracks;
    delete window.TG_QAWAY_TRACKS;
    delete window.TG_PERFORMANCE_TRACK;
    delete window.TG_MENTORSHIP;
    delete window.TG_MOBILE_LABS;
  });

  test('exports mergeTrackSources and merges optional remote track sources', () => {
    window.TG_QAWAY_TRACKS = [{ id: 'starter' }];
    window.TG_PERFORMANCE_TRACK = { courses: [{ id: 'perf-1' }] };
    window.TG_MENTORSHIP = { courses: [{ id: 'mentor-1' }] };
    window.TG_MOBILE_LABS = [
      { id: 'lab1', name: 'Mobile Lab 1', type: 'mobile', device: 'Android', tools: ['Appium'], cost: 'Free' },
    ];

    require('../app-tracks.js');

    expect(window.NVAppTracks).toBeDefined();
    expect(typeof window.NVAppTracks.mergeTrackSources).toBe('function');

    const merged = window.NVAppTracks.mergeTrackSources();
    expect(merged).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'starter' }),
        expect.objectContaining({ id: 'performance' }),
        expect.objectContaining({ id: 'mentorship' }),
        expect.objectContaining({ id: 'mobile' }),
      ]),
    );
  });

  test('mergeTrackSources returns empty array when TG_QAWAY_TRACKS is invalid', () => {
    window.TG_QAWAY_TRACKS = null;

    require('../app-tracks.js');

    expect(window.NVAppTracks.mergeTrackSources()).toEqual([]);
  });

  test('preserves existing mobile courses when adding generated labs', () => {
    window.TG_QAWAY_TRACKS = [{
      id: 'mobile',
      courses: [{ id: 'mobile-core', lessons: [{ id: 'l27' }] }],
    }];
    window.TG_MOBILE_LABS = [{ id: 'lab1', name: 'Mobile Lab 1' }];

    require('../app-tracks.js');

    const mobileTrack = window.NVAppTracks.mergeTrackSources().find((track) => track.id === 'mobile');
    expect(mobileTrack.courses).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'mobile-core' }),
      expect.objectContaining({ id: 'mobile-labs-course' }),
    ]));
    expect(mobileTrack.courses.flatMap((course) => course.lessons).map((lesson) => lesson.id)).toContain('l27');
  });

  test('mergeTrackSources returns empty array when TG_QAWAY_TRACKS is not an array', () => {
    window.TG_QAWAY_TRACKS = { id: 'starter' };

    require('../app-tracks.js');

    expect(window.NVAppTracks.mergeTrackSources()).toEqual([]);
  });
});
