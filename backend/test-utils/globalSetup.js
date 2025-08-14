const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') }); // Load test environment variables

const globalSetup = async () => {
  let mongoUri;

  // Use the test URI from the environment file if it exists
  if (process.env.MONGODB_URI_TEST) {
    mongoUri = process.env.MONGODB_URI_TEST;
    console.log(`Using real MongoDB at: ${mongoUri}`);
  } else {
    // Fallback to in-memory server if the URI is not provided
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    global.__MONGOD__ = mongod;
    process.env.MONGO_URI = mongoUri;
    console.log(`Using in-memory MongoDB at: ${mongoUri}`);
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to test database.');
    global.__MONGO_URI__ = mongoUri;
  } catch (err) {
    console.error('Failed to connect to test database:', err);
    process.exit(1); // Exit if connection fails
  }
};

module.exports = globalSetup;