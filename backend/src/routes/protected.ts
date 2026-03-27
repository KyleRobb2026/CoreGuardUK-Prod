import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/betterAuth';

const router = Router();

// GET /api/protected/dashboard - Protected dashboard endpoint
router.get('/dashboard', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Access authenticated user data
    const user = req.user!;
    
    // Mock dashboard data (replace with real database queries)
    const dashboardData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified
      },
      stats: {
        activeOfficers: 12,
        totalSites: 8,
        liveShifts: 5,
        incidentsToday: 2,
        checkCallsActive: 15,
        missedCheckCalls: 1,
        expiredLicences: 0,
        expiringSoon: 3
      },
      recentActivity: [
        {
          id: '1',
          type: 'check_call',
          title: 'Check Call - Site A',
          description: 'By John Doe',
          status: 'completed',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'incident',
          title: 'Security Incident',
          description: 'Severity: medium',
          status: 'investigating',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      alerts: [
        {
          id: '1',
          severity: 'warning',
          message: 'Officer license expiring in 30 days'
        }
      ]
    };

    res.json({
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully'
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Failed to retrieve dashboard data',
      message: 'Internal server error'
    });
  }
});

// GET /api/protected/profile - Get user profile
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified
      },
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Failed to retrieve profile',
      message: 'Internal server error'
    });
  }
});

export default router;
