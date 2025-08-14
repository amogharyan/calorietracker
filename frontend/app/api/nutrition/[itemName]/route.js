import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';

const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1/foods/search';

// Simple in-memory cache for testing
const mockCache = new Map();

export async function GET(request) {
  const { itemName } = request.params;

  if (!itemName) {
    return NextResponse.json({ message: 'Missing item name' }, { status: 400 });
  }

  await connectDB();

  // Check mock cache first
  const cached = mockCache.get(itemName.toLowerCase());
  if (cached) {
    return NextResponse.json({ calories: cached }, { status: 200 });
  }

  const apiKey = process.env.USDA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: 'USDA API key not configured' },
      { status: 500 }
    );
  }

  try {
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

    // Cache the result
    mockCache.set(itemName.toLowerCase(), calories);
    
    return NextResponse.json({ calories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'USDA API error' }, { status: 502 });
  }
}