import { Request, Response, NextFunction } from 'express';
import { requireAuth, AuthenticatedRequest } from './betterAuth';

export const requireRole = (allowedRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // First check if user is authenticated
      await new Promise<void>((resolve, reject) => {
        requireAuth(req, res, (error) => {
          if (error) return reject(error);
          resolve();
        });
      });

      // Check if user has required role
      const userRole = req.user?.role || 'user';
      
      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({
          error: 'Access denied',
          message: `Requires ${allowedRoles.join(' or ')} role. Current role: ${userRole}`
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Predefined role middleware
export const requireAdmin = requireRole(['admin']);
export const requireUser = requireRole(['admin', 'user']); // Both admin and user can access

// Role-based access control helper
export class RBAC {
  static canAccess(resource: string, action: string, userRole: string): boolean {
    const permissions = {
      admin: {
        // Admin can do everything
        dashboard: ['read', 'write', 'delete'],
        personnel: ['read', 'write', 'delete'],
        sites: ['read', 'write', 'delete'],
        shifts: ['read', 'write', 'delete'],
        reports: ['read', 'write', 'delete'],
        settings: ['read', 'write'],
        users: ['read', 'write', 'delete'],
      },
      user: {
        // User has limited access
        dashboard: ['read'],
        personnel: ['read'],
        sites: ['read'],
        shifts: ['read'],
        reports: ['read', 'write'], // Can create incident reports
        settings: ['read'],
        users: [], // Cannot manage other users
      }
    };

    return permissions[userRole]?.[resource]?.includes(action) || false;
  }

  static checkPermission(resource: string, action: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      const userRole = req.user?.role || 'user';
      
      if (!RBAC.canAccess(resource, action, userRole)) {
        res.status(403).json({
          error: 'Insufficient permissions',
          message: `Cannot ${action} ${resource} with role: ${userRole}`
        });
        return;
      }

      next();
    };
  }

  static getAllowedResources(userRole: string): Record<string, string[]> {
    const permissions = {
      admin: {
        dashboard: ['read', 'write', 'delete'],
        personnel: ['read', 'write', 'delete'],
        sites: ['read', 'write', 'delete'],
        shifts: ['read', 'write', 'delete'],
        reports: ['read', 'write', 'delete'],
        settings: ['read', 'write'],
        users: ['read', 'write', 'delete'],
      },
      user: {
        dashboard: ['read'],
        personnel: ['read'],
        sites: ['read'],
        shifts: ['read'],
        reports: ['read', 'write'],
        settings: ['read'],
        users: [],
      }
    };

    return permissions[userRole] || {};
  }
}
