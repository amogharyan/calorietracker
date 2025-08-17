// backend/test-utils/jest.setup.js
const mongoose = require('mongoose');

// Mock Next.js modules
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, options = {}) => ({
      _data: data,
      statusCode: options.status || 200,
      status: options.status || 200,
      json: async () => data
    })
  }
}));

// Mock logger
jest.mock('../lib/logger.js', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

// Global test timeout
jest.setTimeout(30000);

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Clean up after each test
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Final cleanup
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});