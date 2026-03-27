import { Router, Response } from 'express';
import { Pool } from 'pg';

const router = Router();

interface SiteSetupData {
  organisationId: string;
  name: string;
  address?: string;
  phone?: string;
  completedBy: string;
}

interface PersonnelSetupData {
  organisationId: string;
  siteId?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  licenceNumber?: string;
  licenceExpiry?: string;
  completedBy: string;
}

interface OnboardingStepData {
  organisationId: string;
  step: string;
  completedBy: string;
}

// POST /api/onboarding/setup/site
// Step 1: Add first site
router.post('/setup/site', async (req, res) => {
  try {
    const {
      organisationId,
      name,
      address,
      phone,
      completedBy,
    }: SiteSetupData = req.body;

    // Validate required fields
    if (!organisationId || !name || !completedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Organisation ID, site name, and completed by are required'
      });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create site
      const siteQuery = `
        INSERT INTO sites (organisation_id, name, address, phone)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, address, phone, created_at
      `;
      const siteValues = [organisationId, name, address || null, phone || null];
      const siteResult = await client.query(siteQuery, siteValues);

      // Record onboarding progress
      const onboardingQuery = `
        INSERT INTO organisation_onboarding (organisation_id, step_completed, completed_by)
        VALUES ($1, 'first_site_added', $2)
        ON CONFLICT (organisation_id, step_completed) DO UPDATE SET
          completed_at = NOW(),
          completed_by = $2
      `;
      await client.query(onboardingQuery, [organisationId, completedBy]);

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'First site added successfully',
        data: {
          site: siteResult.rows[0],
          stepCompleted: 'first_site_added',
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Site setup error:', error);
      res.status(500).json({
        error: 'Failed to add site',
        message: 'Internal server error'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Site setup error:', error);
    res.status(500).json({
      error: 'Failed to add site',
      message: 'Internal server error'
    });
  }
});

// POST /api/onboarding/setup/personnel
// Step 2: Add personnel (or upload list)
router.post('/setup/personnel', async (req, res) => {
  try {
    const {
      organisationId,
      siteId,
      name,
      email,
      phone,
      role,
      licenceNumber,
      licenceExpiry,
      completedBy,
    }: PersonnelSetupData = req.body;

    // Validate required fields
    if (!organisationId || !name || !completedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Organisation ID, personnel name, and completed by are required'
      });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create personnel
      const personnelQuery = `
        INSERT INTO personnel (organisation_id, site_id, name, email, phone, role, licence_number, licence_expiry)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, email, phone, role, licence_number, licence_expiry, created_at
      `;
      const personnelValues = [
        organisationId,
        siteId || null,
        name,
        email || null,
        phone || null,
        role || null,
        licenceNumber || null,
        licenceExpiry || null,
      ];
      const personnelResult = await client.query(personnelQuery, personnelValues);

      // Record onboarding progress
      const onboardingQuery = `
        INSERT INTO organisation_onboarding (organisation_id, step_completed, completed_by)
        VALUES ($1, 'first_personnel_added', $2)
        ON CONFLICT (organisation_id, step_completed) DO UPDATE SET
          completed_at = NOW(),
          completed_by = $2
      `;
      await client.query(onboardingQuery, [organisationId, completedBy]);

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Personnel added successfully',
        data: {
          personnel: personnelResult.rows[0],
          stepCompleted: 'first_personnel_added',
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Personnel setup error:', error);
      res.status(500).json({
        error: 'Failed to add personnel',
        message: 'Internal server error'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Personnel setup error:', error);
    res.status(500).json({
      error: 'Failed to add personnel',
      message: 'Internal server error'
    });
  }
});

// POST /api/onboarding/setup/bulk-personnel
// Bulk upload personnel list
router.post('/setup/bulk-personnel', async (req, res) => {
  try {
    const {
      organisationId,
      personnelList,
      completedBy,
    }: {
      organisationId: string;
      personnelList: PersonnelSetupData[];
      completedBy: string;
    } = req.body;

    // Validate required fields
    if (!organisationId || !personnelList || !Array.isArray(personnelList) || !completedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Organisation ID, personnel list, and completed by are required'
      });
    }

    if (personnelList.length === 0) {
      return res.status(400).json({
        error: 'Empty personnel list',
        message: 'Personnel list cannot be empty'
      });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const addedPersonnel = [];
      const failedPersonnel = [];

      for (const personnel of personnelList) {
        try {
          const personnelQuery = `
            INSERT INTO personnel (organisation_id, site_id, name, email, phone, role, licence_number, licence_expiry)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, name, email, phone, role, licence_number, licence_expiry, created_at
          `;
          const personnelValues = [
            organisationId,
            personnel.siteId || null,
            personnel.name,
            personnel.email || null,
            personnel.phone || null,
            personnel.role || null,
            personnel.licenceNumber || null,
            personnel.licenceExpiry || null,
          ];
          const result = await client.query(personnelQuery, personnelValues);
          addedPersonnel.push(result.rows[0]);
        } catch (error) {
          failedPersonnel.push({
            name: personnel.name,
            email: personnel.email,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      // Record onboarding progress if at least one was added
      if (addedPersonnel.length > 0) {
        const onboardingQuery = `
          INSERT INTO organisation_onboarding (organisation_id, step_completed, completed_by)
          VALUES ($1, 'bulk_personnel_added', $2)
          ON CONFLICT (organisation_id, step_completed) DO UPDATE SET
            completed_at = NOW(),
            completed_by = $2
        `;
        await client.query(onboardingQuery, [organisationId, completedBy]);
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: `Added ${addedPersonnel.length} personnel successfully`,
        data: {
          added: addedPersonnel,
          failed: failedPersonnel,
          total: personnelList.length,
          stepCompleted: addedPersonnel.length > 0 ? 'bulk_personnel_added' : null,
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Bulk personnel setup error:', error);
      res.status(500).json({
        error: 'Failed to add bulk personnel',
        message: 'Internal server error'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Bulk personnel setup error:', error);
    res.status(500).json({
      error: 'Failed to add bulk personnel',
      message: 'Internal server error'
    });
  }
});

// POST /api/onboarding/setup/complete-step
// Mark onboarding step as complete
router.post('/setup/complete-step', async (req, res) => {
  try {
    const {
      organisationId,
      step,
      completedBy,
    }: OnboardingStepData = req.body;

    // Validate required fields
    if (!organisationId || !step || !completedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Organisation ID, step, and completed by are required'
      });
    }

    // Validate step
    const validSteps = [
      'organisation_created',
      'first_site_added',
      'first_personnel_added',
      'bulk_personnel_added',
      'employee_emails_added',
      'compliance_tracking_enabled',
      'onboarding_complete',
    ];

    if (!validSteps.includes(step)) {
      return res.status(400).json({
        error: 'Invalid step',
        message: `Step must be one of: ${validSteps.join(', ')}`
      });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });
    const client = await pool.connect();

    try {
      const onboardingQuery = `
        INSERT INTO organisation_onboarding (organisation_id, step_completed, completed_by)
        VALUES ($1, $2, $3)
        ON CONFLICT (organisation_id, step_completed) DO UPDATE SET
          completed_at = NOW(),
          completed_by = $3
        RETURNING step_completed, completed_at
      `;
      const result = await client.query(onboardingQuery, [organisationId, step, completedBy]);

      res.json({
        success: true,
        message: 'Step marked as complete',
        data: {
          step: result.rows[0].step_completed,
          completedAt: result.rows[0].completed_at,
        },
      });
    } catch (error) {
      console.error('Complete step error:', error);
      res.status(500).json({
        error: 'Failed to complete step',
        message: 'Internal server error'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Complete step error:', error);
    res.status(500).json({
      error: 'Failed to complete step',
      message: 'Internal server error'
    });
  }
});

// GET /api/onboarding/progress/:organisationId
// Get onboarding progress for organisation
router.get('/progress/:organisationId', async (req, res) => {
  try {
    const { organisationId } = req.params;

    if (!organisationId) {
      return res.status(400).json({
        error: 'Missing organisation ID',
        message: 'Organisation ID is required'
      });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });
    const client = await pool.connect();

    try {
      const progressQuery = `
        SELECT step_completed, completed_at, completed_by
        FROM organisation_onboarding
        WHERE organisation_id = $1
        ORDER BY completed_at ASC
      `;
      const result = await client.query(progressQuery, [organisationId]);

      // Get organisation stats
      const statsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM sites WHERE organisation_id = $1) as sites_count,
          (SELECT COUNT(*) FROM personnel WHERE organisation_id = $1) as personnel_count,
          (SELECT COUNT(*) FROM users WHERE organisation_id = $1) as users_count,
          (SELECT COUNT(*) FROM allowed_users WHERE organisation_id = $1) as pending_invitations
      `;
      const statsResult = await client.query(statsQuery, [organisationId]);

      // Calculate progress percentage
      const requiredSteps = ['organisation_created', 'first_site_added', 'first_personnel_added'];
      const completedSteps = result.rows.filter(row => requiredSteps.includes(row.step_completed));
      const progressPercentage = (completedSteps.length / requiredSteps.length) * 100;

      res.json({
        success: true,
        data: {
          progress: result.rows,
          stats: statsResult.rows[0],
          progressPercentage: Math.round(progressPercentage),
          isComplete: completedSteps.length === requiredSteps.length,
        },
      });
    } catch (error) {
      console.error('Get progress error:', error);
      res.status(500).json({
        error: 'Failed to get progress',
        message: 'Internal server error'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      error: 'Failed to get progress',
      message: 'Internal server error'
    });
  }
});

export default router;
