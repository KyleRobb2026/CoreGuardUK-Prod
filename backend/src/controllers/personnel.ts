import { Router, Response } from 'express';
import { config } from '../config/database';
import { catchAsync } from '../middleware/errorHandler';
import { validateRequest, schemas } from '../middleware/validation';
import { AuthenticatedRequest } from '../middleware/auth';
import { hashPassword } from '../services/authService';

const router = Router();

// GET /api/personnel
router.get('/', catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const organisationId = req.user?.organisation_id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string || '';

  let query = config.getClient()
    .from('personnel')
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      officer_code,
      sire_number,
      license_number,
      license_expiry,
      is_active,
      created_at,
      updated_at
    `)
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw error;
  }

  res.json({
    personnel: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      pages: Math.ceil((count || 0) / limit),
    },
  });
}));

// POST /api/personnel
router.post('/', validateRequest(schemas.createPersonnel), catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const organisationId = req.user?.organisation_id;
  const personnelData = { ...req.validatedBody, organisation_id };

  // Hash PIN if provided
  if (personnelData.pin) {
    personnelData.pin_hash = await hashPassword(personnelData.pin);
    delete personnelData.pin;
  }

  const { data, error } = await config.getClient()
    .from('personnel')
    .insert(personnelData)
    .select()
    .single();

  if (error || !data) {
    throw error;
  }

  res.status(201).json({
    message: 'Personnel created successfully',
    personnel: data,
  });
}));

// PUT /api/personnel/:id
router.put('/:id', catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const organisationId = req.user?.organisation_id;
  const updateData = { ...req.body, updated_at: new Date().toISOString() };

  // Hash PIN if being updated
  if (updateData.pin) {
    updateData.pin_hash = await hashPassword(updateData.pin);
    delete updateData.pin;
  }

  const { data, error } = await config.getClient()
    .from('personnel')
    .update(updateData)
    .eq('id', id)
    .eq('organisation_id', organisationId)
    .select()
    .single();

  if (error || !data) {
    throw error;
  }

  res.json({
    message: 'Personnel updated successfully',
    personnel: data,
  });
}));

// DELETE /api/personnel/:id
router.delete('/:id', catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const organisationId = req.user?.organisation_id;

  const { error } = await config.getClient()
    .from('personnel')
    .delete()
    .eq('id', id)
    .eq('organisation_id', organisationId);

  if (error) {
    throw error;
  }

  res.json({
    message: 'Personnel deleted successfully',
  });
}));

export default router;
