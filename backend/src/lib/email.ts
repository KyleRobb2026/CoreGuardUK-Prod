import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailVerificationData {
  user: {
    email: string;
    firstName?: string;
  };
  verificationUrl: string;
}

interface ResetPasswordData {
  user: {
    email: string;
    firstName?: string;
  };
  resetUrl: string;
}

export async function sendResetPasswordEmail({ user, resetUrl }: ResetPasswordData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CoreGuard Security <noreply@coreguard-uk.co.uk>',
      to: [user.email],
      subject: 'Reset your CoreGuard password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your CoreGuard password</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #0a0a0a;
              color: #ffffff;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #f7b91c;
              margin-bottom: 10px;
            }
            .card {
              background: #171717;
              border: 1px solid #2e2e2e;
              border-radius: 12px;
              padding: 40px;
              margin-bottom: 30px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 20px;
              color: #ffffff;
            }
            .text {
              font-size: 16px;
              line-height: 1.6;
              color: #a0a0a0;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background: #f7b91c;
              color: #1e1e1e;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 30px;
            }
            .button:hover {
              background: #e6a719;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #676767;
            }
            .security-note {
              background: rgba(247, 185, 28, 0.1);
              border: 1px solid rgba(247, 185, 28, 0.3);
              border-radius: 8px;
              padding: 20px;
              margin-top: 30px;
            }
            .security-note-title {
              color: #f7b91c;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .code {
              background: #2e2e2e;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: monospace;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ CoreGuard</div>
              <div style="color: #676767; font-size: 14px;">Security Management System</div>
            </div>
            
            <div class="card">
              <h1 class="title">Reset your password</h1>
              <p class="text">
                Hi ${user.firstName || 'there'},<br><br>
                We received a request to reset your CoreGuard account password. Click the button below to create a new password.
              </p>
              
              <a href="${resetUrl}" class="button">Reset Password</a>
              
              <p class="text">
                This reset link will expire in 1 hour for security reasons. If you didn't request this password reset, you can safely ignore this email.
              </p>
              
              <div class="security-note">
                <div class="security-note-title">🔒 Security Notice</div>
                <p style="margin: 0; font-size: 14px; color: #a0a0a0;">
                  • Never share your password with anyone<br>
                  • CoreGuard will never ask for your password via email<br>
                  • Always verify you're on <span class="code">coreguard-uk.co.uk</span> before entering credentials
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>© 2024 CoreGuard UK. All rights reserved.</p>
              <p>CoreGuard Security Management System</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send reset password email:', error);
      throw new Error('Failed to send reset password email');
    }

    return data;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw error;
  }
}

export async function sendVerificationEmail({ user, verificationUrl }: EmailVerificationData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CoreGuard Security <noreply@coreguard-uk.co.uk>',
      to: [user.email],
      subject: 'Verify your CoreGuard account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your CoreGuard account</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #0a0a0a;
              color: #ffffff;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #f7b91c;
              margin-bottom: 10px;
            }
            .card {
              background: #171717;
              border: 1px solid #2e2e2e;
              border-radius: 12px;
              padding: 40px;
              margin-bottom: 30px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 20px;
              color: #ffffff;
            }
            .text {
              font-size: 16px;
              line-height: 1.6;
              color: #a0a0a0;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background: #f7b91c;
              color: #1e1e1e;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 30px;
            }
            .button:hover {
              background: #e6a719;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #676767;
            }
            .security-note {
              background: rgba(247, 185, 28, 0.1);
              border: 1px solid rgba(247, 185, 28, 0.3);
              border-radius: 8px;
              padding: 20px;
              margin-top: 30px;
            }
            .security-note-title {
              color: #f7b91c;
              font-weight: 600;
              margin-bottom: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ CoreGuard</div>
              <div style="color: #676767; font-size: 14px;">Security Management System</div>
            </div>
            
            <div class="card">
              <h1 class="title">Verify your email address</h1>
              <p class="text">
                Hi ${user.firstName || 'there'},<br><br>
                Welcome to CoreGuard! To complete your registration and secure your account, please verify your email address by clicking the button below.
              </p>
              
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
              
              <p class="text">
                This verification link will expire in 24 hours. If you didn't create an account with CoreGuard, you can safely ignore this email.
              </p>
              
              <div class="security-note">
                <div class="security-note-title">🔒 Security Notice</div>
                <p style="margin: 0; font-size: 14px; color: #a0a0a0;">
                  CoreGuard never asks for your password via email. Always verify you're on coreguard-uk.co.uk before entering credentials.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>© 2024 CoreGuard UK. All rights reserved.</p>
              <p>CoreGuard Security Management System</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }

    return data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}
