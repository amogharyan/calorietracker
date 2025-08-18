const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let User, POST;

function createRequest(body) {
  return global.createMockRequest(body);
}

describe('POST /api/auth/login', () => {
  beforeAll(async () => 
  {
    if (mongoose.connection.readyState === 0)
    {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const userModule = await import('../models/User.js');
    const loginModule = await import('../api/auth/login/route.js');
    User = userModule.default;
    POST = loginModule.POST;
  });

  beforeEach(async () => 
  {
    await User.deleteMany({});
    const hashed = await bcrypt.hash('Testpass123!', 10);
    await User.create(
    { 
      name: 'Login User',
      email: 'loginuser@example.com', 
      password: hashed 
    });
  });

  afterEach(async () =>
  {
    await User.deleteMany({});
  });

  test('logs in with correct credentials', async () => 
  {
    const req = createRequest(
    {
      email: 'loginuser@example.com',
      password: 'Testpass123!'
    });
    const res = await POST(req);
    expect(res.statusCode).toBe(200);
    expect(res._data).toHaveProperty('token');
    expect(res._data).toHaveProperty('user');
    expect(res._data.user).toHaveProperty('email', 'loginuser@example.com');
  });

  test('fails with wrong password', async () => 
  {
    const req = createRequest(
    {
      email: 'loginuser@example.com',
      password: 'wrongpassword'
    });
    const res = await POST(req);
    expect(res.statusCode).toBe(401);
    expect(res._data).toHaveProperty('message');
    expect(res._data.message).toBe('Invalid email or password');
  });

  test('fails with non-existent user', async () =>
  {
    const req = createRequest(
    {
      email: 'nonexistent@example.com',
      password: 'Testpass123!'
    });
    const res = await POST(req);
    expect(res.statusCode).toBe(401);
    expect(res._data).toHaveProperty('message');
    expect(res._data.message).toBe('Invalid email or password');
  });

  test('fails with missing credentials', async () => 
  {
    const req = createRequest(
    {
      email: 'loginuser@example.com'
    });
    const res = await POST(req);
    expect(res.statusCode).toBe(400);
    expect(res._data).toHaveProperty('message');
    expect(res._data.message).toBe('Email and password are required');
  });

  test('fails with invalid email format', async () => 
  {
    const req = createRequest(
    {
      email: 'invalid-email',
      password: 'Testpass123!'
    });
    const res = await POST(req);
    expect(res.statusCode).toBe(400);
    expect(res._data).toHaveProperty('message');
    expect(res._data.message).toBe('Please provide a valid email address');
  });
});