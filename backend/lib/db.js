import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV !== 'test') 
{
  throw new Error(
    `Please define the MONGODB_URI environment variable in .env.local or .env.test (current NODE_ENV=${process.env.NODE_ENV})`
  );
}

let cached = global.mongoose;
if (!cached) 
{
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(uri = MONGODB_URI) 
{
  if (cached.conn) 
  {
    return cached.conn;
  }

  if (!cached.promise) 
  {
    const opts = 
    {
      bufferCommands: false,
      maxPoolSize: process.env.NODE_ENV === 'production' ? 20 : 10,
      minPoolSize: process.env.NODE_ENV === 'production' ? 5 : undefined,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority',
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => 
    {
      console.log(`[MongoDB] Connected successfully to ${process.env.NODE_ENV === 'test' ? 'in-memory server' : 'MongoDB Atlas/Local'}`);
      mongooseInstance.connection.on('error', (error) => 
      {
        console.error('[MongoDB] Connection error:', error);
      });
      mongooseInstance.connection.on('disconnected', () => 
      {
        console.warn('[MongoDB] Disconnected');
      });

      if (process.env.NODE_ENV !== 'test') 
      {
        process.on('SIGINT', async () => 
        {
          await mongooseInstance.connection.close();
          console.log('[MongoDB] Connection closed due to app termination');
          process.exit(0);
        });
      }
      return mongooseInstance;
    });
  }

  try 
  {
    cached.conn = await cached.promise;
  } catch (e) 
  {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export async function disconnectDB() 
{
  if (cached.conn) 
  {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('[MongoDB] Connection closed');
  }
}

export function getConnectionState() 
{
  return mongoose.connection.readyState;
}

export default connectDB;