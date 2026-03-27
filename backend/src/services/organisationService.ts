import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export interface Organisation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  companyNumber?: string;
  vatNumber?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganisationUser {
  id: string;
  organisationId: string;
  userId: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export class OrganisationService {
  // Create a new organisation
  static async createOrganisation(data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    companyNumber?: string;
    vatNumber?: string;
  }): Promise<Organisation> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO organisations (name, email, phone, address, company_number, vat_number)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const values = [
        data.name,
        data.email,
        data.phone || null,
        data.address || null,
        data.companyNumber || null,
        data.vatNumber || null,
      ];
      
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Get organisation by ID
  static async getOrganisationById(id: string): Promise<Organisation | null> {
    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM organisations WHERE id = $1';
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get organisation by email
  static async getOrganisationByEmail(email: string): Promise<Organisation | null> {
    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM organisations WHERE email = $1';
      const result = await client.query(query, [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create or get organisation and assign user to it
  static async createOrAssignOrganisation(data: {
    organisationName: string;
    organisationEmail: string;
    userId: string;
    role?: 'admin' | 'user';
    phone?: string;
    address?: string;
    companyNumber?: string;
    vatNumber?: string;
  }): Promise<{ organisation: Organisation; isNew: boolean }> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Check if organisation already exists
      let organisation = await this.getOrganisationByEmail(data.organisationEmail);
      let isNew = false;
      
      if (!organisation) {
        // Create new organisation
        organisation = await this.createOrganisation({
          name: data.organisationName,
          email: data.organisationEmail,
          phone: data.phone,
          address: data.address,
          companyNumber: data.companyNumber,
          vatNumber: data.vatNumber,
        });
        isNew = true;
      }
      
      // Assign user to organisation (this would be handled by Better Auth's additional fields)
      // The user's organisationId and role will be set during signup
      
      await client.query('COMMIT');
      return { organisation, isNew };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get users in an organisation
  static async getOrganisationUsers(organisationId: string): Promise<any[]> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT u.id, u.email, u.name, u.email_verified, u.created_at
        FROM users u
        WHERE u.organisation_id = $1
        ORDER BY u.created_at DESC
      `;
      const result = await client.query(query, [organisationId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Check if user belongs to organisation
  static async isUserInOrganisation(userId: string, organisationId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const query = 'SELECT 1 FROM users WHERE id = $1 AND organisation_id = $2';
      const result = await client.query(query, [userId, organisationId]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}
