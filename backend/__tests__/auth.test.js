const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let User, registerPOST, loginPOST;

function createRequest(body)
{
  return global.createMockRequest(body);
}

describe('Auth Endpoints Integration', () => 
{
  beforeAll(async () => 
  {
    if (mongoose.connection.readyState === 0) 
    {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const userModule = await import('../models/User.js');
    const registerModule = await import('../api/auth/register/route.js');
    const loginModule = await import('../api/auth/login/route.js');
    User = userModule.default;
    registerPOST = registerModule.POST;
    loginPOST = loginModule.POST;
  });

  beforeEach(async () => 
  {
    await User.deleteMany({});
  });

  afterEach(async () => 
  {
    await User.deleteMany({});
  });

  test('full auth flow: register then login', async () => 
  {
    const registerReq = createRequest(
    {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Password123!'
    });
    const registerRes = await registerPOST(registerReq);
    expect(registerRes.statusCode).toBe(201);
    expect(registerRes._data).toHaveProperty('user');
    expect(registerRes._data).toHaveProperty('token');
    expect(registerRes._data.user).toHaveProperty('email', 'testuser@example.com');
    const loginReq = createRequest(
    {
      email: 'testuser@example.com',
      password: 'Password123!'
    });
    const loginRes = await loginPOST(loginReq);
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes._data).toHaveProperty('token');
    expect(loginRes._data).toHaveProperty('user');
  });

  test('register with existing user fails', async () => 
  {
    const req1 = createRequest(
    {
      name: 'First User',
      email: 'duplicate@example.com',
      password: 'Password123!'
    });
    await registerPOST(req1);
    const req2 = createRequest(
    {
      name: 'Second User',
      email: 'duplicate@example.com',
      password: 'Password123!'
    });
    const res2 = await registerPOST(req2);
    expect(res2.statusCode).toBe(409);
    expect(res2._data.message).toContain('already exists');
  });

  test('login with wrong credentials fails', async () => 
  {
    await User.create(
    {
      name: 'Test User',
      email: 'testuser@example.com',
      password: await bcrypt.hash('Password123!', 10)
    });
    const loginReq = createRequest(
    {
      email: 'testuser@example.com',
      password: 'WrongPassword'
    });
    const loginRes = await loginPOST(loginReq);
    expect(loginRes.statusCode).toBe(401);
    expect(loginRes._data.message).toBe('Invalid email or password');
  });

  test('user password is properly hashed', async () => 
  {
    const password = 'Password123!';
    const registerReq = createRequest(
    {
      name: 'Hash Test',
      email: 'hashtest@example.com',
      password
    });
    await registerPOST(registerReq);
    const user = await User.findOne({ email: 'hashtest@example.com' }).select('+password');
    expect(user.password).not.toBe(password);
    expect(user.password).toMatch(/^\$2[ab]\$/);
    const isMatch = await user.comparePassword(password);
    expect(isMatch).toBe(true);
  });

  test('user model validation works', async () => 
  {
    const registerReq = createRequest(
    {
      name: 'A',
      email: 'invalid-email',
      password: 'weak'
    });
    const registerRes = await registerPOST(registerReq);
    expect(registerRes.statusCode).toBe(400);
    expect(registerRes._data).toHaveProperty('errors');
  });
});