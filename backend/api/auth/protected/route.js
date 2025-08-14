import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info('User logged out', { userId: decoded.id });
      } catch (jwtError) {
        logger.warn('Logout with invalid token', { error: jwtError.message });
      }
    }
    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

  } catch (error) {
    logger.error('Logout error', { error: error.message });
    return NextResponse.json(
      { message: 'Logout completed' },
      { status: 200 }
    );
  }
}