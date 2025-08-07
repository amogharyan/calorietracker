import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No token provided, authorization denied' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return NextResponse.json(
        {
          message: 'Access granted to protected route',
          user: decoded,
        },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(
        { message: 'Token is not valid' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}