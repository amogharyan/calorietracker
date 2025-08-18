import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

//validates jwt token from authorization header
export function validateToken(request) 
{
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) 
  {
    return { 
      valid: false, 
      error: 'no token provided' 
    };
  }
  const token = authHeader.split(' ')[1];
  try 
  {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { 
      valid: true, 
      user: decoded 
    };
  } catch (error) 
  {
    return { 
      valid: false, 
      error: 'invalid or expired token' 
    };
  }
}
// middleware wrapper for protected routes
export function withAuth(handler) 
{
  return async (request, context) => 
  {
    const tokenValidation = validateToken(request);
    if (!tokenValidation.valid) 
    {
      return NextResponse.json(
        { message: tokenValidation.error },
        { status: 401 }
      );
    }
    // attach user info to request for use in handler
    request.user = tokenValidation.user;
    return handler(request, context);
  };
}