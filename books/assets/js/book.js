(function (root, factory) {
  const moduleExports = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = moduleExports;
  } else {
    root.BookHelpers = moduleExports;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const STORAGE_KEY = 'saved-books';

  function getSavedBooks() {
    try {
      const rawValue = localStorage.getItem(STORAGE_KEY);
      if (!rawValue) {
        return [];
      }

      const parsedValue = JSON.parse(rawValue);
      return Array.isArray(parsedValue) ? parsedValue : [];
    } catch (error) {
      return [];
    }
  }

  function setSavedBooks(books) {
    const normalizedBooks = Array.isArray(books) ? books : [];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedBooks));
    } catch (error) {
      // Ignore storage failures in test and browser environments.
    }
  }

  function isBookBookmarked(bookId) {
    return getSavedBooks().includes(bookId);
  }

  function toggleBookmark(bookId) {
    if (!bookId) {
      return getSavedBooks();
    }

    const savedBooks = getSavedBooks();
    const isBookmarked = savedBooks.includes(bookId);
    const nextBooks = isBookmarked
      ? savedBooks.filter((savedBookId) => savedBookId !== bookId)
      : [...savedBooks, bookId];

    setSavedBooks(nextBooks);
    return nextBooks;
  }

  return {
    getSavedBooks,
    setSavedBooks,
    isBookBookmarked,
    toggleBookmark,
  };
});
