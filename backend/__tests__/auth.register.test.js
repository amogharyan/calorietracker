const mongoose = require('mongoose')
const { POST } = require('../../app/api/auth/register/route.js')

function createResponse() {
  const res = {}
  res.statusCode = 200
  res.status = code => { res.statusCode = code; return res }
  res.json = jest.fn(data => data)
  return res
}

describe('POST /auth/register', () => {
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
    const data = await POST(req, res)
    expect(res.statusCode).toBe(201)
    expect(data).toHaveProperty('user')
    expect(data.user).toHaveProperty('username', 'testuser')
  })

  test('fails on missing data', async () => {
    const req = { json: async () => ({ username: 'baduser' }) }
    const res = createResponse()
    const data = await POST(req, res)
    expect(res.statusCode).toBe(400)
    expect(data).toHaveProperty('error')
  })
})