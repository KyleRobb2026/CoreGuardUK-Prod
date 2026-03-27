import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/betterAuth';
import { requireAdmin, RBAC } from '../middleware/rbac';

const router = Router();

// GET /api/rbac/dashboard - Dashboard (all authenticated users)
router.get('/dashboard', requireAuth, RBAC.checkPermission('dashboard', 'read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const permissions = RBAC.getAllowedResources(user.role || 'user');
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organisationId: user.organisationId,
        },
        permissions,
        message: `Dashboard access granted for role: ${user.role}`
      }
    });
  } catch (error) {
    console.error('Dashboard RBAC error:', error);
    res.status(500).json({
      error: 'Failed to access dashboard',
      message: 'Internal server error'
    });
  }
});

// GET /api/rbac/personnel - Personnel list (admin only for full access)
router.get('/personnel', requireAuth, RBAC.checkPermission('personnel', 'read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    
    // Mock data based on role
    const personnel = user.role === 'admin' ? [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'officer' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'officer' },
    ] : [
      { id: '1', name: 'John Doe', role: 'officer' }, // Limited info for regular users
    ];
    
    res.json({
      success: true,
      data: {
        personnel,
        role: user.role,
        accessLevel: user.role === 'admin' ? 'full' : 'limited'
      }
    });
  } catch (error) {
    console.error('Personnel RBAC error:', error);
    res.status(500).json({
      error: 'Failed to access personnel',
      message: 'Internal server error'
    });
  }
});

// POST /api/rbac/personnel - Create personnel (admin only)
router.post('/personnel', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const personnelData = req.body;
    
    // Mock personnel creation
    const newPersonnel = {
      id: Date.now().toString(),
      ...personnelData,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: newPersonnel,
      message: 'Personnel created successfully'
    });
  } catch (error) {
    console.error('Create personnel RBAC error:', error);
    res.status(500).json({
      error: 'Failed to create personnel',
      message: 'Internal server error'
    });
  }
});

// GET /api/rbac/settings - Settings (admin only for write, users for read)
router.get('/settings', requireAuth, RBAC.checkPermission('settings', 'read'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    
    const settings = {
      organisation: {
        name: 'CoreGuard Security',
        timezone: 'UTC',
      },
      notifications: {
        email: true,
        sms: false,
      }
    };
    
    // Add write permissions info for admins
    if (user.role === 'admin') {
      res.json({
        success: true,
        data: {
          settings,
          permissions: 'read/write',
          role: user.role
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          settings,
          permissions: 'read only',
          role: user.role
        }
      });
    }
  } catch (error) {
    console.error('Settings RBAC error:', error);
    res.status(500).json({
      error: 'Failed to access settings',
      message: 'Internal server error'
    });
  }
});

// PUT /api/rbac/settings - Update settings (admin only)
router.put('/settings', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const updates = req.body;
    
    // Mock settings update
    const updatedSettings = {
      ...updates,
      updatedBy: user.id,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings RBAC error:', error);
    res.status(500).json({
      error: 'Failed to update settings',
      message: 'Internal server error'
    });
  }
});

// GET /api/rbac/permissions - Get current user's permissions
router.get('/permissions', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const permissions = RBAC.getAllowedResources(user.role || 'user');
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        permissions,
        canAccess: (resource: string, action: string) => RBAC.canAccess(resource, action, user.role || 'user')
      }
    });
  } catch (error) {
    console.error('Permissions RBAC error:', error);
    res.status(500).json({
      error: 'Failed to get permissions',
      message: 'Internal server error'
    });
  }
});

export default router;
