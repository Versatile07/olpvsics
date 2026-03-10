/**
 * Jest configuration for backend tests.
 * ESM support via experimental-vm-modules flag.
 */
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: [],
  testMatch: ['**/test/**/*.test.js'],
  testTimeout: 15000,
};
