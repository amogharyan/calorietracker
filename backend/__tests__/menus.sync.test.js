const mongoose = require('mongoose')
const { GET, POST } = require('../../frontend/app/api/menus/sync/route.js')

// Mock NextResponse for testing
const NextResponse = {
  json: (data, options = {}) => ({ 
    _data: data, 
    statusCode: options.status || 200 
  })
}

// Mock request object
function createRequest(body = null) {
  return {
    json: async () => body || {},
    headers: new Map()
  }
}

describe('GET /api/menus/sync', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  test('returns successful sync status', async () => {
    const req = createRequest()
    
    const res = await GET(req)
    
    expect(res.statusCode).toBe(200)
    expect(res._data).toHaveProperty('message', 'Menu sync route is working')
    expect(res._data).toHaveProperty('status', 'success')
    expect(res._data).toHaveProperty('timestamp')
    expect(res._data).toHaveProperty('menus')
  })

  test('returns proper response structure', async () => {
    const req = createRequest()
    
    const res = await GET(req)
    
    const expectedKeys = ['message', 'status', 'timestamp', 'menus']
    expectedKeys.forEach(key => {
      expect(res._data).toHaveProperty(key)
    })
  })
})

describe('POST /api/menus/sync', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  test('triggers menu sync with data', async () => {
    const req = createRequest({ source: 'test' })
    
    const res = await POST(req)
    
    expect(res.statusCode).toBe(200)
    expect(res._data).toHaveProperty('message', 'Menu sync triggered successfully')
    expect(res._data).toHaveProperty('status', 'success')
    expect(res._data).toHaveProperty('menus')
  })

  test('returns stub menu data', async () => {
    const req = createRequest({})
    
    const res = await POST(req)
    
    expect(res._data.menus).toEqual([
      { id: 1, name: "sample menu item 1", calories: 100 },
      { id: 2, name: "sample menu item 2", calories: 200 }
    ])
  })
})