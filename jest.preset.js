const nxPreset = require('@nrwl/jest/preset');
const { projects, ...config } = require('./jest.config');

module.exports = {
  ...nxPreset,
  ...config,
};
