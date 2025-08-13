const mongoose = require('mongoose')
const { GET } = require('../../app/api/nutrition/[itemName]/route.js')

function createResponse() {
  const res = {}
  res.statusCode = 200
  res.status = code => { res.statusCode = code; return res }
  res.json = jest.fn(data => data)
  return res
}

describe('GET /nutrition/[itemName]', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  test('returns nutrition info for itemName', async () => {
    const req = { params: { itemName: 'apple' } }
    const res = createResponse()
    const data = await GET(req, res)
    expect(res.statusCode).toBe(200)
    expect(data).toHaveProperty('calories')
  })
})
