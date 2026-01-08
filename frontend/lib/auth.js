import { NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export const authenticate = async (request) => {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return { 
        authenticated: false, 
        error: 'No token provided' 
      };
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return { 
        authenticated: false, 
        error: 'Invalid or expired token' 
      };
    }

    return { 
      authenticated: true, 
      userId: decoded.userId 
    };
  } catch (error) {
    return { 
      authenticated: false, 
      error: 'Authentication failed' 
    };
  }
};

export const requireAuth = async (request) => {
  const auth = await authenticate(request);
  
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return auth;
};
