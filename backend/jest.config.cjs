// backend/jest.config.cjs
require('dotenv').config({ path: './backend/.env.test' });

module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  roots: ['<rootDir>/'],
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^../../../../../lib/db.js$': '<rootDir>/lib/db.js',
    '^@/lib/(.*)$': '<rootDir>/lib/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/test-utils/jest.setup.js'],
  globalSetup: '<rootDir>/test-utils/globalSetup.js',
  globalTeardown: '<rootDir>/test-utils/globalTeardown.js',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'json'],
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/node_modules/**',
    '!backend/__tests__/**',
    '!backend/test-utils/**',
    '!backend/babel.config.js',
    '!backend/jest.config.cjs'
  ],
  clearMocks: true,
  restoreMocks: true
};