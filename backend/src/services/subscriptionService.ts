import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export interface Subscription {
  id: string;
  organisationId: string;
  plan: 'core' | 'pro' | 'custom';
  status: 'active' | 'inactive' | 'trial';
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionService {
  // Get active subscription for organisation
  static async getActiveSubscription(organisationId: string): Promise<Subscription | null> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id, organisation_id, plan, status, trial_ends_at, created_at, updated_at
        FROM subscriptions 
        WHERE organisation_id = $1 AND status = 'active'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      const result = await client.query(query, [organisationId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create subscription for organisation
  static async createSubscription(organisationId: string, plan: 'core' | 'pro' | 'custom' = 'core'): Promise<Subscription> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Deactivate any existing subscriptions
      await client.query(
        'UPDATE subscriptions SET status = $1 WHERE organisation_id = $2',
        ['inactive', organisationId]
      );

      // Create new subscription
      const query = `
        INSERT INTO subscriptions (organisation_id, plan, status)
        VALUES ($1, $2, 'active')
        RETURNING id, organisation_id, plan, status, trial_ends_at, created_at, updated_at
      `;
      const result = await client.query(query, [organisationId, plan]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Upgrade subscription to Pro
  static async upgradeToPro(organisationId: string): Promise<Subscription> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update existing subscription
      const query = `
        UPDATE subscriptions 
        SET plan = 'pro', updated_at = NOW()
        WHERE organisation_id = $1 AND status = 'active'
        RETURNING id, organisation_id, plan, status, trial_ends_at, created_at, updated_at
      `;
      const result = await client.query(query, [organisationId]);

      if (result.rows.length === 0) {
        throw new Error('No active subscription found');
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Downgrade subscription to Core
  static async downgradeToCore(organisationId: string): Promise<Subscription> {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE subscriptions 
        SET plan = 'core', updated_at = NOW()
        WHERE organisation_id = $1 AND status = 'active'
        RETURNING id, organisation_id, plan, status, trial_ends_at, created_at, updated_at
      `;
      const result = await client.query(query, [organisationId]);

      if (result.rows.length === 0) {
        throw new Error('No active subscription found');
      }

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Upgrade to Custom plan (enterprise)
  static async upgradeToCustom(organisationId: string): Promise<Subscription> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update existing subscription
      const query = `
        UPDATE subscriptions 
        SET plan = 'custom', updated_at = NOW()
        WHERE organisation_id = $1 AND status = 'active'
        RETURNING id, organisation_id, plan, status, trial_ends_at, created_at, updated_at
      `;
      const result = await client.query(query, [organisationId]);

      if (result.rows.length === 0) {
        throw new Error('No active subscription found');
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Start trial period
  static async startTrial(organisationId: string, trialDays: number = 14): Promise<Subscription> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Deactivate existing subscriptions
      await client.query(
        'UPDATE subscriptions SET status = $1 WHERE organisation_id = $2',
        ['inactive', organisationId]
      );

      // Create trial subscription
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

      const query = `
        INSERT INTO subscriptions (organisation_id, plan, status, trial_ends_at)
        VALUES ($1, 'pro', 'trial', $2)
        RETURNING id, organisation_id, plan, status, trial_ends_at, created_at, updated_at
      `;
      const result = await client.query(query, [organisationId, trialEndsAt]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Check if trial has expired and update status
  static async checkTrialExpiration(organisationId: string): Promise<Subscription | null> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check for expired trial
      const checkQuery = `
        SELECT id, organisation_id, plan, status, trial_ends_at, created_at, updated_at
        FROM subscriptions 
        WHERE organisation_id = $1 AND status = 'trial' AND trial_ends_at < NOW()
      `;
      const expiredResult = await client.query(checkQuery, [organisationId]);

      if (expiredResult.rows.length > 0) {
        // Expire the trial and create core subscription
        await client.query(
          'UPDATE subscriptions SET status = $1 WHERE id = $2',
          ['inactive', expiredResult.rows[0].id]
        );

        const newQuery = `
          INSERT INTO subscriptions (organisation_id, plan, status)
          VALUES ($1, 'core', 'active')
          RETURNING id, organisation_id, plan, status, trial_ends_at, created_at, updated_at
        `;
        const newResult = await client.query(newQuery, [organisationId]);

        await client.query('COMMIT');
        return newResult.rows[0];
      }

      await client.query('ROLLBACK');
      return null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get subscription with trial status check
  static async getSubscriptionWithTrialCheck(organisationId: string): Promise<Subscription | null> {
    // First check if trial needs expiration
    await this.checkTrialExpiration(organisationId);
    
    // Then get active subscription
    return this.getActiveSubscription(organisationId);
  }

  // Validate subscription status
  static async validateSubscription(organisationId: string): Promise<{
    valid: boolean;
    subscription: Subscription | null;
    reason?: string;
  }> {
    const subscription = await this.getSubscriptionWithTrialCheck(organisationId);

    if (!subscription) {
      return {
        valid: false,
        subscription: null,
        reason: 'No active subscription found'
      };
    }

    if (subscription.status === 'inactive') {
      return {
        valid: false,
        subscription,
        reason: 'Subscription is inactive'
      };
    }

    if (subscription.status === 'trial' && subscription.trialEndsAt && subscription.trialEndsAt < new Date()) {
      return {
        valid: false,
        subscription,
        reason: 'Trial period has expired'
      };
    }

    return {
      valid: true,
      subscription
    };
  }
}
