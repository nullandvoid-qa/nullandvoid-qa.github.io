const bookmarkPage = require('../../../page-objects/bookmark.page');

beforeEach(() => {
  // ensure a clean state
  bookmarkPage.clear();
  jest.resetModules();
  window.setStoredItem = jest.fn((key, value) => localStorage.setItem(key, value));
});

test('favorite toggles bookmark state and persists to localStorage', () => {
  // arrange
  bookmarkPage.init();
  // ensure app-bookmarks is loaded to provide toggleBookmark implementation
  require('../../app-bookmarks.js');

  const lessonId = 'lesson-integration-1';

  // act - favorite
  bookmarkPage.favorite(lessonId);

  // assert
  expect(bookmarkPage.isFavorited(lessonId)).toBe(true);
  expect(window.setStoredItem).toHaveBeenCalledWith('testers-guild-bookmarks', JSON.stringify([lessonId]));
  const stored = JSON.parse(localStorage.getItem('testers-guild-bookmarks') || '[]');
  expect(stored).toContain(lessonId);

  // act - unfavorite
  bookmarkPage.favorite(lessonId);
  expect(bookmarkPage.isFavorited(lessonId)).toBe(false);
  expect(window.setStoredItem).toHaveBeenCalledWith('testers-guild-bookmarks', JSON.stringify([]));
  const stored2 = JSON.parse(localStorage.getItem('testers-guild-bookmarks') || '[]');
  expect(stored2).not.toContain(lessonId);
});
