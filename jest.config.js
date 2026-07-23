module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js'],
  setupFilesAfterEnv: ['<rootDir>/js/__tests__/setup.js'],
  testPathIgnorePatterns: ['<rootDir>/js/__tests__/books-.*\\.test\\.js'],
  globals: {
    global: {},
  },
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/__tests__/**',
    '!js/**/node_modules/**',
  ],
};