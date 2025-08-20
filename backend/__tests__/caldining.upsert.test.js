import fs from 'fs';
import { parseCaldiningMenu } from './caldining.js';
import { upsertCaldiningMenuItems } from './upsertCaldiningMenuItems.js';
import mongoose from 'mongoose';

async function test()
{
  await mongoose.connect(process.env.MONGO_URI);

  const html = fs.readFileSync('./test/caldining_sample.html', 'utf8');
  const items = parseCaldiningMenu(html, 'https://caldining.example.com/menu');
  
  const summary = await upsertCaldiningMenuItems(items, '64f0d2c1abcdef1234567890');
  console.log(summary);

  await mongoose.disconnect();
}

test();