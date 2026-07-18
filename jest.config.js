module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js'],
  setupFilesAfterEnv: ['<rootDir>/js/__tests__/setup.js'],
  globals: {
    global: {},
  },
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/__tests__/**',
    '!js/**/node_modules/**',
  ],
  outputFile: 'test-results.json',
};