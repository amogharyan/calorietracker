const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../../models/User.js')
const { POST: registerPOST } = require('../../app/api/auth/register/route.js')
const { POST: loginPOST } = require('../../app/api/auth/login/route.js')

function createResponse() {
  const res = {}
  res.statusCode = 200
  res.status = code => { res.statusCode = code; return res }
  res.json = jest.fn(data => data)
  return res
}

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  test('registers new user', async () => {
    const req = { json: async () => ({ username: 'testuser', email: 'testuser@example.com', password: 'Testpass123!' }) }
    const res = createResponse()
    const data = await registerPOST(req, res)
    expect(res.statusCode).toBe(201)
    expect(data).toHaveProperty('user')
    expect(data.user).toHaveProperty('username', 'testuser')
  })

  test('logs in existing user', async () => {
    const hashed = await bcrypt.hash('Testpass123!', 10)
    await User.create({ username: 'loginuser', email: 'loginuser@example.com', password: hashed })

    const req = { json: async () => ({ email: 'loginuser@example.com', password: 'Testpass123!' }) }
    const res = createResponse()
    const data = await loginPOST(req, res)
    expect(res.statusCode).toBe(200)
    expect(data).toHaveProperty('token')
  })
})
