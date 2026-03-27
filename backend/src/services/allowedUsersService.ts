import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export interface AllowedUser {
  id: string;
  email: string;
  organisationId: string;
  role: 'admin' | 'user';
  invitedBy?: string;
  invitedAt?: Date;
  createdAt: Date;
}

export class AllowedUsersService {
  // Add allowed user to organisation
  static async addAllowedUser(data: {
    email: string;
    organisationId: string;
    role?: 'admin' | 'user';
    invitedBy?: string;
  }): Promise<AllowedUser> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO allowed_users (email, organisation_id, role, invited_by)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, organisation_id, role, invited_by, invited_at, created_at
      `;
      const values = [
        data.email.toLowerCase(),
        data.organisationId,
        data.role || 'user',
        data.invitedBy || null,
      ];
      
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      // Handle unique constraint violation
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('This email is already allowed for this organisation');
      }
      throw error;
    } finally {
      client.release();
    }
  }

  // Check if user is allowed for organisation
  static async isUserAllowed(email: string, organisationId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 1 FROM allowed_users 
        WHERE email = $1 AND organisation_id = $2
      `;
      const result = await client.query(query, [email.toLowerCase(), organisationId]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Get allowed user details
  static async getAllowedUser(email: string, organisationId: string): Promise<AllowedUser | null> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id, email, organisation_id, role, invited_by, invited_at, created_at
        FROM allowed_users 
        WHERE email = $1 AND organisation_id = $2
      `;
      const result = await client.query(query, [email.toLowerCase(), organisationId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get all allowed users for organisation
  static async getOrganisationAllowedUsers(organisationId: string): Promise<AllowedUser[]> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id, email, organisation_id, role, invited_by, invited_at, created_at
        FROM allowed_users 
        WHERE organisation_id = $1
        ORDER BY created_at DESC
      `;
      const result = await client.query(query, [organisationId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Remove allowed user
  static async removeAllowedUser(email: string, organisationId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const query = `
        DELETE FROM allowed_users 
        WHERE email = $1 AND organisation_id = $2
        RETURNING id
      `;
      const result = await client.query(query, [email.toLowerCase(), organisationId]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Update allowed user role
  static async updateAllowedUserRole(
    email: string, 
    organisationId: string, 
    role: 'admin' | 'user'
  ): Promise<AllowedUser> {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE allowed_users 
        SET role = $1
        WHERE email = $2 AND organisation_id = $3
        RETURNING id, email, organisation_id, role, invited_by, invited_at, created_at
      `;
      const result = await client.query(query, [role, email.toLowerCase(), organisationId]);
      
      if (result.rows.length === 0) {
        throw new Error('Allowed user not found');
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Bulk add allowed users
  static async bulkAddAllowedUsers(
    emails: string[], 
    organisationId: string, 
    defaultRole: 'admin' | 'user' = 'user',
    invitedBy?: string
  ): Promise<{ success: string[], failed: string[] }> {
    const client = await pool.connect();
    const success: string[] = [];
    const failed: string[] = [];

    try {
      await client.query('BEGIN');

      for (const email of emails) {
        try {
          const query = `
            INSERT INTO allowed_users (email, organisation_id, role, invited_by)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (organisation_id, email) DO NOTHING
            RETURNING id
          `;
          
          await client.query(query, [email.toLowerCase(), organisationId, defaultRole, invitedBy]);
          success.push(email);
        } catch (error) {
          failed.push(email);
        }
      }

      await client.query('COMMIT');
      return { success, failed };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Check if user exists in any organisation
  static async getUserOrganisations(email: string): Promise<{ organisationId: string; role: string }[]> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT organisation_id, role
        FROM allowed_users 
        WHERE email = $1
      `;
      const result = await client.query(query, [email.toLowerCase()]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get allowed users by role
  static async getUsersByRole(organisationId: string, role: 'admin' | 'user'): Promise<AllowedUser[]> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id, email, organisation_id, role, invited_by, invited_at, created_at
        FROM allowed_users 
        WHERE organisation_id = $1 AND role = $2
        ORDER BY created_at DESC
      `;
      const result = await client.query(query, [organisationId, role]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
