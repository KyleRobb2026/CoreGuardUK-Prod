import { Router, Response } from 'express';
import { auth } from '../lib/auth';
import { OrganisationService } from '../services/organisationService';
import { sendVerificationEmail } from '../lib/email';

const router = Router();

// POST /api/auth/signup-with-organisation
// Custom signup that creates organisation and assigns user
router.post('/signup-with-organisation', async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      organisationName,
      organisationEmail,
      phone,
      address,
      companyNumber,
      vatNumber,
    } = req.body;

    // Validate required fields
    if (!email || !password || !name || !organisationName || !organisationEmail) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password, name, organisation name, and organisation email are required'
      });
    }

    // Check if organisation already exists
    const existingOrg = await OrganisationService.getOrganisationByEmail(organisationEmail);
    if (existingOrg) {
      return res.status(409).json({
        error: 'Organisation already exists',
        message: 'An organisation with this email already exists'
      });
    }

    // Create the organisation first
    const { organisation } = await OrganisationService.createOrAssignOrganisation({
      organisationName,
      organisationEmail,
      userId: '', // Will be set after user creation
      role: 'admin',
      phone,
      address,
      companyNumber,
      vatNumber,
    });

    // Create user with Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    // Better Auth returns either success or throws an error
    if (!result.user) {
      return res.status(400).json({
        error: 'Failed to create user',
        message: 'User creation failed'
      });
    }

    // Send verification email
    try {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${result.user.id}`;
      await sendVerificationEmail({
        user: {
          email,
          firstName: name.split(' ')[0]
        },
        verificationUrl
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the signup if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          emailVerified: result.user.emailVerified,
        },
        organisation: {
          id: organisation.id,
          name: organisation.name,
          email: organisation.email,
        }
      }
    });
  } catch (error) {
    console.error('Signup with organisation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create account'
    });
  }
});

export default router;
