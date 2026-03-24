// Example usage of CoreGuard Email System
// Import these into your controllers/routes as needed

import { sendEmail } from '../services/email.service';
import { 
  confirmEmail, 
  resetPassword, 
  loginAlert 
} from '../emails/auth.templates';
import { 
  organisationCreated, 
  inviteUser 
} from '../emails/organisation.templates';
import { 
  licenceWarning, 
  licenceExpired, 
  nonCompliant 
} from '../emails/compliance.templates';
import { 
  incidentReport 
} from '../emails/operations.templates';

// 🔐 AUTH EMAIL EXAMPLES
export async function sendConfirmationEmail(userEmail: string, confirmUrl: string) {
  await sendEmail({
    to: userEmail,
    subject: 'Confirm Your CoreGuard Account',
    html: confirmEmail(confirmUrl),
  });
}

export async function sendPasswordResetEmail(userEmail: string, resetUrl: string) {
  await sendEmail({
    to: userEmail,
    subject: 'Reset Your CoreGuard Password',
    html: resetPassword(resetUrl),
  });
}

export async function sendLoginAlertEmail(userEmail: string) {
  await sendEmail({
    to: userEmail,
    subject: 'New Login to CoreGuard Account',
    html: loginAlert(),
  });
}

// 🏢 ORGANISATION EMAIL EXAMPLES
export async function sendOrganisationCreatedEmail(adminEmail: string, orgName: string) {
  await sendEmail({
    to: adminEmail,
    subject: 'Organisation Created - CoreGuard',
    html: organisationCreated(orgName),
  });
}

export async function sendUserInvitationEmail(userEmail: string, inviteUrl: string) {
  await sendEmail({
    to: userEmail,
    subject: 'You\'re Invited to CoreGuard',
    html: inviteUser(inviteUrl),
  });
}

// 🚨 COMPLIANCE EMAIL EXAMPLES
export async function sendLicenceWarningEmail(adminEmail: string, officerName: string, daysUntilExpiry: number) {
  await sendEmail({
    to: adminEmail,
    subject: `Licence Expiry Warning - ${officerName}`,
    html: licenceWarning(officerName, daysUntilExpiry),
  });
}

export async function sendLicenceExpiredEmail(adminEmail: string, officerName: string) {
  await sendEmail({
    to: adminEmail,
    subject: `URGENT: Licence Expired - ${officerName}`,
    html: licenceExpired(officerName),
  });
}

export async function sendNonCompliantEmail(adminEmail: string, officerName: string) {
  await sendEmail({
    to: adminEmail,
    subject: `URGENT: Non-Compliant Officer - ${officerName}`,
    html: nonCompliant(officerName),
  });
}

// 📊 OPERATIONS EMAIL EXAMPLES
export async function sendIncidentReportEmail(adminEmail: string, siteName: string) {
  await sendEmail({
    to: adminEmail,
    subject: `Incident Report - ${siteName}`,
    html: incidentReport(siteName),
  });
}

// 🚀 REAL CONTROLLER USAGE EXAMPLE
/*
export class AuthController {
  
  async register(req: Request, res: Response) {
    // ... user creation logic ...
    
    // Send confirmation email
    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email/${token}`;
    await sendConfirmationEmail(user.email, confirmUrl);
    
    res.json({ message: 'User registered successfully' });
  }
  
  async forgotPassword(req: Request, res: Response) {
    // ... password reset logic ...
    
    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);
    
    res.json({ message: 'Password reset email sent' });
  }
  
  async login(req: Request, res: Response) {
    // ... authentication logic ...
    
    // Send login alert (optional)
    await sendLoginAlertEmail(user.email);
    
    res.json({ token });
  }
}

export class ComplianceController {
  
  async checkLicences(req: Request, res: Response) {
    // ... licence checking logic ...
    
    for (const officer of expiringOfficers) {
      await sendLicenceWarningEmail(admin.email, officer.name, officer.daysUntilExpiry);
    }
    
    for (const officer of expiredOfficers) {
      await sendLicenceExpiredEmail(admin.email, officer.name);
      await sendNonCompliantEmail(admin.email, officer.name);
    }
    
    res.json({ message: 'Compliance checks completed' });
  }
}
*/
