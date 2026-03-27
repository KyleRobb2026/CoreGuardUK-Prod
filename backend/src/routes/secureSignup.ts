import { Router, Response } from 'express';
import { OrganisationCodeService } from '../services/organisationCodeService';
import { AllowedUsersService } from '../services/allowedUsersService';
import { auth } from '../lib/auth';
import { Pool } from 'pg';

const router = Router();

interface SecureSignupData {
  email: string;
  password: string;
  name: string;
  organisationCode: string;
}

// POST /api/onboarding/secure-signup
// Secure user signup with organisation code and email validation
router.post('/secure-signup', async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      organisationCode,
    }: SecureSignupData = req.body;

    // Validate required fields
    if (!email || !password || !name || !organisationCode) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password, name, and organisation code are required'
      });
    }

    // Validate email format
    if (!AllowedUsersService.validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Validate organisation code format
    if (!OrganisationCodeService.validateCodeFormat(organisationCode)) {
      return res.status(400).json({
        error: 'Invalid organisation code format',
        message: 'Organisation code must be 8 characters (uppercase letters and numbers)'
      });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // STEP 1: Validate organisation code and get organisation details
      const organisation = await OrganisationCodeService.getOrganisationByCode(organisationCode);

      // STEP 2: Check if user is allowed for this organisation
      const isAllowed = await AllowedUsersService.isUserAllowed(email.toLowerCase(), organisation.id);
      if (!isAllowed) {
        await client.query('ROLLBACK');
        return res.status(403).json({
          error: 'Email not authorized for this organisation',
          message: 'Your email is not on the allowed list for this organisation. Please contact your administrator.'
        });
      }

      // STEP 3: Get allowed user details to determine role
      const allowedUser = await AllowedUsersService.getAllowedUser(email.toLowerCase(), organisation.id);
      if (!allowedUser) {
        await client.query('ROLLBACK');
        return res.status(403).json({
          error: 'User authorization failed',
          message: 'Unable to verify user authorization. Please contact your administrator.'
        });
      }

      // STEP 4: Check if user already exists in this organisation
      const existingUserQuery = `
        SELECT id FROM users 
        WHERE email = $1 AND organisation_id = $2
      `;
      const existingUserResult = await client.query(existingUserQuery, [email.toLowerCase(), organisation.id]);
      
      if (existingUserResult.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          error: 'User already exists',
          message: 'A user with this email already exists in this organisation. Please sign in instead.'
        });
      }

      // STEP 5: Create user with Better Auth
      const userResult = await auth.api.signUpEmail({
        body: {
          email: email.toLowerCase(),
          password,
          name,
        },
      });

      if (!userResult.user) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: 'Failed to create user',
          message: 'Unable to create user account. Please try again.'
        });
      }

      // STEP 6: Update user with organisation_id and role from allowed_users
      const updateUserQuery = `
        UPDATE users 
        SET organisation_id = $1, role = $2
        WHERE id = $3
        RETURNING id, email, name, organisation_id, role, email_verified
      `;
      const updateUserResult = await client.query(updateUserQuery, [
        organisation.id,
        allowedUser.role,
        userResult.user.id
      ]);

      // STEP 7: Remove user from allowed_users (they're now a real user)
      await AllowedUsersService.removeAllowedUser(email.toLowerCase(), organisation.id);

      // STEP 8: Record onboarding progress
      const onboardingQuery = `
        INSERT INTO organisation_onboarding (organisation_id, step_completed, completed_by)
        VALUES ($1, 'user_joined', $2)
        ON CONFLICT (organisation_id, step_completed) DO UPDATE SET
          completed_at = NOW(),
          completed_by = $2
      `;
      await client.query(onboardingQuery, [organisation.id, userResult.user.id]);

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Account created successfully! Please check your email to verify your account.',
        data: {
          user: {
            id: updateUserResult.rows[0].id,
            email: updateUserResult.rows[0].email,
            name: updateUserResult.rows[0].name,
            role: updateUserResult.rows[0].role,
            organisationId: updateUserResult.rows[0].organisation_id,
            emailVerified: updateUserResult.rows[0].email_verified,
          },
          organisation: {
            id: organisation.id,
            name: organisation.name,
          },
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({
            error: 'Invalid organisation code',
            message: 'The organisation code you provided is not valid or the organisation is inactive.'
          });
        }
        
        if (error.message.includes('duplicate key')) {
          if (error.message.includes('users_email_organisation_id_key')) {
            return res.status(409).json({
              error: 'User already exists',
              message: 'A user with this email already exists in this organisation.'
            });
          }
        }
      }

      console.error('Secure signup error:', error);
      res.status(500).json({
        error: 'Failed to create account',
        message: 'Internal server error'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Secure signup error:', error);
    res.status(500).json({
      error: 'Failed to create account',
      message: 'Internal server error'
    });
  }
});

// POST /api/onboarding/validate-signup
// Validate signup data before attempting to create account
router.post('/validate-signup', async (req, res) => {
  try {
    const {
      email,
      organisationCode,
    }: { email: string; organisationCode: string } = req.body;

    // Validate email format
    if (!AllowedUsersService.validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Validate organisation code format
    if (!OrganisationCodeService.validateCodeFormat(organisationCode)) {
      return res.status(400).json({
        error: 'Invalid organisation code format',
        message: 'Organisation code must be 8 characters (uppercase letters and numbers)'
      });
    }

    // Check organisation exists and is active
    const organisation = await OrganisationCodeService.getOrganisationByCode(organisationCode);

    // Check if user is allowed for this organisation
    const isAllowed = await AllowedUsersService.isUserAllowed(email.toLowerCase(), organisation.id);
    if (!isAllowed) {
      return res.status(403).json({
        error: 'Email not authorized',
        message: 'Your email is not on the allowed list for this organisation.'
      });
    }

    // Check if user already exists
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });
    const client = await pool.connect();
    
    try {
      const existingUserQuery = `
        SELECT id FROM users 
        WHERE email = $1 AND organisation_id = $2
      `;
      const existingUserResult = await client.query(existingUserQuery, [email.toLowerCase(), organisation.id]);
      
      if (existingUserResult.rows.length > 0) {
        return res.status(409).json({
          error: 'User already exists',
          message: 'A user with this email already exists in this organisation.'
        });
      }
    } finally {
      client.release();
    }

    res.json({
      success: true,
      message: 'Signup validation passed',
      data: {
        organisation: {
          id: organisation.id,
          name: organisation.name,
        },
        canProceed: true,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Invalid organisation code',
        message: 'The organisation code you provided is not valid.'
      });
    }

    console.error('Validate signup error:', error);
    res.status(500).json({
      error: 'Validation failed',
      message: 'Internal server error'
    });
  }
});

export default router;
