import { Router, Response } from 'express';
import { requireAdmin, requireSubscription } from '../lib/featureGuard';
import { InvoiceService } from '../services/invoiceService';
import { SubscriptionService } from '../services/subscriptionService';
import { sendInvoiceEmail, sendOverdueWarningEmail } from '../lib/invoiceEmail';
import { validateRequest, schemas } from '../middleware/validation';
import { logger } from '../utils/logger';
import { DatabaseService } from '../services/database';

const router = Router();

// POST /api/billing/upgrade
// Upgrade plan and create invoice
router.post('/upgrade', validateRequest(schemas.billingUpgrade), requireSubscription(), async (req, res) => {
  try {
    const user = req.user;
    const organisationId = (user as any).organisationId;
    const { plan, dueDays } = req.validatedBody;

    logger.info('Billing upgrade request', {
      userId: user?.id,
      organisationId,
      plan,
      dueDays,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    if (!organisationId) {
      logger.warn('Billing upgrade attempt without organisation', { userId: user?.id });
      return res.status(400).json({
        error: 'No Organisation',
        message: 'User must belong to an organisation'
      });
    }

    if (!['pro', 'custom'].includes(plan)) {
      logger.warn('Invalid plan attempted in billing upgrade', { 
        userId: user?.id, 
        plan,
        organisationId 
      });
      return res.status(400).json({
        error: 'Invalid Plan',
        message: 'Can only upgrade to pro or custom plan'
      });
    }

    // Get current subscription
    const currentSubscription = await SubscriptionService.getActiveSubscription(organisationId);
    if (currentSubscription?.plan === plan) {
      logger.warn('Duplicate plan upgrade attempt', { 
        userId: user?.id, 
        plan,
        organisationId 
      });
      return res.status(400).json({
        error: 'Already on Plan',
        message: `Organisation is already on ${plan} plan`
      });
    }

    // Determine amount
    const amount = plan === 'pro' ? 30.00 : 0.00; // Custom plans handled separately

    logger.info('Creating invoice for plan upgrade', {
      organisationId,
      plan,
      amount,
      dueDays
    });

    // Create invoice
    const invoice = await InvoiceService.generateInvoice(organisationId, plan, amount, dueDays);
    
    // Update subscription to pending
    await SubscriptionService.createSubscription(organisationId, plan);

    logger.info('Invoice generated successfully', {
      invoiceId: invoice.id,
      organisationId,
      plan,
      amount
    });

    // Get organisation details for email
    let organisationName = 'Unknown Organisation';
    
    try {
      const orgQuery = `
        SELECT name FROM organisations WHERE id = $1
      `;
      const orgResult = await DatabaseService.query(orgQuery, [organisationId]);
      organisationName = orgResult.rows[0]?.name || 'Unknown Organisation';
    } catch (error) {
      logger.error('Failed to fetch organisation name', {
        error: error instanceof Error ? error.message : 'Unknown error',
        organisationId
      });
      // Continue with default name - not a critical error
    }

    // Send invoice email
    await sendInvoiceEmail({
      organisationName,
      invoice,
      adminName: user.name || 'Admin',
      adminEmail: user.email
    });

    res.json({
      success: true,
      message: 'Invoice issued successfully',
      data: {
        invoice,
        plan,
        amount,
        dueDate: invoice.dueDate,
        referenceNumber: invoice.referenceNumber,
        message: 'Invoice issued - access will unlock once payment is received'
      }
    });

    logger.info('Billing upgrade completed successfully', {
      invoiceId: invoice.id,
      organisationId,
      plan,
      userId: user?.id
    });
  } catch (error) {
    logger.error('Billing upgrade error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: req.user?.id,
      organisationId: (req.user as any)?.organisationId,
      body: req.validatedBody
    });
    res.status(500).json({
      error: 'Failed to process upgrade',
      message: 'Internal server error'
    });
  }
});

// GET /api/billing/current
// Get current billing status
router.get('/current', requireSubscription(), async (req, res) => {
  try {
    const user = req.user;
    const organisationId = (user as any).organisationId;

    if (!organisationId) {
      return res.status(400).json({
        error: 'No Organisation',
        message: 'User must belong to an organisation'
      });
    }

    const billingOverview = await InvoiceService.getBillingOverview(organisationId);
    const invoices = await InvoiceService.getInvoices(organisationId);

    res.json({
      success: true,
      data: {
        ...billingOverview,
        invoices,
        planLimits: {
          core: { users: 'unlimited', sites: 'unlimited', personnel: 'unlimited' },
          pro: { users: 'unlimited', sites: 'unlimited', personnel: 'unlimited' },
          custom: { users: 'unlimited', sites: 'unlimited', personnel: 'unlimited' }
        }
      }
    });
  } catch (error) {
    console.error('Get billing status error:', error);
    res.status(500).json({
      error: 'Failed to fetch billing status',
      message: 'Internal server error'
    });
  }
});

// POST /api/billing/payments/confirm
// Admin endpoint to mark invoice as paid
router.post('/payments/confirm', validateRequest(schemas.invoicePayment), requireAdmin(), async (req, res) => {
  try {
    const { invoiceId } = req.validatedBody;

    const invoice = await InvoiceService.markInvoiceAsPaid(invoiceId);

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        invoice,
        message: 'Pro features have been unlocked'
      }
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      error: 'Failed to confirm payment',
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// POST /api/billing/payments/cancel
// Cancel pending invoice
router.post('/payments/cancel', validateRequest(schemas.invoicePayment), requireAdmin(), async (req, res) => {
  try {
    const { invoiceId } = req.validatedBody;

    const invoice = await InvoiceService.cancelInvoice(invoiceId);

    res.json({
      success: true,
      message: 'Invoice cancelled successfully',
      data: {
        invoice
      }
    });
  } catch (error) {
    console.error('Invoice cancellation error:', error);
    res.status(500).json({
      error: 'Failed to cancel invoice',
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// GET /api/billing/invoices
// Get all invoices for organisation
router.get('/invoices', requireSubscription(), async (req, res) => {
  try {
    const user = req.user;
    const organisationId = (user as any).organisationId;

    if (!organisationId) {
      return res.status(400).json({
        error: 'No Organisation',
        message: 'User must belong to an organisation'
      });
    }

    const invoices = await InvoiceService.getInvoices(organisationId);

    res.json({
      success: true,
      data: {
        invoices
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      error: 'Failed to fetch invoices',
      message: 'Internal server error'
    });
  }
});

// GET /api/billing/invoices/:id
// Get specific invoice details
router.get('/invoices/:id', requireSubscription(), async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const organisationId = (user as any).organisationId;

    if (!organisationId) {
      return res.status(400).json({
        error: 'No Organisation',
        message: 'User must belong to an organisation'
      });
    }

    const invoices = await InvoiceService.getInvoices(organisationId);
    const invoice = invoices.find(inv => inv.id === id);

    if (!invoice) {
      return res.status(404).json({
        error: 'Invoice Not Found',
        message: 'Invoice not found or access denied'
      });
    }

    res.json({
      success: true,
      data: {
        invoice
      }
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      error: 'Failed to fetch invoice',
      message: 'Internal server error'
    });
  }
});

// POST /api/billing/overdue-check
// Check and mark overdue invoices (admin only)
router.post('/overdue-check', requireAdmin(), async (req, res) => {
  try {
    await InvoiceService.checkOverdueInvoices();

    res.json({
      success: true,
      message: 'Overdue check completed'
    });
  } catch (error) {
    console.error('Overdue check error:', error);
    res.status(500).json({
      error: 'Failed to check overdue invoices',
      message: 'Internal server error'
    });
  }
});

// POST /api/billing/generate-monthly
// Generate monthly invoices (admin only)
router.post('/generate-monthly', requireAdmin(), async (req, res) => {
  try {
    const invoices = await InvoiceService.generateMonthlyInvoices();

    res.json({
      success: true,
      message: `Generated ${invoices.length} monthly invoices`,
      data: {
        invoices,
        count: invoices.length
      }
    });
  } catch (error) {
    console.error('Monthly invoice generation error:', error);
    res.status(500).json({
      error: 'Failed to generate monthly invoices',
      message: 'Internal server error'
    });
  }
});

// GET /api/billing/stats
// Get billing statistics (admin only)
router.get('/stats', requireAdmin(), async (req, res) => {
  try {
    const stats = await InvoiceService.getInvoiceStats();

    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Get billing stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch billing statistics',
      message: 'Internal server error'
    });
  }
});

// POST /api/billing/send-reminder
// Send overdue reminder (admin only)
router.post('/send-reminder', validateRequest(schemas.invoicePayment), requireAdmin(), async (req, res) => {
  try {
    const { invoiceId } = req.validatedBody;

    // Get invoice details
    try {
      const invoiceQuery = `
        SELECT i.*, o.name as organisation_name, u.email as admin_email, u.name as admin_name
        FROM invoices i
        JOIN organisations o ON i.organisation_id = o.id
        JOIN users u ON o.id = u.organisation_id AND u.role = 'admin'
        WHERE i.id = $1
      `;
      const result = await DatabaseService.query(invoiceQuery, [invoiceId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Invoice Not Found',
          message: 'Invoice not found'
        });
      }

      const invoiceData = result.rows[0];
      
      // Send overdue warning email
      await sendOverdueWarningEmail({
        organisationName: invoiceData.organisation_name,
        invoice: {
          id: invoiceData.id,
          organisationId: invoiceData.organisation_id,
          amount: invoiceData.amount,
          plan: invoiceData.plan,
          status: invoiceData.status,
          dueDate: invoiceData.due_date,
          issuedDate: invoiceData.issued_date,
          referenceNumber: invoiceData.reference_number,
          paymentMethod: invoiceData.payment_method,
          createdAt: invoiceData.created_at,
          updatedAt: invoiceData.updated_at
        },
        adminName: invoiceData.admin_name,
        adminEmail: invoiceData.admin_email
      });

      logger.info('Reminder email sent', {
        invoiceId,
        organisationId: invoiceData.organisation_id,
        adminEmail: invoiceData.admin_email
      });
    } catch (error) {
      logger.error('Failed to send reminder email', {
        error: error instanceof Error ? error.message : 'Unknown error',
        invoiceId
      });
      throw error;
    }

    res.json({
      success: true,
      message: 'Reminder email sent successfully'
    });
  } catch (error) {
    logger.error('Send reminder error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      invoiceId: req.validatedBody?.invoiceId
    });
    res.status(500).json({
      error: 'Failed to send reminder',
      message: 'Internal server error'
    });
  }
});

export default router;
