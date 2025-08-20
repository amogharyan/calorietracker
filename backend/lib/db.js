// lib/db.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) 
{
  throw new Error('mongodb_uri environment variable is required');
}

let cached = global.mongoose;

if (!cached) 
{
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * establishes mongodb connection with optimized configuration
 */
export async function connectDB() 
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
      maxPoolSize: process.env.NODE_ENV === 'production' ? 10 : 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority',
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => 
      {
        // setup connection event listeners
        mongoose.connection.on('error', (error) => 
        {
          console.error('[mongodb] connection error:', error);
        });

        mongoose.connection.on('disconnected', () => 
        {
          console.warn('[mongodb] disconnected');
        });

        // graceful shutdown handling
        if (process.env.NODE_ENV !== 'test') 
        {
          process.on('SIGINT', async () => 
          {
            await mongoose.connection.close();
            console.log('[mongodb] connection closed due to app termination');
            process.exit(0);
          });
        }

        console.log('[mongodb] connected successfully');
        return mongoose;
      })
      .catch((error) => 
      {
        console.error('[mongodb] connection failed:', error);
        cached.promise = null;
        throw error;
      });
  }

  try 
  {
    cached.conn = await cached.promise;
  } catch (error) 
  {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * closes database connection and clears cache
 */
export async function disconnectDB() 
{
  if (cached.conn) 
  {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('[mongodb] connection closed');
  }
}

export default connectDB;