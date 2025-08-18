import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const fileName = env === 'production' ? '.env.production' : env === 'test' ? '.env.test' : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), 'backend', fileName) });
