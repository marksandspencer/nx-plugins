const nxPreset = require('@nrwl/jest/preset').default;
const { projects, ...config } = require('./jest.config');

module.exports = {
  ...nxPreset,
  ...config,
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
};
