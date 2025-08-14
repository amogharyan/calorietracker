// backend/jest.config.js
require('dotenv').config({ path: 'backend/.env.test' });

module.exports =
{
  testEnvironment: 'node',
  testTimeout: 15000,
  roots: ['<rootDir>'],
  moduleNameMapper: {'^@/(.*)$': '<rootDir>/$1',},
  setupFilesAfterEnv: ['<rootDir>/test-utils/setup.js'],
  globalSetup: '<rootDir>/test-utils/globalSetup.js',
  globalTeardown: '<rootDir>/test-utils/globalTeardown.js',
};