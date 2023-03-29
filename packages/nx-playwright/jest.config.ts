/* eslint-disable */
module.exports = {
  displayName: 'nx-playwright',
  preset: '../../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-playwright',
  coveragePathIgnorePatterns: ['src/generators/project'],
  testEnvironment: 'node',
};
