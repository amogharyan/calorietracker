const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User.js') // Corrected path
const { POST } = require('../../frontend/app/api/auth/login/route.js')

// Mock NextResponse for testing
const NextResponse = {
  json: (data, options = {}) => ({ 
    _data: data, 
    statusCode: options.status || 200 
  })
}

// Mock request object
function createRequest(body) {
  return {
    json: async () => body,
    headers: new Map()
  }
}

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterEach(async () => {
    await User.deleteMany({})
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  test('logs in user successfully', async () => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Password123!'
    }

    // Register the user first
    const hashedPassword = await bcrypt.hash(user.password, 10)
    await User.create({ ...user, password: hashedPassword })

    const req = createRequest({
      email: user.email,
      password: user.password
    })
    
    const res = await POST(req)
    
    // The response should contain user data and token
    expect(res._data).toHaveProperty('user')
    expect(res._data).toHaveProperty('token')
    expect(res._data.user).toHaveProperty('email', user.email)
    expect(res._data.user).toHaveProperty('name', user.name)
    expect(res.statusCode).toBe(200)
  })

  test('fails with missing required fields', async () => {
    const req = createRequest({
      email: 'incomplete@example.com'
      // missing password
    })
    
    const res = await POST(req)
    
    expect(res._data).toHaveProperty('errors')
    expect(res.statusCode).toBe(400)
  })

  test('fails with incorrect password', async () => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Password123!'
    }

    // Register the user first
    const hashedPassword = await bcrypt.hash(user.password, 10)
    await User.create({ ...user, password: hashedPassword })

    const req = createRequest({
      email: user.email,
      password: 'WrongPassword!'
    })
    
    const res = await POST(req)
    
    expect(res._data).toHaveProperty('errors')
    expect(res.statusCode).toBe(400)
  })

  test('fails when user does not exist', async () => {
    const req = createRequest({
      email: 'nonexistent@example.com',
      password: 'Password123!'
    })
    
    const res = await POST(req)
    
    expect(res._data).toHaveProperty('errors')
    expect(res.statusCode).toBe(400)
  })
})