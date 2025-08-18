const mongoose = require('mongoose');

jest.mock('../lib/db.js', () => (
{
  __esModule: true,
  default: jest.fn().mockResolvedValue(true)
}));

jest.mock('../lib/logger.js', () => (
{
  __esModule: true,
  default: 
  {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

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

let GET;
global.fetch = jest.fn();

function createRequest(itemName) 
{
  return global.createMockRequest({}, { params: { itemName } });
}

describe('GET /api/nutrition/[itemName]', () => 
{
  beforeAll(async () => 
  {
    if (mongoose.connection.readyState === 0) 
    {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const nutritionModule = await import('../api/nutrition/[itemName]/route.js');
    GET = nutritionModule.GET;
  });

  beforeEach(() => 
  {
    fetch.mockClear();
    const nutritionModule = require('../api/nutrition/[itemName]/route.js');
    if (nutritionModule.mockCache) 
    {
      nutritionModule.mockCache.clear();
    }
  });

  test('returns nutrition info for valid item', async () => 
  {
    fetch.mockResolvedValueOnce(
    {
      ok: true,
      json: () => Promise.resolve(
      {
        foods: [
        {
          foodNutrients: 
          [
            { nutrientName: 'Energy', value: 95 }
          ]
        }]
      })
    });
    const req = createRequest('apple');
    const res = await GET(req);
    expect(res.statusCode).toBe(200);
    expect(res._data).toHaveProperty('calories', 95);
  });

  test('returns error for missing item name', async () => 
  {
    const req = { params: {} };
    const res = await GET(req);
    expect(res.statusCode).toBe(400);
    expect(res._data.message).toBe('Missing item name');
  });

  test('handles USDA API error', async () => 
  {
    fetch.mockResolvedValueOnce(
    {
      ok: false,
      status: 500
    });
    const req = createRequest('invaliditem');
    const res = await GET(req);
    expect(res.statusCode).toBe(502);
    expect(res._data.message).toBe('USDA API error');
  });

  test('handles no food data found', async () => 
  {
    fetch.mockResolvedValueOnce(
    {
      ok: true,
      json: () => Promise.resolve({ foods: [] })
    });
    const req = createRequest('nonexistentfood');
    const res = await GET(req);
    expect(res.statusCode).toBe(404);
    expect(res._data.message).toBe('No data found');
  });

  test('handles missing calorie data', async () => 
  {
    fetch.mockResolvedValueOnce(
    {
      ok: true,
      json: () => Promise.resolve(
      {
        foods: [
        {
          foodNutrients: 
          [
            { nutrientName: 'Protein', value: 1.2 }
          ]
        }]
      })
    });
    const req = createRequest('proteinbar');
    const res = await GET(req);
    expect(res.statusCode).toBe(404);
    expect(res._data.message).toBe('Calorie data unavailable');
  });

  test('handles missing USDA API key', async () => 
  {
    const originalKey = process.env.USDA_API_KEY;
    delete process.env.USDA_API_KEY;
    const req = createRequest('apple');
    const res = await GET(req);
    expect(res.statusCode).toBe(500);
    expect(res._data.message).toBe('USDA API key not configured');
    process.env.USDA_API_KEY = originalKey;
  });
});