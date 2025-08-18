const NextResponse = 
{
  json: (data, options = {}) => (
  {
    _data: data,
    statusCode: options.status || 200,
    status: options.status || 200,
    json: async () => data
  })
};

module.exports = { NextResponse };