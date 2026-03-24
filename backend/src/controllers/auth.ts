import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/database';
import { logger } from '../utils/logger';
import { validateRequest, schemas, ValidatedRequest } from '../middleware/validation';
import { catchAsync, AppErrorImpl } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Helper function to generate JWT token
const generateToken = (payload: any): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new AppErrorImpl('JWT_SECRET not configured', 500);
  }
  
  return jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

// Helper function to hash password
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Helper function to compare password
const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// POST /api/auth/register
router.post('/register', validateRequest(schemas.register), catchAsync(async (req: ValidatedRequest, res: Response) => {
  const { email, password, first_name, last_name, organisation_name } = req.validatedBody;

  // Check if user already exists
  const { data: existingUser } = await config.getClient()
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new AppErrorImpl('User with this email already exists', 400);
  }

  // Create organisation
  const { data: organisation, error: orgError } = await config.getClient()
    .from('organisations')
    .insert({
      name: organisation_name,
      email,
      status: 'active',
    })
    .select()
    .single();

  if (orgError || !organisation) {
    throw new AppErrorImpl('Failed to create organisation', 500);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const { data: user, error: userError } = await config.getClient()
    .from('users')
    .insert({
      organisation_id: organisation.id,
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      actor_type: 'admin',
      is_active: true,
    })
    .select()
    .single();

  if (userError || !user) {
    throw new AppErrorImpl('Failed to create user account', 500);
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    actor_type: user.actor_type,
    organisation_id: user.organisation_id,
  });

  logger.info('New user registered', { userId: user.id, email, organisationId: organisation.id });

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      actor_type: user.actor_type,
      organisation_id: user.organisation_id,
    },
  });
}));

// POST /api/auth/login
router.post('/login', validateRequest(schemas.login), catchAsync(async (req: ValidatedRequest, res: Response) => {
  const { email, password } = req.validatedBody;

  // Find user
  const { data: user, error } = await config.getClient()
    .from('users')
    .select('id, email, password_hash, first_name, last_name, actor_type, organisation_id, is_active')
    .eq('email', email)
    .single();

  if (error || !user || !user.is_active) {
    throw new AppErrorImpl('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppErrorImpl('Invalid credentials', 401);
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    actor_type: user.actor_type,
    organisation_id: user.organisation_id,
  });

  logger.info('User logged in', { userId: user.id, email, actorType: user.actor_type });

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      actor_type: user.actor_type,
      organisation_id: user.organisation_id,
    },
  });
}));

// POST /api/auth/officer-login
router.post('/officer-login', catchAsync(async (req: Request, res: Response) => {
  const { code, pin } = req.body;

  if (!code || !pin) {
    throw new AppErrorImpl('Officer code and PIN are required', 400);
  }

  // Find officer
  const { data: officer, error } = await config.getClient()
    .from('personnel')
    .select('id, first_name, last_name, email, phone, officer_code, pin_hash, organisation_id, is_active')
    .eq('officer_code', code)
    .single();

  if (error || !officer || !officer.is_active) {
    throw new AppErrorImpl('Invalid officer credentials', 401);
  }

  // Check PIN
  const isPinValid = await comparePassword(pin, officer.pin_hash);
  if (!isPinValid) {
    throw new AppErrorImpl('Invalid officer credentials', 401);
  }

  // Generate token for officer
  const token = generateToken({
    id: officer.id,
    email: officer.email || `${officer.officer_code}@coreguard.local`,
    actor_type: 'officer',
    organisation_id: officer.organisation_id,
  });

  logger.info('Officer logged in', { officerId: officer.id, code: officer.officer_code });

  res.json({
    message: 'Officer login successful',
    token,
    user: {
      id: officer.id,
      email: officer.email || `${officer.officer_code}@coreguard.local`,
      first_name: officer.first_name,
      last_name: officer.last_name,
      actor_type: 'officer',
      organisation_id: officer.organisation_id,
    },
  });
}));

// GET /api/auth/me
router.get('/me', catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  const { data: user, error } = await config.getClient()
    .from('users')
    .select('id, email, first_name, last_name, actor_type, organisation_id, is_active, created_at')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new AppErrorImpl('User not found', 404);
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      actor_type: user.actor_type,
      organisation_id: user.organisation_id,
      is_active: user.is_active,
      created_at: user.created_at,
    },
  });
}));

// POST /api/auth/logout
router.post('/logout', catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // In a stateless JWT system, logout is handled client-side
  // Here we just log the event
  logger.info('User logged out', { userId: req.user?.id });

  res.json({
    message: 'Logout successful',
  });
}));

export default router;
