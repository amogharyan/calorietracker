import { NextResponse } from 'next/server';
import connectDB from '@/lib/db.js';

export async function GET(request) {
  try {
    await connectDB();
    
    return NextResponse.json(
      { 
        message: 'Menu sync route is working',
        status: 'success',
        timestamp: new Date().toISOString(),
        menus: []
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Menu sync error:', error);
    return NextResponse.json(
      { 
        message: 'Menu sync failed',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('Menu sync triggered with data:', body);
    
    function stubMenus()
    {
        return [
            {id: 1, name: "sample menu item 1", calories: 100},
            {id: 2, name: "sample menu item 2", calories: 200}
        ]
    }

    return NextResponse.json(
      { 
        message: 'Menu sync triggered successfully',
        status: 'success',
        timestamp: new Date().toISOString(),
        menus: stubMenus()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Menu sync POST error:', error);
    return NextResponse.json(
      { 
        message: 'Menu sync failed',
        error: error.message 
      },
      { status: 500 }
    );
  }
}