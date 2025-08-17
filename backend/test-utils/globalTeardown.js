// backend/test-utils/globalTeardown.js
const globalTeardown = async () => {
  // Stop MongoDB Memory Server
  if (global.__MONGOD__) {
    try {
      await global.__MONGOD__.stop();
      console.log('MongoDB Memory Server stopped');
    } catch (error) {
      console.error('Error stopping MongoDB Memory Server:', error);
    }
  }
  
  // Clean up any remaining timers
  if (global.gc) {
    global.gc();
  }
};

module.exports = globalTeardown;