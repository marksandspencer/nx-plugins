/* eslint-disable */
export default {
  displayName: 'nx-playwright',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/nx-playwright',
  coveragePathIgnorePatterns: ['src/generators/project'],
  testEnvironment: 'node',
};
