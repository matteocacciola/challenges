export default {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  preset: 'ts-jest/presets/js-with-ts',
  collectCoverage: false,
  test: {
    globals: true,
  },
};