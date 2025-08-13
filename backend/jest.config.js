process.env.NODE_ENV = 'test'
require('dotenv').config({ path: '.env.test' })
module.exports = {
  testEnvironment: 'node',
  transform: { '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' },
  verbose: true
}