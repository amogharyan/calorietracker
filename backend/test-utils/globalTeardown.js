// Global teardown - runs once after all tests
const mongoose = require('mongoose');

module.exports = async () => {
  // Close any remaining mongoose connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('Closed remaining mongoose connections');
  }
  
  // Stop MongoDB Memory Server if it was used
  if (global.__MONGOD__) {
    console.log('Stopping MongoDB Memory Server...');
    await global.__MONGOD__.stop();
    console.log('MongoDB Memory Server stopped');
  }
  
  // Clear any remaining timers
  clearTimeout();
  clearInterval();
  
  console.log('Global test teardown completed');
};