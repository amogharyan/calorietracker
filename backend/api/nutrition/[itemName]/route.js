import { NextResponse } from 'next/server';
import connectDB from '@/lib/db.js';
import logger from '@/lib/logger';

const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1/foods/search';
const mockCache = new Map();

export async function GET(request) 
{
  const { itemName } = request.params;
  if (!itemName) 
  {
    return NextResponse.json({ message: 'Missing item name' }, { status: 400 });
  }

  await connectDB();

  const apiKey = process.env.USDA_API_KEY;
  if (!apiKey || apiKey.trim() === '') 
  {
    logger.error('USDA API key not configured');
    return NextResponse.json({ message: 'USDA API key not configured' }, { status: 500 });
  }

  const cached = mockCache.get(itemName.toLowerCase());
  if (cached) 
  {
    logger.info('Nutrition data retrieved from cache', { itemName });
    return NextResponse.json({ calories: cached }, { status: 200 });
  }

  try 
  {
    const url = `${USDA_API_BASE}?api_key=${apiKey}&query=${encodeURIComponent(itemName)}&pageSize=1`;
    const resp = await fetch(url);
    if (!resp.ok) 
    {
      logger.warn('USDA API returned non-ok status', { status: resp.status, itemName });
      return NextResponse.json({ message: 'USDA API error' }, { status: 502 });
    }

    const data = await resp.json();
    const food = data.foods?.[0];
    if (!food) 
    {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }

    const calories = food.foodNutrients.find(n => n.nutrientName === 'Energy')?.value;
    if (calories == null) 
    {
      return NextResponse.json({ message: 'Calorie data unavailable' }, { status: 404 });
    }

    mockCache.set(itemName.toLowerCase(), calories);
    return NextResponse.json({ calories }, { status: 200 });

  } catch (error) 
  {
    logger.error('USDA API fetch error', { error: error.message, stack: error.stack });
    return NextResponse.json({ message: 'USDA API error' }, { status: 502 });
  }
}