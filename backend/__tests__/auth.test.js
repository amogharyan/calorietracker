// backend/__tests__/auth.test.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Mock logger before any imports
jest.mock('../lib/logger.js', () => ({
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

// Import modules
let User, registerPOST, loginPOST;

// Create mock request
function createRequest(body) {
  return {
    json: async () => body,
    headers: new Map()
  };
}

describe('Auth Endpoints Integration', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    // Dynamic imports
    const userModule = await import('../models/User.js');
    const registerModule = await import('../api/auth/register/route.js');
    const loginModule = await import('../api/auth/login/route.js');
    
    User = userModule.default;
    registerPOST = registerModule.POST;
    loginPOST = loginModule.POST;
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('full auth flow: register then login', async () => {
    // Register user
    const registerReq = createRequest({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Password123!'
    });
    
    const registerRes = await registerPOST(registerReq);
    
    expect(registerRes.statusCode).toBe(201);
    expect(registerRes._data).toHaveProperty('user');
    expect(registerRes._data).toHaveProperty('token');
    expect(registerRes._data.user).toHaveProperty('email', 'testuser@example.com');
    
    // Login with same credentials
    const loginReq = createRequest({
      email: 'testuser@example.com',
      password: 'Password123!'
    });
    
    const loginRes = await loginPOST(loginReq);
    
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes._data).toHaveProperty('token');
    expect(loginRes._data).toHaveProperty('user');
  });

  test('register with existing user fails', async () => {
    // First registration
    const req1 = createRequest({
      name: 'First User',
      email: 'duplicate@example.com',
      password: 'Password123!'
    });
    
    await registerPOST(req1);
    
    // Second registration with same email
    const req2 = createRequest({
      name: 'Second User',
      email: 'duplicate@example.com',
      password: 'Password123!'
    });
    
    const res2 = await registerPOST(req2);
    
    expect(res2.statusCode).toBe(409);
    expect(res2._data.message).toContain('already exists');
  });

  test('login with wrong credentials fails', async () => {
    // Create user first
    await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: await bcrypt.hash('Password123!', 10)
    });
    
    // Try login with wrong password
    const loginReq = createRequest({
      email: 'testuser@example.com',
      password: 'WrongPassword'
    });
    
    const loginRes = await loginPOST(loginReq);
    
    expect(loginRes.statusCode).toBe(401);
    expect(loginRes._data.message).toBe('Invalid email or password');
  });

  test('user password is properly hashed', async () => {
    const password = 'Password123!';
    
    // Register user
    const registerReq = createRequest({
      name: 'Hash Test',
      email: 'hashtest@example.com',
      password
    });
    
    await registerPOST(registerReq);
    
    // Check that password is hashed in database
    const user = await User.findOne({ email: 'hashtest@example.com' }).select('+password');
    expect(user.password).not.toBe(password);
    expect(user.password).toMatch(/^\$2[ab]\$/); // bcrypt hash pattern
    
    // Verify password comparison works
    const isMatch = await user.comparePassword(password);
    expect(isMatch).toBe(true);
  });

  test('user model validation works', async () => {
    const registerReq = createRequest({
      name: 'A', // Too short
      email: 'invalid-email',
      password: 'weak'
    });
    
    const registerRes = await registerPOST(registerReq);
    
    expect(registerRes.statusCode).toBe(400);
    expect(registerRes._data).toHaveProperty('errors');
  });
});