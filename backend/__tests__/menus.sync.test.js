const mongoose = require('mongoose');

jest.mock('../lib/db.js', () => (
{
  __esModule: true,
  default: jest.fn().mockResolvedValue(true)
}));

let GET, POST;

function createRequest(body = {}) 
{
  return global.createMockRequest(body);
}

describe('Menu Sync Routes', () => 
{
  beforeAll(async () => 
  {
    if (mongoose.connection.readyState === 0) 
    {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const menuModule = await import('../app/api/menus/sync/route.js');
    GET = menuModule.GET;
    POST = menuModule.POST;
  });

  describe('GET /api/menus/sync', () => 
  {
    test('returns success status', async () => 
    {
      const req = createRequest();
      const res = await GET(req);
      expect(res.statusCode).toBe(200);
      expect(res._data).toHaveProperty('status', 'success');
      expect(res._data).toHaveProperty('message', 'Menu sync route is working');
      expect(res._data).toHaveProperty('timestamp');
      expect(res._data).toHaveProperty('menus');
      expect(Array.isArray(res._data.menus)).toBe(true);
    });
  });

  describe('POST /api/menus/sync', () => 
  {
    test('triggers menu sync successfully', async () => 
    {
      const requestBody = { source: 'test' };
      const req = createRequest(requestBody);
      const res = await POST(req);
      expect(res.statusCode).toBe(200);
      expect(res._data).toHaveProperty('status', 'success');
      expect(res._data).toHaveProperty('message', 'Menu sync triggered successfully');
      expect(res._data).toHaveProperty('timestamp');
      expect(res._data).toHaveProperty('menus');
      expect(Array.isArray(res._data.menus)).toBe(true);
      expect(res._data.menus.length).toBeGreaterThan(0);
    });

    test('returns stub menu data', async () => 
    {
      const req = createRequest({});
      const res = await POST(req);
      expect(res.statusCode).toBe(200);
      expect(res._data.menus).toEqual([
        { id: 1, name: "sample menu item 1", calories: 100 },
        { id: 2, name: "sample menu item 2", calories: 200 }
      ]);
    });
  });
});