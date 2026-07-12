module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js'],
  setupFilesAfterEnv: ['<rootDir>/js/__tests__/setup.js'],
  globals: {
    global: {},
  },
};