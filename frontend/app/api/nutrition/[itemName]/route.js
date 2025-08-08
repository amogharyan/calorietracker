import { NextResponse } from 'next/server';
import connectDB from '@/lib/db.js';
import MenuItem from '@/models/MenuItem.js';
import fetch from 'node-fetch';

const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1/foods/search';

export async function GET(request) {
  const { itemName } = request.params;

  if (!itemName) {
    return NextResponse.json({ message: 'Missing item name' }, { status: 400 });
  }

  await connectDB();

  const cached = await MenuItem.findOne({ name: itemName.toLowerCase() });
  if (cached) {
    return NextResponse.json({ calories: cached.calories }, { status: 200 });
  }

  const apiKey = process.env.USDA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: 'USDA API key not configured' },
      { status: 500 }
    );
  }

  const url = `${USDA_API_BASE}?api_key=${apiKey}&query=${encodeURIComponent(itemName)}&pageSize=1`;
  const resp = await fetch(url);

  if (!resp.ok) {
    return NextResponse.json({ message: 'USDA API error' }, { status: 502 });
  }

  const data = await resp.json();
  const food = data.foods?.[0];

  if (!food) {
    return NextResponse.json({ message: 'No data found' }, { status: 404 });
  }

  const calories = food.foodNutrients.find(n => n.nutrientName === 'Energy')?.value;

  if (calories == null) {
    return NextResponse.json({ message: 'Calorie data unavailable' }, { status: 404 });
  }

  await MenuItem.create({ name: itemName.toLowerCase(), calories });
  
  return NextResponse.json({ calories }, { status: 200 });
}