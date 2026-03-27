import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
    emailVerified: boolean;
    role?: string;
    organisationId?: string;
  };
  session?: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract session from cookies or Authorization header
    const sessionToken = req.cookies?.['better-auth.session_token'] || 
                        req.headers.authorization?.replace('Bearer ', '');

    if (!sessionToken) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'No session token provided'
      });
      return;
    }

    // Validate session with Better Auth
    const session = await auth.api.getSession({
      headers: {
        cookie: req.headers.cookie || '',
        authorization: req.headers.authorization || ''
      }
    });

    if (!session?.user) {
      res.status(401).json({
        error: 'Invalid or expired session',
        message: 'Please sign in again'
      });
      return;
    }

    // Check if email is verified (optional - you might want to allow unverified users for some routes)
    if (!session.user.emailVerified) {
      res.status(403).json({
        error: 'Email verification required',
        message: 'Please verify your email before accessing this resource'
      });
      return;
    }

    // Attach user and session to request
    req.user = session.user;
    req.session = session.session;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid session'
    });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract session from cookies or Authorization header
    const sessionToken = req.cookies?.['better-auth.session_token'] || 
                        req.headers.authorization?.replace('Bearer ', '');

    if (sessionToken) {
      // Validate session with Better Auth
      const session = await auth.api.getSession({
        headers: {
          cookie: req.headers.cookie || '',
          authorization: req.headers.authorization || ''
        }
      });

      if (session?.user) {
        req.user = session.user;
        req.session = session.session;
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't return an error
    // Just continue without user context
    next();
  }
};
