const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });

const globalSetup = async () => 
{
  let mongoUri;
  try 
  {
    const mongod = await MongoMemoryServer.create(
      {
      instance: 
      {
        dbName: 'calorietracker_test',
      },
    });
    mongoUri = mongod.getUri();
    global.__MONGOD__ = mongod;
    process.env.MONGODB_URI = mongoUri;
    console.log(`Test MongoDB server started at: ${mongoUri}`);
  } catch (error) 
  {
    console.error('Failed to start MongoDB Memory Server:', error);
    process.exit(1);
  }
};

module.exports = globalSetup;