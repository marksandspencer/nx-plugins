const nxPreset = require('@nx/jest/preset').default;
const { projects, ...config } = require('./jest.config');

module.exports = {
  ...nxPreset,
  ...config,
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
};
