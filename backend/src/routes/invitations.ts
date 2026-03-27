import { Router, Response } from 'express';
import { AllowedUsersService } from '../services/allowedUsersService';
import { OrganisationCodeService } from '../services/organisationCodeService';
import { Pool } from 'pg';

const router = Router();

interface InvitationData {
  email: string;
  organisationId: string;
  role?: 'admin' | 'user';
  invitedBy: string;
}

interface BulkInvitationData {
  emails: string[];
  organisationId: string;
  defaultRole?: 'admin' | 'user';
  invitedBy: string;
}

// POST /api/invitations/send
// Send invitation to a single user
router.post('/send', async (req, res) => {
  try {
    const {
      email,
      organisationId,
      role = 'user',
      invitedBy,
    }: InvitationData = req.body;

    // Validate required fields
    if (!email || !organisationId || !invitedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, organisation ID, and invited by are required'
      });
    }

    // Validate email format
    if (!AllowedUsersService.validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Get organisation details for invitation
    const organisation = await OrganisationCodeService.getOrganisationByCode(
      await getOrganisationCode(organisationId)
    );

    // Add user to allowed_users table
    const allowedUser = await AllowedUsersService.addAllowedUser({
      email: email.toLowerCase(),
      organisationId,
      role,
      invitedBy,
    });

    // TODO: Send invitation email
    const signupUrl = `${process.env.APP_URL}/join?email=${encodeURIComponent(email.toLowerCase())}&code=${organisation.organisation_code}`;
    
    console.log('Invitation sent:', {
      email: email.toLowerCase(),
      organisationId,
      role,
      signupUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      data: {
        invitation: {
          id: allowedUser.id,
          email: allowedUser.email,
          role: allowedUser.role,
          organisationId: allowedUser.organisationId,
          invitedAt: allowedUser.createdAt,
        },
        signupUrl,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already allowed')) {
      return res.status(409).json({
        error: 'User already invited',
        message: 'This user is already on the allowed list for this organisation'
      });
    }

    console.error('Send invitation error:', error);
    res.status(500).json({
      error: 'Failed to send invitation',
      message: 'Internal server error'
    });
  }
});

// POST /api/invitations/bulk
// Send bulk invitations
router.post('/bulk', async (req, res) => {
  try {
    const {
      emails,
      organisationId,
      defaultRole = 'user',
      invitedBy,
    }: BulkInvitationData = req.body;

    // Validate required fields
    if (!emails || !Array.isArray(emails) || emails.length === 0 || !organisationId || !invitedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Emails array, organisation ID, and invited by are required'
      });
    }

    // Validate all email formats
    const invalidEmails = emails.filter(email => !AllowedUsersService.validateEmail(email));
    if (invalidEmails.length > 0) {
      return res.status(400).json({
        error: 'Invalid email formats',
        message: `Invalid emails: ${invalidEmails.join(', ')}`
      });
    }

    // Get organisation details
    const organisation = await OrganisationCodeService.getOrganisationByCode(
      await getOrganisationCode(organisationId)
    );

    // Bulk add to allowed_users
    const result = await AllowedUsersService.bulkAddAllowedUsers(
      emails.map(email => email.toLowerCase()),
      organisationId,
      defaultRole,
      invitedBy
    );

    // TODO: Send invitation emails
    const signupUrl = `${process.env.APP_URL}/join?code=${organisation.organisation_code}`;
    
    console.log('Bulk invitations sent:', {
      success: result.success,
      failed: result.failed,
      organisationId,
      defaultRole,
      signupUrl,
    });

    res.status(201).json({
      success: true,
      message: `Invitations sent to ${result.success.length} users`,
      data: {
        invitations: {
          successful: result.success,
          failed: result.failed,
          total: emails.length,
        },
        signupUrl,
      },
    });
  } catch (error) {
    console.error('Bulk invitation error:', error);
    res.status(500).json({
      error: 'Failed to send bulk invitations',
      message: 'Internal server error'
    });
  }
});

