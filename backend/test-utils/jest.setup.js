const mongoose = require('mongoose');
process.env.NODE_ENV = 'test';

const mockNextResponse = 
{
  json: (data, options = {}) => (
  {
    _data: data,
    statusCode: options.status || 200,
    status: options.status || 200,
    json: async () => data
  })
};

jest.doMock('next/server', () => (
{
  NextResponse: mockNextResponse
}), { virtual: true });

jest.setTimeout(30000);

const originalConsole = { ...console };
global.console = 
{
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: originalConsole.error,
  info: jest.fn()
};

global.createMockRequest = (body = {}, options = {}) => 
{
  return {
    json: async () => body,
    headers: new Map(options.headers || []),
    params: options.params || {},
    ip: options.ip || '127.0.0.1',
    get: (header) => options.headers?.[header] || null,
    ...options
  };
};

afterEach(async () => 
{
  if (mongoose.connection.readyState !== 0) 
  {
    const collections = mongoose.connection.collections;
    for (const key in collections) 
    {
      try 
      {
        await collections[key].deleteMany({});
      } catch (error) 
      {
      }
    }
  }
  jest.clearAllMocks();
});

afterAll(async () => 
{
  if (mongoose.connection.readyState !== 0) 
  {
    try 
    {
      await mongoose.connection.close();
    } catch (error) 
    {
    }
  }
});