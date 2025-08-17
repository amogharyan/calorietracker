// backend/__tests__/auth.register.test.js
const mongoose = require('mongoose');

// Import modules
let User, POST;

// Create mock request
function createRequest(body) {
  return {
    json: async () => body,
    headers: new Map()
  };
}

describe('POST /api/auth/register', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    // Dynamic imports for ES modules
    const userModule = await import('../models/User.js');
    const registerModule = await import('../api/auth/register/route.js');
    
    User = userModule.default;
    POST = registerModule.POST;
  });

  test('registers user successfully', async () => {
    const user = {
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

  test('fails with missing required fields', async () => {
    const req = createRequest({
      email: 'incomplete@example.com'
      // missing password and name
    });
    
    const res = await POST(req);
    
    expect(res._data).toHaveProperty('errors');
    expect(res.statusCode).toBe(400);
  });

  test('fails with weak password', async () => {
    const req = createRequest({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'weak'
    });
    
    const res = await POST(req);
    
    expect(res._data).toHaveProperty('errors');
    expect(res.statusCode).toBe(400);
  });

  test('fails with invalid email', async () => {
    const req = createRequest({
      name: 'Test User',
      email: 'invalid-email',
      password: 'Password123!'
    });
    
    const res = await POST(req);
    
    expect(res._data).toHaveProperty('errors');
    expect(res.statusCode).toBe(400);
  });

  test('fails with existing user', async () => {
    // Create user first
    const userData = {
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'Password123!'
    };
    
    await POST(createRequest(userData));
    
    // Try to register with same email
    const req = createRequest(userData);
    const res = await POST(req);
    
    expect(res.statusCode).toBe(409);
    expect(res._data.message).toContain('already exists');
  });
});