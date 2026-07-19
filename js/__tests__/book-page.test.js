const { getSavedBooks, setSavedBooks, isBookBookmarked, toggleBookmark } = require('../../books/assets/js/book.js');

describe('book detail page helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves bookmarked book IDs', () => {
    setSavedBooks(['book-1', 'book-2']);
    expect(getSavedBooks()).toEqual(['book-1', 'book-2']);
  });

  it('detects bookmarked books by id', () => {
    setSavedBooks(['book-abc']);
    expect(isBookBookmarked('book-abc')).toBe(true);
    expect(isBookBookmarked('missing-book')).toBe(false);
  });

  it('toggles bookmark state correctly', () => {
    toggleBookmark('book-xyz');
    expect(isBookBookmarked('book-xyz')).toBe(true);

    toggleBookmark('book-xyz');
    expect(isBookBookmarked('book-xyz')).toBe(false);
  });
});
