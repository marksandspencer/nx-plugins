const { getJestProjects } = require('@nx/jest');

module.exports = {
  projects: [...getJestProjects()],
  coverageReporters: ['html', 'text', 'json-summary'],
  reporters: ['default', 'jest-junit'],
  collectCoverageFrom: ['src/**/*.{tsx,ts}', '!**/*.d.ts'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
