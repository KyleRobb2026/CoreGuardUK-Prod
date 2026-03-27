import { DatabaseService } from './database';
import { logger } from '../utils/logger';

export interface Invoice {
  id: string;
  organisationId: string;
  amount: number;
  plan: 'core' | 'pro' | 'custom';
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  issuedDate: Date;
  paidDate?: Date;
  referenceNumber: string;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionWithBilling {
  id: string;
  organisationId: string;
  plan: 'core' | 'pro' | 'custom';
  status: 'active' | 'pending' | 'suspended';
  billingType: 'invoice' | 'stripe';
  nextBillingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class InvoiceService {
  // Generate invoice for plan upgrade
  static async generateInvoice(
    organisationId: string, 
    plan: 'core' | 'pro' | 'custom',
    amount: number,
    dueDays: number = 7
  ): Promise<Invoice> {
    try {
      const query = `
        INSERT INTO invoices (
          organisation_id, amount, plan, due_date, notes, payment_method
        ) VALUES ($1, $2, $3, NOW() + INTERVAL '1 day' * $4, $5, 'bank_transfer')
        RETURNING id, organisation_id, amount, plan, status, due_date, issued_date, 
                  paid_date, reference_number, payment_method, notes, created_at, updated_at
      `;
      
      const notes = `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan monthly subscription`;
      const result = await DatabaseService.query(query, [organisationId, amount, plan, dueDays, notes]);
      
      logger.info('Invoice generated', {
        invoiceId: result.rows[0].id,
        organisationId,
        plan,
        amount
      });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Failed to generate invoice', {
        error: error instanceof Error ? error.message : 'Unknown error',
        organisationId,
        plan,
        amount
      });
      throw error;
    }
  }

  // Get latest invoice for organisation
  static async getLatestInvoice(organisationId: string): Promise<Invoice | null> {
    try {
      const query = `
        SELECT id, organisation_id, amount, plan, status, due_date, issued_date, 
               paid_date, reference_number, payment_method, notes, created_at, updated_at
        FROM invoices 
        WHERE organisation_id = $1 
        ORDER BY issued_date DESC 
        LIMIT 1
      `;
      const result = await DatabaseService.query(query, [organisationId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Failed to get latest invoice', {
        error: error instanceof Error ? error.message : 'Unknown error',
        organisationId
      });
      throw error;
    }
  }

  // Get all invoices for organisation
  static async getInvoices(organisationId: string): Promise<Invoice[]> {
    try {
      const query = `
        SELECT id, organisation_id, amount, plan, status, due_date, issued_date, 
               paid_date, reference_number, payment_method, notes, created_at, updated_at
        FROM invoices 
        WHERE organisation_id = $1 
        ORDER BY issued_date DESC
      `;
      const result = await DatabaseService.query(query, [organisationId]);
      return result.rows;
    } catch (error) {
      logger.error('Failed to get invoices', {
        error: error instanceof Error ? error.message : 'Unknown error',
        organisationId
      });
      throw error;
    }
  }

  // Mark invoice as paid (admin only)
  static async markInvoiceAsPaid(invoiceId: string): Promise<Invoice> {
    try {
      const queries = [
        {
          text: `
            UPDATE invoices 
            SET status = 'paid', paid_date = NOW()
            WHERE id = $1
            RETURNING id, organisation_id, amount, plan, status, due_date, issued_date, 
                      paid_date, reference_number, payment_method, notes, created_at, updated_at
          `,
          params: [invoiceId]
        }
      ];
      
      const results = await DatabaseService.transaction(queries);
      const invoice = results[0].rows[0];
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      // Update subscription to active if it was pending
      await DatabaseService.query(`
        UPDATE subscriptions 
        SET status = 'active', next_billing_date = NOW() + INTERVAL '1 month'
        WHERE organisation_id = $1 AND status = 'pending'
      `, [invoice.organisationId]);
      
      logger.info('Invoice marked as paid', {
        invoiceId,
        organisationId: invoice.organisationId,
        plan: invoice.plan
      });
      
      return invoice;
    } catch (error) {
      logger.error('Failed to mark invoice as paid', {
        error: error instanceof Error ? error.message : 'Unknown error',
        invoiceId
      });
      throw error;
    }
  }

