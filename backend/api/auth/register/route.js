import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import rateLimit from 'express-rate-limit';
import User from '@/models/User';
import connectDB from '@/lib/db.js';
import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

const limiter = rateLimit(
{
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: 'Too many registration attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export async function POST(request) 
{
  try 
  {
    if (process.env.NODE_ENV !== 'test') 
    {
      await new Promise((resolve, reject) => 
      {
        limiter(request, {}, (result) => 
        {
          if (result) reject(result);
          else resolve();
        });
      });
    }

    await connectDB();
    const { email, password, name, preferences } = await request.json();
    const validationErrors = {};

    if (!name || !email || !password) 
    {
      validationErrors.general = 'Name, email, and password are required';
    }
    if (name && (name.trim().length < 2 || name.trim().length > 50)) 
    {
      validationErrors.name = 'Name must be between 2 and 50 characters';
    }
    if (name && !/^[a-zA-Z\s]+$/.test(name.trim())) 
    {
      validationErrors.name = 'Name can only contain letters and spaces';
    }
    if (email && !validator.isEmail(email)) 
    {
      validationErrors.email = 'Please provide a valid email address';
    }
    if (password) 
    {
      if (password.length < 8) 
      {
        validationErrors.password = 'Password must be at least 8 characters long';
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) 
      {
        validationErrors.password = 'Password must contain at least one uppercase letter, lowercase letter, number, and special character';
      }
    }
    if (Object.keys(validationErrors).length > 0) 
    {
      logger.warn('Registration validation failed', { email, errors: validationErrors });
      return NextResponse.json(
        { message: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) 
    {
      logger.warn('Registration attempt with existing email', { email });
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const userData = 
    {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      preferences: {}
    };
    if (preferences?.dailyCalorieGoal) 
    {
      userData.preferences.dailyCalorieGoal = preferences.dailyCalorieGoal;
    }
    if (preferences?.dietaryRestrictions) 
    {
      userData.preferences.dietaryRestrictions = preferences.dietaryRestrictions;
    }

    const newUser = await User.create(userData);
    const payload = 
    { 
      id: newUser._id, 
      email: newUser.email,
      name: newUser.name 
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    logger.info('User registered successfully', 
    { 
      userId: newUser._id, 
      email: newUser.email 
    });

    return NextResponse.json(
      { 
        message: 'User registered successfully', 
        token,
        user: 
        {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          profileCompletion: newUser.profileCompletion,
        }
      },
      { status: 201 }
    );

  } 
  catch (error) 
  {
    logger.error('Registration error', { error: error.message, stack: error.stack });
    if (error.name === 'ValidationError') 
    {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => 
      {
        validationErrors[key] = error.errors[key].message;
      });
      return NextResponse.json(
        { message: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    if (error.code === 11000)
    {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}