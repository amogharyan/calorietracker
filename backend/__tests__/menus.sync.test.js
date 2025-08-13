const mongoose = require('mongoose')
const { GET } = require('../../app/api/menus/sync/route.js')

function createResponse() {
  const res = {}
  res.statusCode = 200
  res.status = code => { res.statusCode = code; return res }
  res.json = jest.fn(data => data)
  return res
}

describe('GET /menus/sync', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  test('returns stub menus array', async () => {
    const req = {}
    const res = createResponse()
    const data = await GET(req, res)
    expect(res.statusCode).toBe(200)
    expect(data).toHaveProperty('menus')
    expect(Array.isArray(data.menus)).toBe(true)
  })
})
