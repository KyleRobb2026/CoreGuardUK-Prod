import { baseTemplate } from './base.template';

export const confirmEmail = (url: string) =>
  baseTemplate(`
    <tr><td align="center" style="color:#fff; font-size:20px; font-weight:bold;">Confirm Your Email</td></tr>
    <tr><td align="center" style="color:#ccc; padding:20px;">
      Activate your CoreGuard account by confirming your email.
    </td></tr>
    <tr><td align="center">
      <a href="${url}" style="background:#0EAC00; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none;">
        Confirm Email
      </a>
    </td></tr>
  `);

export const resetPassword = (url: string) =>
  baseTemplate(`
    <tr><td align="center" style="color:#fff; font-size:20px;">Reset Password</td></tr>
    <tr><td align="center" style="color:#ccc; padding:20px;">
      Reset your password securely.
    </td></tr>
    <tr><td align="center">
      <a href="${url}" style="background:#FF7F11; color:#fff; padding:12px 24px; border-radius:6px;">
        Reset Password
      </a>
    </td></tr>
  `);

export const loginAlert = () =>
  baseTemplate(`
    <tr><td align="center" style="color:#fff; font-size:20px;">New Login Detected</td></tr>
    <tr><td align="center" style="color:#ccc; padding:20px;">
      A new login to your account was detected.
    </td></tr>
  `);
