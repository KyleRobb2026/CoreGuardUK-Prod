import { Router, Response } from 'express';
import { config } from '../config/database';
import { catchAsync } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const organisationId = req.user?.organisation_id;

  // Get dashboard statistics
  const [
    personnelCount,
    sitesCount,
    activeShifts,
    todayCheckCalls,
    pendingIncidents,
  ] = await Promise.all([
    // Total personnel
    config.getClient()
      .from('personnel')
      .select('id', { count: 'exact' })
      .eq('organisation_id', organisationId)
      .eq('is_active', true),

    // Total sites
    config.getClient()
      .from('sites')
      .select('id', { count: 'exact' })
      .eq('organisation_id', organisationId)
      .eq('is_active', true),

    // Active shifts today
    config.getClient()
      .from('rota')
      .select('id', { count: 'exact' })
      .eq('organisation_id', organisationId)
      .eq('date', new Date().toISOString().split('T')[0])
      .in('status', ['scheduled', 'completed']),

    // Today's check calls
    config.getClient()
      .from('check_calls')
      .select('id', { count: 'exact' })
      .eq('organisation_id', organisationId)
      .gte('scheduled_time', new Date().toISOString().split('T')[0] + 'T00:00:00Z'),

    // Pending incidents
    config.getClient()
      .from('incident_reports')
      .select('id', { count: 'exact' })
      .eq('organisation_id', organisationId)
      .in('status', ['open', 'investigating']),
  ]);

  const stats = {
    personnel: personnelCount.count || 0,
    sites: sitesCount.count || 0,
    activeShifts: activeShifts.count || 0,
    todayCheckCalls: todayCheckCalls.count || 0,
    pendingIncidents: pendingIncidents.count || 0,
  };

  res.json({
    stats,
    lastUpdated: new Date().toISOString(),
  });
}));

// GET /api/dashboard/recent-activity
router.get('/recent-activity', catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const organisationId = req.user?.organisation_id;
  const limit = parseInt(req.query.limit as string) || 10;

  // Get recent check calls and incidents
  const [recentCheckCalls, recentIncidents] = await Promise.all([
    config.getClient()
      .from('check_calls')
      .select(`
        id,
        status,
        actual_time,
        personnel_id (first_name, last_name),
        site_id (name)
      `)
      .eq('organisation_id', organisationId)
      .order('created_at', { ascending: false })
      .limit(limit),

    config.getClient()
      .from('incident_reports')
      .select(`
        id,
        title,
        severity,
        reported_time,
        personnel_id (first_name, last_name),
        site_id (name)
      `)
      .eq('organisation_id', organisationId)
      .order('reported_time', { ascending: false })
      .limit(limit),
  ]);

  const activity = [
    ...recentCheckCalls.data.map((call: any) => ({
      id: call.id,
      type: 'check_call',
      title: `Check Call - ${call.site_id?.name || 'Unknown Site'}`,
      description: `By ${call.personnel_id?.first_name} ${call.personnel_id?.last_name || 'Unknown'}`,
      status: call.status,
      timestamp: call.actual_time || call.created_at,
    })),
    ...recentIncidents.data.map((incident: any) => ({
      id: incident.id,
      type: 'incident',
      title: incident.title,
      description: `Severity: ${incident.severity}`,
      status: incident.status,
      timestamp: incident.reported_time,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
   .slice(0, limit);

  res.json({
    activity,
    total: activity.length,
  });
}));

export default router;
