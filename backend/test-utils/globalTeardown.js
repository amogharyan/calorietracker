const globalTeardown = async () => 
{
  if (global.__MONGOD__) 
  {
    try 
    {
      await global.__MONGOD__.stop();
      console.log('MongoDB Memory Server stopped');
    } catch (error) 
    {
      console.error('Error stopping MongoDB Memory Server:', error);
    }
  }
  
  if (global.gc) 
  {
    global.gc();
  }
};

module.exports = globalTeardown;