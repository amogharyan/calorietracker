// backend/test-utils/jest.setup.js
const mongoose = require('mongoose');

// Mock Next.js NextResponse to work like a regular response object
const mockNextResponse = {
  json: (data, options = {}) => ({
    _data: data,
    statusCode: options.status || 200,
    status: options.status || 200,
    json: async () => data
  })
};

// Create a virtual module for next/server
jest.doMock('next/server', () => ({
  NextResponse: mockNextResponse
}), { virtual: true });

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
      try {
        await collections[key].deleteMany({});
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }
});

// Final cleanup
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close();
    } catch (error) {
      // Ignore cleanup errors
    }
  }
});