import { Router, Response } from 'express';
import { OrganisationCodeService } from '../services/organisationCodeService';
import { AllowedUsersService } from '../services/allowedUsersService';
import { auth } from '../lib/auth';
import { Pool } from 'pg';

const router = Router();

interface OrganisationSignupData {
  name: string;
  email: string;
  password: string;
  adminName: string;
  phone?: string;
  address?: string;
  companyNumber?: string;
  vatNumber?: string;
}

// POST /api/onboarding/organisation-signup
// Create organisation and first admin user
router.post('/organisation-signup', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      adminName,
      phone,
      address,
      companyNumber,
      vatNumber,
    }: OrganisationSignupData = req.body;

    // Validate required fields
    if (!name || !email || !password || !adminName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Organisation name, email, password, and admin name are required'
      });
    }

    // Validate email format
    if (!AllowedUsersService.validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Generate unique organisation code
    const organisationCode = await OrganisationCodeService.generateUniqueCode();

    const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create organisation
      const orgQuery = `
        INSERT INTO organisations (name, email, organisation_code, phone, address, company_number, vat_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, organisation_code, created_at
      `;
      const orgValues = [
        name,
        email.toLowerCase(),
        organisationCode,
        phone || null,
        address || null,
        companyNumber || null,
        vatNumber || null,
      ];
      
      const orgResult = await client.query(orgQuery, orgValues);
      const organisation = orgResult.rows[0];

      // Create first admin user using Better Auth
      const userResult = await auth.api.signUpEmail({
        body: {
          email: email.toLowerCase(),
          password,
          name: adminName,
        },
      });

      if (!userResult.user) {
        throw new Error('Failed to create admin user');
      }

      // Update user with organisation_id and role
      const updateUserQuery = `
        UPDATE users 
        SET organisation_id = $1, role = 'admin'
        WHERE id = $2
        RETURNING id, email, name, organisation_id, role
      `;
      await client.query(updateUserQuery, [organisation.id, userResult.user.id]);

      // Add admin to allowed_users table
      await AllowedUsersService.addAllowedUser({
        email: email.toLowerCase(),
        organisationId: organisation.id,
        role: 'admin',
        invitedBy: userResult.user.id,
      });

      // Record onboarding progress
      const onboardingQuery = `
        INSERT INTO organisation_onboarding (organisation_id, step_completed, completed_by)
        VALUES ($1, 'organisation_created', $2)
      `;
      await client.query(onboardingQuery, [organisation.id, userResult.user.id]);

      await client.query('COMMIT');

      // TODO: Send welcome email
      console.log('Organisation created:', { name, email, organisationCode });

      res.status(201).json({
        success: true,
        message: 'Organisation created successfully! Please check your email to verify your account.',
        data: {
          organisation: {
            id: organisation.id,
            name: organisation.name,
            email: organisation.email,
            organisationCode: organisation.organisation_code,
            createdAt: organisation.created_at,
          },
          user: {
            id: userResult.user.id,
            email: userResult.user.email,
            name: userResult.user.name,
            role: 'admin',
          },
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      
      // Handle duplicate organisation email
      if (error instanceof Error && error.message.includes('duplicate key')) {
        if (error.message.includes('organisations_email_key')) {
          return res.status(409).json({
            error: 'Organisation email already exists',
            message: 'An organisation with this email already exists'
          });
        }
      }

      console.error('Organisation signup error:', error);
      res.status(500).json({
        error: 'Failed to create organisation',
        message: 'Internal server error'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Organisation signup error:', error);
    res.status(500).json({
      error: 'Failed to create organisation',
      message: 'Internal server error'
    });
  }
});

// GET /api/onboarding/organisation/:code
// Get organisation details by code (for validation during user signup)
router.get('/organisation/:code', async (req, res) => {
  try {
    const { code } = req.params;

    if (!OrganisationCodeService.validateCodeFormat(code)) {
      return res.status(400).json({
        error: 'Invalid organisation code format',
        message: 'Organisation code must be 8 characters (uppercase letters and numbers)'
      });
    }

    const organisation = await OrganisationCodeService.getOrganisationByCode(code);

    res.json({
      success: true,
      data: {
        id: organisation.id,
        name: organisation.name,
        status: organisation.status,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Organisation not found',
        message: 'Invalid organisation code'
      });
    }

    console.error('Get organisation error:', error);
    res.status(500).json({
      error: 'Failed to get organisation',
      message: 'Internal server error'
    });
  }
});

// PUT /api/onboarding/regenerate-code
// Regenerate organisation code (admin only)
router.put('/regenerate-code', async (req, res) => {
  try {
    // This would need authentication middleware
    const { organisationId } = req.body;

    if (!organisationId) {
      return res.status(400).json({
        error: 'Missing organisation ID',
        message: 'Organisation ID is required'
      });
    }

    const newCode = await OrganisationCodeService.regenerateCode(organisationId);

    res.json({
      success: true,
      message: 'Organisation code regenerated successfully',
      data: {
        organisationCode: newCode,
      },
    });
  } catch (error) {
    console.error('Regenerate code error:', error);
    res.status(500).json({
      error: 'Failed to regenerate organisation code',
      message: 'Internal server error'
    });
  }
});

export default router;
