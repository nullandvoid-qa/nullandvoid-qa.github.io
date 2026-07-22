describe('app storage normalization', () => {
  beforeEach(() => {
    global.window = global.window || {};
    global.window.NVAuth = null;
  });

  test('normalizes progress, bookmarks, and quizzes to safe shapes', () => {
    const { normalizeProgressState, normalizeBookmarksState, normalizeQuizzesState } = require('../app-storage.js');

    const progress = normalizeProgressState({ lessonA: { completedAt: '2024-01-01' } });
    const bookmarks = normalizeBookmarksState(['lessonA', '']);
    const quizzes = normalizeQuizzesState({ quizA: { passedAt: '2024-01-01', score: 90 } });

    expect(progress.lessonA.completedAt).toBe('2024-01-01');
    expect(bookmarks).toEqual(['lessonA']);
    expect(quizzes.quizA.score).toBe(90);
  });

  test('normalizes imported payload values before returning them', () => {
    const { normalizeProgressState, normalizeBookmarksState, normalizeQuizzesState } = require('../app-storage.js');

    const importedProgress = normalizeProgressState({ lessonA: { completedAt: '2024-01-01', extra: true } });
    const importedBookmarks = normalizeBookmarksState(['lessonA', '']);
    const importedQuizzes = normalizeQuizzesState({ quizA: { passedAt: '2024-01-01', score: 90, extra: true } });

    expect(importedProgress).toEqual({ lessonA: { completedAt: '2024-01-01' } });
    expect(importedBookmarks).toEqual(['lessonA']);
    expect(importedQuizzes).toEqual({ quizA: { passedAt: '2024-01-01', score: 90 } });
  });
});
