import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '@/models/User';
import connectDB from '@/lib/db.js';
import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function POST(request) 
{
  try 
  {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) 
    {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!validator.isEmail(email)) 
    {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const user = await User.findOne(
    { 
      email: email.toLowerCase().trim(),
      isActive: true 
    }).select('+password');

    if (!user) 
    {
      logger.warn('Login attempt with non-existent email', { email });
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) 
    {
      logger.warn('Login attempt with incorrect password', 
      { 
        email, 
        userId: user._id 
      });
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await user.updateLastLogin();
    const payload = 
    { 
      id: user._id, 
      email: user.email,
      name: user.name 
    };

    let token;
    try 
    {
      token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    } 
    catch (jwtError) 
    {
      logger.error('JWT signing error', { error: jwtError.message, stack: jwtError.stack });
      return NextResponse.json(
        { message: 'Authentication failed. Please try again later.' },
        { status: 500 }
      );
    }

    logger.info('User logged in successfully', 
    { 
      userId: user._id, 
      email: user.email 
    });

    return NextResponse.json(
      {
        message: 'Logged in successfully',
        token,
        user: 
        {
          id: user._id,
          email: user.email,
          name: user.name,
          profileCompletion: user.profileCompletion,
          lastLogin: user.lastLogin,
          preferences: user.preferences,
          mealPlan: user.mealPlan,
        },
      },
      { status: 200 }
    );

  } catch (error) 
  {
    logger.error('Login error', { error: error.message, stack: error.stack });
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}