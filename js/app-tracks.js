/* app-tracks.js
 * Extracted helper to merge track data sources.
 */
(function () {
  function mergeTrackSources() {
    const baseTracks = Array.isArray(window.TG_QAWAY_TRACKS) ? window.TG_QAWAY_TRACKS : [];
    const mergedTracks = [...baseTracks];

    const sources = [
      {
        key: 'TG_PERFORMANCE_TRACK',
        id: 'performance',
        slug: 'performance-testing',
        icon: 'perf',
        title: 'Arena de Carga',
        color: '#f59e0b',
        description: 'Performance testing com K6 e JMeter.',
        level: 'Sênior',
        modules: 3,
        hours: 40,
        topics: ['Load Testing', 'K6', 'JMeter'],
      },
      {
        key: 'TG_MENTORSHIP',
        id: 'mentorship',
        slug: 'mentorship',
        icon: 'mentor',
        title: 'Mentorship',
        color: '#6366f1',
        description: 'Programa de mentoria e liderança.',
        level: 'Intermediário',
        modules: 3,
        hours: 30,
        topics: ['Mentoring', 'Liderança'],
      },
    ];

    sources.forEach((source) => {
      const dataset = window[source.key];
      if (dataset && dataset.courses && !mergedTracks.find((track) => track.id === source.id)) {
        mergedTracks.push({
          id: source.id,
          slug: source.slug,
          icon: source.icon,
          title: source.title,
          color: source.color,
          description: source.description,
          level: source.level,
          modules: source.modules,
          hours: source.hours,
          topics: source.topics,
          courses: dataset.courses,
        });
      }
    });

    if (window.TG_MOBILE_LABS && Array.isArray(window.TG_MOBILE_LABS)) {
      const mobileLessons = window.TG_MOBILE_LABS.map((lab, index) => ({
        id: `mobile-lab-${index + 1}-${lab.id}`,
        title: lab.name || `Mobile Lab ${index + 1}`,
        duration: '20 min',
        content: `\n          <h2>${lab.name || `Mobile Lab ${index + 1}`}</h2>\n          <p><strong>Tipo:</strong> ${lab.type || 'mobile'}</p>\n          <p><strong>Dispositivo:</strong> ${lab.device || (Array.isArray(lab.devices) ? lab.devices.join(', ') : 'N/A')}</p>\n          <p><strong>Ferramentas:</strong> ${Array.isArray(lab.tools) ? lab.tools.join(', ') : 'Appium + WebDriverIO'}</p>\n          <p><strong>Custo:</strong> ${lab.cost || 'N/A'}</p>\n          <pre>${lab.setup || ''}</pre>\n        `,
      }));

      const mobileTrack = mergedTracks.find((track) => track.id === 'mobile');
      const mobileTrackPayload = {
        id: 'mobile',
        slug: 'mobile-testing',
        icon: 'mobile',
        title: 'Trilha de Testes Mobile',
        color: '#22c55e',
        description: 'Trilha única para testes mobile em emuladores, simuladores e dispositivos reais.',
        level: 'Intermediário',
        modules: mobileLessons.length,
        hours: Math.max(4, mobileLessons.length),
        topics: ['Appium', 'WebDriverIO', 'Android', 'iOS', 'Emuladores', 'Devices reais'],
        courses: [
          {
            id: 'mobile-labs-course',
            title: 'Mobile Testing Labs',
            lessons: mobileLessons,
          },
        ],
      };

      if (mobileTrack) {
        Object.assign(mobileTrack, mobileTrackPayload);
      } else {
        mergedTracks.push(mobileTrackPayload);
      }
    }

    return mergedTracks;
  }

  function countLessons(track) {
    if (!track || !track.courses || !Array.isArray(track.courses)) return 0;
    return track.courses.reduce((sum, course) => sum + (course.lessons ? course.lessons.length : 0), 0);
  }

  function getTrackModules(track) {
    if (!track) return 0;
    return typeof track.modules === 'number' && track.modules > 0 ? track.modules : countLessons(track);
  }

  function getTrackHours(track) {
    if (!track) return 0;
    if (typeof track.hours === 'number' && track.hours > 0) return track.hours;
    const lessons = countLessons(track);
    return lessons > 0 ? lessons : 0;
  }

  function getTrackProgress(track, progress) {
    if (!track || !track.courses) return { done: 0, total: 0, pct: 0 };
    const total = countLessons(track);
    const done = track.courses.reduce(
      (sum, course) => sum + (course.lessons ? course.lessons.filter((lesson) => progress[lesson.id]).length : 0),
      0,
    );
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function getGlobalProgress(tracks, progress) {
    const allLessons = tracks
      .filter((track) => track && track.courses && Array.isArray(track.courses))
      .flatMap((track) => track.courses.flatMap((course) => course.lessons || []));

    const done = allLessons.filter((lesson) => lesson && progress[lesson.id]).length;
    return {
      done,
      total: allLessons.length,
      pct: allLessons.length ? Math.round((done / allLessons.length) * 100) : 0,
    };
  }

  function getAllLessons(tracks, { localizedTrack, localizedCourse, localizedLesson }) {
    const lessons = [];
    tracks.forEach((track) => {
      if (!track || !track.courses || !Array.isArray(track.courses)) return;
      const lt = localizedTrack(track);
      track.courses.forEach((course) => {
        if (!course || !course.lessons || !Array.isArray(course.lessons)) return;
        const lc = localizedCourse(course);
        course.lessons.forEach((lesson) => {
          lessons.push({
            ...localizedLesson(lesson),
            trackId: track.id,
            trackTitle: lt.title,
            courseTitle: lc.title,
          });
        });
      });
    });
    return lessons;
  }

  function findTrack(tracks, id) {
    return tracks.find((track) => track.id === id);
  }

  function findLesson(tracks, lessonId, { localizedTrack, localizedCourse, localizedLesson }) {
    for (const track of tracks) {
      if (!track || !track.courses || !Array.isArray(track.courses)) continue;
      for (const course of track.courses) {
        if (!course || !course.lessons || !Array.isArray(course.lessons)) continue;
        const lesson = course.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          return {
            track: localizedTrack(track),
            course: localizedCourse(course),
            lesson: localizedLesson(lesson),
            rawTrack: track,
            rawCourse: course,
            rawLesson: lesson,
          };
        }
      }
    }
    return null;
  }

  window.NVAppTracks = window.NVAppTracks || {};
  window.NVAppTracks.mergeTrackSources = mergeTrackSources;
  window.NVAppTracks.countLessons = countLessons;
  window.NVAppTracks.getTrackModules = getTrackModules;
  window.NVAppTracks.getTrackHours = getTrackHours;
  window.NVAppTracks.getTrackProgress = getTrackProgress;
  window.NVAppTracks.getGlobalProgress = getGlobalProgress;
  window.NVAppTracks.getAllLessons = getAllLessons;
  window.NVAppTracks.findTrack = findTrack;
  window.NVAppTracks.findLesson = findLesson;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      mergeTrackSources,
      countLessons,
      getTrackModules,
      getTrackHours,
      getTrackProgress,
      getGlobalProgress,
      getAllLessons,
      findTrack,
      findLesson,
    };
  }
})();
