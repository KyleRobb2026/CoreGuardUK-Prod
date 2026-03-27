import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export class OrganisationCodeService {
  // Generate a secure, non-guessable organisation code
  static generateOrganisationCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8;
    let code = '';
    
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return code;
  }

  // Check if organisation code is unique
  static async isCodeUnique(code: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const query = 'SELECT 1 FROM organisations WHERE organisation_code = $1';
      const result = await client.query(query, [code]);
      return result.rows.length === 0;
    } finally {
      client.release();
    }
  }

  // Generate a unique organisation code
  static async generateUniqueCode(): Promise<string> {
    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      code = this.generateOrganisationCode();
      isUnique = await this.isCodeUnique(code);
      attempts++;
      
      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique organisation code after maximum attempts');
      }
    } while (!isUnique);

    return code!;
  }

  // Regenerate organisation code
  static async regenerateCode(organisationId: string): Promise<string> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Generate new unique code
      const newCode = await this.generateUniqueCode();

      // Update organisation with new code
      const updateQuery = `
        UPDATE organisations 
        SET organisation_code = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING organisation_code
      `;
      const result = await client.query(updateQuery, [newCode, organisationId]);

      if (result.rows.length === 0) {
        throw new Error('Organisation not found');
      }

      await client.query('COMMIT');
      return result.rows[0].organisation_code;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Validate organisation code format
  static validateCodeFormat(code: string): boolean {
    // Must be 8 characters, uppercase letters and numbers only
    const pattern = /^[A-Z0-9]{8}$/;
    return pattern.test(code);
  }

  // Get organisation by code
  static async getOrganisationByCode(code: string): Promise<any> {
    const client = await pool.connect();
    try {
      if (!this.validateCodeFormat(code)) {
        throw new Error('Invalid organisation code format');
      }

      const query = `
        SELECT id, name, email, organisation_code, status, created_at
        FROM organisations 
        WHERE organisation_code = $1 AND status = 'active'
      `;
      const result = await client.query(query, [code]);

      if (result.rows.length === 0) {
        throw new Error('Organisation not found or inactive');
      }

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Check if organisation exists by code
  static async codeExists(code: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      if (!this.validateCodeFormat(code)) {
        return false;
      }

      const query = 'SELECT 1 FROM organisations WHERE organisation_code = $1';
      const result = await client.query(query, [code]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}
