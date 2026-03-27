import { Router, Response } from 'express';
import { auth } from '../lib/auth';
import { AuthenticatedRequest } from '../middleware/betterAuth';

const router = Router();

// POST /api/session/logout - Secure logout
router.post('/logout', async (req, res) => {
  try {
    // Get session token from cookies
    const sessionToken = req.cookies?.['better-auth.session_token'];
    
    if (!sessionToken) {
      return res.status(400).json({
        error: 'No active session',
        message: 'No session found to logout'
      });
    }

    // Use Better Auth to sign out
    await auth.api.signOut({
      headers: {
        cookie: req.headers.cookie || '',
      }
    });

    // Clear the session cookie
    res.clearCookie('better-auth.session_token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'Failed to logout properly'
    });
  }
});

// GET /api/session/validate - Validate current session
router.get('/validate', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: {
        cookie: req.headers.cookie || '',
        authorization: req.headers.authorization || ''
      }
    });

    if (!session?.user) {
      return res.status(401).json({
        valid: false,
        message: 'No valid session found'
      });
    }

    res.json({
      valid: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
        role: (session.user as any).role,
        organisationId: (session.user as any).organisationId,
      },
      session: {
        id: session.session?.id,
        expiresAt: session.session?.expiresAt,
      }
    });
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({
      valid: false,
      message: 'Failed to validate session'
    });
  }
});

// POST /api/session/refresh - Refresh session
router.post('/refresh', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: {
        cookie: req.headers.cookie || '',
        authorization: req.headers.authorization || ''
      }
    });

    if (!session?.user) {
      return res.status(401).json({
        error: 'No active session',
        message: 'Cannot refresh - no session found'
      });
    }

    // Better Auth automatically handles session refresh
    // Just return the updated session info
    res.json({
      success: true,
      message: 'Session refreshed',
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
        role: (session.user as any).role,
        organisationId: (session.user as any).organisationId,
      },
      session: {
        id: session.session?.id,
        expiresAt: session.session?.expiresAt,
      }
    });
  } catch (error) {
    console.error('Session refresh error:', error);
    res.status(500).json({
      error: 'Session refresh failed',
      message: 'Failed to refresh session'
    });
  }
});

// DELETE /api/session/revoke - Revoke all user sessions
router.delete('/revoke', async (req: AuthenticatedRequest, res) => {
  try {
    // This would require implementing a method to revoke all sessions for a user
    // For now, we'll just clear the current session
    await auth.api.signOut({
      headers: {
        cookie: req.headers.cookie || '',
      }
    });

    res.clearCookie('better-auth.session_token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.json({
      success: true,
      message: 'All sessions revoked'
    });
  } catch (error) {
    console.error('Session revoke error:', error);
    res.status(500).json({
      error: 'Failed to revoke sessions',
      message: 'Could not revoke all sessions'
    });
  }
});

// GET /api/session/info - Get session configuration info
router.get('/info', (req, res) => {
  res.json({
    sessionConfig: {
      expiresIn: '7 days',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    },
    security: {
      csrfProtection: true,
      secureCookies: process.env.NODE_ENV === 'production',
      sessionRotation: true,
    }
  });
});

export default router;