  // Check if invoice is overdue and update status
  static async checkOverdueInvoices(): Promise<void> {
    try {
      // Mark overdue invoices
      const overdueQuery = `
        UPDATE invoices 
        SET status = 'overdue'
        WHERE status = 'pending' AND due_date < NOW()
      `;
      await DatabaseService.query(overdueQuery);
      
      // Downgrade subscriptions with overdue invoices
      const downgradeQuery = `
        UPDATE subscriptions 
        SET status = 'suspended'
        WHERE organisation_id IN (
          SELECT DISTINCT organisation_id 
          FROM invoices 
          WHERE status = 'overdue'
        )
      `;
      await DatabaseService.query(downgradeQuery);
      
      logger.info('Overdue invoice check completed');
    } catch (error) {
      logger.error('Failed to check overdue invoices', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // Get billing overview for organisation
  static async getBillingOverview(organisationId: string): Promise<{
    subscription: SubscriptionWithBilling | null;
    latestInvoice: Invoice | null;
    canAccessProFeatures: boolean;
    paymentStatus: string;
  }> {
    try {
      // Get subscription
      const subscriptionQuery = `
        SELECT id, organisation_id, plan, status, billing_type, next_billing_date, created_at, updated_at
        FROM subscriptions 
        WHERE organisation_id = $1 AND status IN ('active', 'pending', 'suspended')
        ORDER BY created_at DESC
        LIMIT 1
      `;
      const subscriptionResult = await DatabaseService.query(subscriptionQuery, [organisationId]);
      const subscription = subscriptionResult.rows[0] || null;
      
      // Get latest invoice
      const latestInvoice = await this.getLatestInvoice(organisationId);
      
      // Determine feature access
      let canAccessProFeatures = false;
      let paymentStatus = 'No invoice';
      
      if (subscription && latestInvoice) {
        if (subscription.plan === 'core') {
          canAccessProFeatures = false;
          paymentStatus = 'Core plan - no payment required';
        } else if (subscription.plan === 'pro' || subscription.plan === 'custom') {
          if (latestInvoice.status === 'paid') {
            canAccessProFeatures = true;
            paymentStatus = 'Paid';
          } else if (latestInvoice.status === 'pending') {
            canAccessProFeatures = false;
            paymentStatus = 'Payment pending';
          } else if (latestInvoice.status === 'overdue') {
            canAccessProFeatures = false;
            paymentStatus = 'Overdue - features restricted';
          }
        }
      } else if (subscription && subscription.plan === 'core') {
        canAccessProFeatures = false;
        paymentStatus = 'Core plan - no payment required';
      }
      
      return {
        subscription,
        latestInvoice,
        canAccessProFeatures,
        paymentStatus
      };
    } catch (error) {
      logger.error('Failed to get billing overview', {
        error: error instanceof Error ? error.message : 'Unknown error',
        organisationId
      });
      throw error;
    }
  }

  // Create monthly invoices for active subscriptions
  static async generateMonthlyInvoices(): Promise<Invoice[]> {
    try {
      const query = `
        INSERT INTO invoices (organisation_id, amount, plan, due_date, notes, payment_method)
        SELECT 
          s.organisation_id,
          CASE 
            WHEN s.plan = 'core' THEN 15.00
            WHEN s.plan = 'pro' THEN 30.00
            ELSE 0.00 -- Custom plans handled separately
          END,
          s.plan,
          NOW() + INTERVAL '7 days',
          s.plan || ' plan monthly subscription',
          'bank_transfer'
        FROM subscriptions s
        WHERE s.status = 'active' 
          AND s.billing_type = 'invoice'
          AND s.plan IN ('core', 'pro')
          AND (s.next_billing_date <= NOW() OR s.next_billing_date IS NULL)
          AND NOT EXISTS (
            SELECT 1 FROM invoices i 
            WHERE i.organisation_id = s.organisation_id 
              AND i.plan = s.plan 
              AND i.status = 'pending'
              AND i.due_date > NOW()
          )
        RETURNING id, organisation_id, amount, plan, status, due_date, issued_date, 
                  paid_date, reference_number, payment_method, notes, created_at, updated_at
      `;
      
      const result = await DatabaseService.query(query);
      
      // Update next billing dates
      await DatabaseService.query(`
        UPDATE subscriptions 
        SET next_billing_date = NOW() + INTERVAL '1 month'
        WHERE id IN (
          SELECT s.id FROM subscriptions s
          WHERE s.status = 'active' 
            AND s.billing_type = 'invoice'
            AND s.plan IN ('core', 'pro')
            AND (s.next_billing_date <= NOW() OR s.next_billing_date IS NULL)
        )
      `);
      
      logger.info('Monthly invoices generated', {
        count: result.rows.length
      });
      
      return result.rows;
    } catch (error) {
      logger.error('Failed to generate monthly invoices', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // Cancel invoice
  static async cancelInvoice(invoiceId: string): Promise<Invoice> {
    try {
      const query = `
        UPDATE invoices 
        SET status = 'cancelled'
        WHERE id = $1 AND status = 'pending'
        RETURNING id, organisation_id, amount, plan, status, due_date, issued_date, 
                  paid_date, reference_number, payment_method, notes, created_at, updated_at
      `;
      const result = await DatabaseService.query(query, [invoiceId]);
      
      if (result.rows.length === 0) {
        throw new Error('Invoice not found or cannot be cancelled');
      }
      
      logger.info('Invoice cancelled', {
        invoiceId,
        organisationId: result.rows[0].organisation_id
      });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Failed to cancel invoice', {
        error: error instanceof Error ? error.message : 'Unknown error',
        invoiceId
      });
      throw error;
    }
  }

  // Get invoice statistics (admin only)
  static async getInvoiceStats(): Promise<{
    totalInvoices: number;
    pendingInvoices: number;
    paidInvoices: number;
    overdueInvoices: number;
    totalRevenue: number;
    monthlyRevenue: number;
  }> {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_invoices,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_invoices,
          COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_invoices,
          COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_invoices,
          COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as total_revenue,
          COALESCE(SUM(CASE WHEN status = 'paid' AND paid_date >= NOW() - INTERVAL '30 days' THEN amount ELSE 0 END), 0) as monthly_revenue
        FROM invoices
      `;
      
      const result = await DatabaseService.query(statsQuery);
      const stats = result.rows[0];
      
      return {
        totalInvoices: parseInt(stats.total_invoices),
        pendingInvoices: parseInt(stats.pending_invoices),
        paidInvoices: parseInt(stats.paid_invoices),
        overdueInvoices: parseInt(stats.overdue_invoices),
        totalRevenue: parseFloat(stats.total_revenue),
        monthlyRevenue: parseFloat(stats.monthly_revenue)
      };
    } catch (error) {
      logger.error('Failed to get invoice statistics', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}
