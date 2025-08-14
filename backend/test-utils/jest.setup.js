const mongoose = require('mongoose')

// Mock Next.js modules that aren't available in Jest
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
      statusCode: options?.status || 200
    })
  }
}))

// Mock logger if it doesn't exist
jest.mock('@/lib/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}), { virtual: true })

// Global test timeout
jest.setTimeout(30000)

// Clean up database after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  }
})