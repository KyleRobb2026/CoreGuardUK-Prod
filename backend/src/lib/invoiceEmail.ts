import { Resend } from 'resend';
import { Invoice } from '../services/invoiceService';

const resend = new Resend(process.env.RESEND_API_KEY!);

interface InvoiceEmailData {
  organisationName: string;
  invoice: Invoice;
  adminName: string;
  adminEmail: string;
}

export async function sendInvoiceEmail(data: InvoiceEmailData): Promise<void> {
  const { organisationName, invoice, adminName, adminEmail } = data;
  
  const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const issuedDate = new Date(invoice.issuedDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CoreGuard UK - Invoice ${invoice.referenceNumber}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .header {
          background: #171717;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .header p {
          margin: 5px 0 0 0;
          opacity: 0.8;
          font-size: 14px;
        }
        .content {
          background: white;
          padding: 40px;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .invoice-header {
          border-bottom: 2px solid #f7b91c;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .invoice-header h2 {
          margin: 0;
          color: #171717;
          font-size: 20px;
        }
        .invoice-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .detail-box {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          border-left: 4px solid #f7b91c;
        }
        .detail-box h3 {
          margin: 0 0 10px 0;
          color: #171717;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .detail-box p {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        .payment-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .payment-info h3 {
          margin: 0 0 15px 0;
          color: #856404;
          font-size: 16px;
        }
        .payment-info ul {
          margin: 0;
          padding-left: 20px;
          color: #856404;
        }
        .payment-info li {
          margin-bottom: 8px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          color: #6c757d;
          font-size: 12px;
        }
        .amount {
          font-size: 24px;
          font-weight: 700;
          color: #f7b91c;
        }
        .reference {
          font-family: monospace;
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 600;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-pending {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🛡️ CoreGuard UK</h1>
        <p>Security Management Software</p>
      </div>
      
      <div class="content">
        <div class="invoice-header">
          <h2>Invoice ${invoice.referenceNumber}</h2>
          <p><span class="status-badge status-pending">Payment Pending</span></p>
        </div>

        <div class="invoice-details">
          <div class="detail-box">
            <h3>Organisation</h3>
            <p>${organisationName}</p>
          </div>
          
          <div class="detail-box">
            <h3>Plan</h3>
            <p>${invoice.plan.charAt(0).toUpperCase() + invoice.plan.slice(1)} Plan</p>
          </div>
          
          <div class="detail-box">
            <h3>Amount Due</h3>
            <p class="amount">£${invoice.amount.toFixed(2)}</p>
          </div>
          
          <div class="detail-box">
            <h3>Due Date</h3>
            <p>${dueDate}</p>
          </div>
        </div>

        <div class="payment-info">
          <h3>💳 Payment Instructions</h3>
          <ul>
            <li><strong>Payment Method:</strong> Bank Transfer</li>
            <li><strong>Reference:</strong> Use reference number <span class="reference">${invoice.referenceNumber}</span></li>
            <li><strong>Account Name:</strong> CoreGuard UK Limited</li>
            <li><strong>Sort Code:</strong> 12-34-56</li>
            <li><strong>Account Number:</strong> 12345678</li>
            <li><strong>Amount:</strong> £${invoice.amount.toFixed(2)}</li>
          </ul>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #171717;">📋 What's Included</h3>
          ${invoice.plan === 'pro' ? `
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li>Everything in Core Plan</li>
              <li>🚨 Licence Expiry Alerts</li>
              <li>📝 Incident Logging System</li>
              <li>📊 Reporting Dashboard</li>
              <li>🔍 Compliance Monitoring</li>
              <li>Priority Email Support</li>
            </ul>
          ` : invoice.plan === 'custom' ? `
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li>Everything in Pro Plan</li>
              <li>Custom Feature Development</li>
              <li>Dedicated Support</li>
              <li>SLA Agreements</li>
              <li>Advanced Compliance Controls</li>
              <li>API Access</li>
            </ul>
          ` : `
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li>Unlimited Users & Sites</li>
              <li>Personnel Management</li>
              <li>Site Management</li>
              <li>Licence Tracking</li>
              <li>Basic Dashboard</li>
              <li>Email Support</li>
            </ul>
          `}
        </div>

        <div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 10px 0; color: #0c5460;">⚠️ Important Notice</h3>
          <p style="margin: 0; color: #0c5460;">
            Your Pro features will be unlocked once payment is received. 
            If payment is not received by ${dueDate}, your access to Pro features will be restricted.
          </p>
        </div>

        <div class="footer">
          <p>Issued: ${issuedDate} | Due: ${dueDate}</p>
          <p>© 2024 CoreGuard UK. All rights reserved.</p>
          <p>For support, please email: accounts@coreguard.uk</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'accounts@coreguard.uk',
      to: adminEmail,
      subject: `CoreGuard UK - Invoice ${invoice.referenceNumber}`,
      html: emailHtml,
    });
    
    console.log(`Invoice email sent to ${adminEmail} for ${organisationName}`);
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    throw new Error('Failed to send invoice email');
  }
}

export async function sendOverdueWarningEmail(data: InvoiceEmailData): Promise<void> {
  const { organisationName, invoice, adminName, adminEmail } = data;
  
  const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CoreGuard UK - Overdue Invoice Warning</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .header {
          background: #dc3545;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: white;
          padding: 40px;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .warning-box {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .warning-box h2 {
          margin: 0 0 15px 0;
          color: #721c24;
        }
        .invoice-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 30px;
        }
        .amount {
          font-size: 24px;
          font-weight: 700;
          color: #dc3545;
        }
        .reference {
          font-family: monospace;
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⚠️ Overdue Invoice Warning</h1>
        <p>CoreGuard UK - Security Management Software</p>
      </div>
      
      <div class="content">
        <div class="warning-box">
          <h2>Immediate Action Required</h2>
          <p>
            Your invoice <span class="reference">${invoice.referenceNumber}</span> for £${invoice.amount.toFixed(2)} 
            was due on ${dueDate} and remains unpaid.
          </p>
          <p><strong>Your access to Pro features has been restricted.</strong></p>
        </div>

        <div class="invoice-details">
          <h3>Invoice Details</h3>
          <p><strong>Organisation:</strong> ${organisationName}</p>
          <p><strong>Plan:</strong> ${invoice.plan.charAt(0).toUpperCase() + invoice.plan.slice(1)}</p>
          <p><strong>Amount:</strong> <span class="amount">£${invoice.amount.toFixed(2)}</span></p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
          <p><strong>Reference:</strong> <span class="reference">${invoice.referenceNumber}</span></p>
        </div>

        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #856404;">💳 To Restore Access</h3>
          <p style="margin: 0; color: #856404;">
            Please make payment immediately using bank transfer with reference ${invoice.referenceNumber}. 
            Once payment is received, your Pro features will be restored automatically.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #6c757d; font-size: 14px;">
            For assistance, please contact: accounts@coreguard.uk
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'accounts@coreguard.uk',
      to: adminEmail,
      subject: `URGENT: Overdue Invoice ${invoice.referenceNumber} - CoreGuard UK`,
      html: emailHtml,
    });
    
    console.log(`Overdue warning email sent to ${adminEmail} for ${organisationName}`);
  } catch (error) {
    console.error('Failed to send overdue warning email:', error);
    throw new Error('Failed to send overdue warning email');
  }
}
