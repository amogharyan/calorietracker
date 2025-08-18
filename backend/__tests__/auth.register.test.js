const mongoose = require('mongoose');
let User, POST;

function createRequest(body) 
{
  return global.createMockRequest(body);
}

describe('POST /api/auth/register', () => 
{
  beforeAll(async () => 
  {
    if (mongoose.connection.readyState === 0) 
    {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const userModule = await import('../models/User.js');
    const registerModule = await import('../api/auth/register/route.js');
    User = userModule.default;
    POST = registerModule.POST;
  });

  beforeEach(async () => 
  {
    await User.deleteMany({});
  });

  afterEach(async () => 
  {
    await User.deleteMany({});
  });

  test('registers user successfully', async () => 
  {
    const user = 
    {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Password123!'
    };
    const req = createRequest(user);
    const res = await POST(req);
    expect(res.statusCode).toBe(201);
    expect(res._data).toHaveProperty('user');
    expect(res._data).toHaveProperty('token');
    expect(res._data.user).toHaveProperty('email', user.email);
    expect(res._data.user).toHaveProperty('name', user.name);
  });

  test('fails with missing required fields', async () => 
  {
    const req = createRequest(
    {
      email: 'incomplete@example.com'
    });
    const res = await POST(req);
    expect(res._data).toHaveProperty('errors');
    expect(res.statusCode).toBe(400);
  });

  test('fails with weak password', async () => 
  {
    const req = createRequest(
    {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'weak'
    });
    const res = await POST(req);
    expect(res._data).toHaveProperty('errors');
    expect(res.statusCode).toBe(400);
  });

  test('fails with invalid email', async () => 
  {
    const req = createRequest(
    {
      name: 'Test User',
      email: 'invalid-email',
      password: 'Password123!'
    });
    const res = await POST(req);
    expect(res._data).toHaveProperty('errors');
    expect(res.statusCode).toBe(400);
  });

  test('fails with existing user', async () => 
  {
    const userData = 
    {
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'Password123!'
    };
    await POST(createRequest(userData));
    const req = createRequest(userData);
    const res = await POST(req);
    expect(res.statusCode).toBe(409);
    expect(res._data.message).toContain('already exists');
  });
});