// backend/__tests__/nutrition.itemName.test.js
const mongoose = require('mongoose');

// Mock the database connection and logger before any imports
jest.mock('../lib/db.js', () => ({
  default: jest.fn().mockResolvedValue(true)
}));

jest.mock('../lib/logger.js', () => ({
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

// Import the route handler
let GET;

// Mock fetch for USDA API calls
global.fetch = jest.fn();

// Create mock request
function createRequest(itemName) {
  return {
    params: { itemName },
    headers: new Map()
  };
}

describe('GET /api/nutrition/[itemName]', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    // Dynamic import for ES modules
    const nutritionModule = await import('../api/nutrition/[itemName]/route.js');
    GET = nutritionModule.GET;
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  test('returns nutrition info for valid item', async () => {
    // Mock USDA API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        foods: [{
          foodNutrients: [
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

  test('returns error for missing item name', async () => {
    const req = { params: {} };
    const res = await GET(req);

    expect(res.statusCode).toBe(400);
    expect(res._data.message).toBe('Missing item name');
  });

  test('handles USDA API error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    const req = createRequest('invaliditem');
    const res = await GET(req);

    expect(res.statusCode).toBe(502);
    expect(res._data.message).toBe('USDA API error');
  });

  test('handles no food data found', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ foods: [] })
    });

    const req = createRequest('nonexistentfood');
    const res = await GET(req);

    expect(res.statusCode).toBe(404);
    expect(res._data.message).toBe('No data found');
  });

  test('handles missing calorie data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        foods: [{
          foodNutrients: [
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

  test('handles missing USDA API key', async () => {
    const originalKey = process.env.USDA_API_KEY;
    delete process.env.USDA_API_KEY;

    const req = createRequest('apple');
    const res = await GET(req);

    expect(res.statusCode).toBe(500);
    expect(res._data.message).toBe('USDA API key not configured');

    // Restore the key
    process.env.USDA_API_KEY = originalKey;
  });
});