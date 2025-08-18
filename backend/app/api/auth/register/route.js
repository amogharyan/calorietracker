import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { NextResponse } from 'next/server';

//handles user registration with validation and jwt token generation
export async function POST(request) 
{
  try 
  {
    await connectDB();
    const { email, password, name, preferences } = await request.json();
    // input validation
    const validationErrors = {};
    if (!name || !email || !password) 
    {
      validationErrors.general = 'name, email, and password are required';
    }
    if (name && (name.trim().length < 2 || name.trim().length > 50)) 
    {
      validationErrors.name = 'name must be between 2 and 50 characters';
    }
    if (name && !/^[a-zA-Z\s]+$/.test(name.trim())) 
    {
      validationErrors.name = 'name can only contain letters and spaces';
    }
    if (email && !validator.isEmail(email)) 
    {
      validationErrors.email = 'invalid email format';
    }
    if (password) 
    {
      if (password.length < 8) 
      {
        validationErrors.password = 'password must be at least 8 characters';
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) 
      {
        validationErrors.password = 'password must contain uppercase, lowercase, number, and special character';
      }
    }
    if (Object.keys(validationErrors).length > 0) 
    {
      return NextResponse.json(
        { message: 'validation failed', errors: validationErrors },
        { status: 400 }
      );
    }
    // check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) 
    {
      return NextResponse.json(
        { message: 'account with this email already exists' },
        { status: 409 }
      );
    }
    // prepare user data
    const userData = 
    {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      preferences: 
      {
        dailyCalorieGoal: preferences?.dailyCalorieGoal || 2000,
        dietaryRestrictions: preferences?.dietaryRestrictions || [],
      }
    };
    // create new user
    const newUser = await User.create(userData);
    // generate jwt token
    const payload = 
    { 
      id: newUser._id, 
      email: newUser.email,
      name: newUser.name 
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json(
      { 
        message: 'user registered successfully', 
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
  } catch (error) 
  {
    console.error('registration error:', error);
    
    if (error.name === 'ValidationError') 
    {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => 
      {
        validationErrors[key] = error.errors[key].message;
      });
      return NextResponse.json(
        { message: 'validation failed', errors: validationErrors },
        { status: 400 }
      );
    }
    if (error.code === 11000) 
    {
      return NextResponse.json(
        { message: 'account with this email already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: 'internal server error' },
      { status: 500 }
    );
  }
}