// GET /api/invitations/:organisationId
// Get all invitations for an organisation
router.get('/:organisationId', async (req, res) => {
  try {
    const { organisationId } = req.params;

    if (!organisationId) {
      return res.status(400).json({
        error: 'Missing organisation ID',
        message: 'Organisation ID is required'
      });
    }

    const allowedUsers = await AllowedUsersService.getOrganisationAllowedUsers(organisationId);

    res.json({
      success: true,
      data: {
        invitations: allowedUsers.map(user => ({
          id: user.id,
          email: user.email,
          role: user.role,
          invitedAt: user.createdAt,
          invitedBy: user.invitedBy,
        })),
        total: allowedUsers.length,
      },
    });
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({
      error: 'Failed to get invitations',
      message: 'Internal server error'
    });
  }
});

// DELETE /api/invitations/:invitationId
// Cancel/remove an invitation
router.delete('/:invitationId', async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { email, organisationId } = req.body;

    if (!invitationId || !email || !organisationId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Invitation ID, email, and organisation ID are required'
      });
    }

    const removed = await AllowedUsersService.removeAllowedUser(
      email.toLowerCase(),
      organisationId
    );

    if (!removed) {
      return res.status(404).json({
        error: 'Invitation not found',
        message: 'The specified invitation was not found'
      });
    }

    res.json({
      success: true,
      message: 'Invitation cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel invitation error:', error);
    res.status(500).json({
      error: 'Failed to cancel invitation',
      message: 'Internal server error'
    });
  }
});

// PUT /api/invitations/:invitationId/role
// Update invitation role
router.put('/:invitationId/role', async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { email, organisationId, role } = req.body;

    if (!invitationId || !email || !organisationId || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Invitation ID, email, organisation ID, and role are required'
      });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be either admin or user'
      });
    }

    const updatedUser = await AllowedUsersService.updateAllowedUserRole(
      email.toLowerCase(),
      organisationId,
      role
    );

    res.json({
      success: true,
      message: 'Invitation role updated successfully',
      data: {
        invitation: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Invitation not found',
        message: 'The specified invitation was not found'
      });
    }

    console.error('Update invitation role error:', error);
    res.status(500).json({
      error: 'Failed to update invitation role',
      message: 'Internal server error'
    });
  }
});

// GET /api/invitations/validate/:email/:organisationCode
// Validate invitation before signup
router.get('/validate/:email/:organisationCode', async (req, res) => {
  try {
    const { email, organisationCode } = req.params;

    if (!email || !organisationCode) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Email and organisation code are required'
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

    // Get organisation details
    const organisation = await OrganisationCodeService.getOrganisationByCode(organisationCode);

    // Check if user is invited
    const allowedUser = await AllowedUsersService.getAllowedUser(
      email.toLowerCase(),
      organisation.id
    );

    if (!allowedUser) {
      return res.status(403).json({
        error: 'Invitation not found',
        message: 'You are not invited to join this organisation'
      });
    }

    res.json({
      success: true,
      message: 'Invitation validated',
      data: {
        organisation: {
          id: organisation.id,
          name: organisation.name,
        },
        invitation: {
          email: allowedUser.email,
          role: allowedUser.role,
          invitedAt: allowedUser.createdAt,
        },
        canProceed: true,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Invalid organisation code',
        message: 'The organisation code you provided is not valid'
      });
    }

    console.error('Validate invitation error:', error);
    res.status(500).json({
      error: 'Failed to validate invitation',
      message: 'Internal server error'
    });
  }
});

// Helper function to get organisation code from organisation ID
async function getOrganisationCode(organisationId: string): Promise<string> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  });
  const client = await pool.connect();
  
  try {
    const query = 'SELECT organisation_code FROM organisations WHERE id = $1';
    const result = await client.query(query, [organisationId]);
    
    if (result.rows.length === 0) {
      throw new Error('Organisation not found');
    }
    
    return result.rows[0].organisation_code;
  } finally {
    client.release();
  }
}

export default router;
