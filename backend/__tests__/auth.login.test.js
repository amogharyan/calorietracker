const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../../models/User.js')
const { POST } = require('../../app/api/auth/login/route.js')

function createResponse() {
  const res = {}
  res.statusCode = 200
  res.status = code => { res.statusCode = code; return res }
  res.json = jest.fn(data => data)
  return res
}

describe('POST /auth/login', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    const hashed = await bcrypt.hash('Testpass123!', 10)
    await User.create({ username: 'loginuser', email: 'loginuser@example.com', password: hashed })
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  test('logs in with correct credentials', async () => {
    const req = { json: async () => ({ email: 'loginuser@example.com', password: 'Testpass123!' }) }
    const res = createResponse()
    const data = await POST(req, res)
    expect(res.statusCode).toBe(200)
    expect(data).toHaveProperty('token')
  })

  test('fails with wrong password', async () => {
    const req = { json: async () => ({ email: 'loginuser@example.com', password: 'WrongPass' }) }
    const res = createResponse()
    const data = await POST(req, res)
    expect(res.statusCode).toBe(401)
    expect(data).toHaveProperty('error')
  })
})
