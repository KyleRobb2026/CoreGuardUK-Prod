import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/database';
import { logger } from '../utils/logger';
import { validateRequest, schemas } from '../middleware/validation';
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
  } as jwt.SignOptions);
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
router.post('/register', validateRequest(schemas.register), catchAsync(async (req: Request, res: Response) => {
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
router.post('/login', validateRequest(schemas.login), catchAsync(async (req: Request, res: Response) => {
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

// POST /api/organisations/onboard (mounted at /api/organisations in index.ts)
router.post('/onboard', catchAsync(async (req: Request, res: Response) => {
  const { org_data, admin_data, subscription_data } = req.body;

  if (!org_data?.name || !org_data?.email) {
    throw new AppErrorImpl('Company name and email are required', 400);
  }
  if (!admin_data?.email || !admin_data?.password) {
    throw new AppErrorImpl('Admin email and password are required', 400);
  }

  // Check if organisation email already exists
  const { data: existingOrg } = await config.getClient()
    .from('organisations')
    .select('id')
    .eq('email', org_data.email.toLowerCase())
    .single();

  if (existingOrg) {
    throw new AppErrorImpl('Organisation email already registered', 400);
  }

  // Check if admin email already exists
  const { data: existingUser } = await config.getClient()
    .from('users')
    .select('id')
    .eq('email', admin_data.email.toLowerCase())
    .single();

  if (existingUser) {
    throw new AppErrorImpl('Admin email already in use', 400);
  }

  // Create organisation
  const { data: organisation, error: orgError } = await config.getClient()
    .from('organisations')
    .insert({
      name: org_data.name,
      email: org_data.email.toLowerCase(),
      phone: org_data.phone || null,
      subscription_plan: subscription_data?.plan || 'starter',
      billing_email: subscription_data?.billing_email || null,
      status: 'active',
    })
    .select()
    .single();

  if (orgError || !organisation) {
    throw new AppErrorImpl('Failed to create organisation', 500);
  }

  // Hash password and create admin user
  const hashedPassword = await hashPassword(admin_data.password);

  const { data: user, error: userError } = await config.getClient()
    .from('users')
    .insert({
      organisation_id: organisation.id,
      email: admin_data.email.toLowerCase(),
      password_hash: hashedPassword,
      first_name: admin_data.first_name || 'Admin',
      last_name: admin_data.last_name || 'User',
      actor_type: 'admin',
      is_active: true,
    })
    .select()
    .single();

  if (userError || !user) {
    throw new AppErrorImpl('Failed to create admin account', 500);
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    actor_type: user.actor_type,
    organisation_id: user.organisation_id,
  });

  logger.info('Organisation onboarded', { orgId: organisation.id, adminEmail: user.email });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      actor_type: user.actor_type,
      organisation_id: user.organisation_id,
    },
    organisation: {
      id: organisation.id,
      name: organisation.name,
      email: organisation.email,
      subscription_plan: organisation.subscription_plan,
    },
  });
}));

export default router;
