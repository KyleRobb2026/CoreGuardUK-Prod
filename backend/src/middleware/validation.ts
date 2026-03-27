import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
    }
  }
}

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      logger.warn('Validation error:', { error: errorMessage, body: req.body });
      
      res.status(400).json({
        error: 'Validation failed',
        details: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
      return;
    }

    req.validatedBody = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  // Authentication
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    organisation_name: Joi.string().min(2).max(100).required(),
  }),

  // Personnel
  createPersonnel: Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    officer_code: Joi.string().min(3).max(20).optional(),
    pin: Joi.string().min(4).max(10).optional(),
    sire_number: Joi.string().optional(),
    license_number: Joi.string().optional(),
    license_expiry: Joi.date().optional(),
  }),

  // Sites
  createSite: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    address: Joi.string().min(5).max(500).required(),
    post_code: Joi.string().optional(),
    contact_phone: Joi.string().optional(),
    site_type: Joi.string().optional(),
  }),

  // Rota
  createRota: Joi.object({
    personnel_id: Joi.string().uuid().required(),
    site_id: Joi.string().uuid().required(),
    shift_id: Joi.string().uuid().required(),
    date: Joi.date().required(),
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
  }),

  // Check Calls
  createCheckCall: Joi.object({
    personnel_id: Joi.string().uuid().required(),
    site_id: Joi.string().uuid().required(),
    scheduled_time: Joi.date().required(),
    status: Joi.string().valid('pending', 'completed', 'missed', 'late').default('pending'),
    notes: Joi.string().max(1000).optional(),
    location_lat: Joi.number().min(-90).max(90).optional(),
    location_lng: Joi.number().min(-180).max(180).optional(),
  }),

  // Billing
  billingUpgrade: Joi.object({
    plan: Joi.string().valid('pro', 'custom').required(),
    dueDays: Joi.number().integer().min(1).max(90).default(7),
  }),

  invoicePayment: Joi.object({
    invoiceId: Joi.string().uuid().required(),
  }),

  subscription: Joi.object({
    plan: Joi.string().valid('core', 'pro', 'custom').required(),
    billingType: Joi.string().valid('invoice', 'stripe').default('invoice'),
  }),

  // UUID parameter validation
  uuidParam: Joi.object({
    id: Joi.string().uuid().required(),
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0),
  }),
};
