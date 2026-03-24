import { baseTemplate } from './base.template';

export const licenceWarning = (name: string, days: number) =>
  baseTemplate(`
    <tr><td align="center" style="color:#FF7F11; font-size:20px;">Licence Expiring</td></tr>
    <tr><td align="center" style="color:#ccc; padding:20px;">
      ${name}'s licence expires in ${days} days.
    </td></tr>
  `);

export const licenceExpired = (name: string) =>
  baseTemplate(`
    <tr><td align="center" style="color:#FF1B1C; font-size:20px;">Licence Expired</td></tr>
    <tr><td align="center" style="color:#ccc; padding:20px;">
      ${name} is now NON-COMPLIANT.
    </td></tr>
  `);

export const nonCompliant = (name: string) =>
  baseTemplate(`
    <tr><td align="center" style="color:#FF1B1C; font-size:20px;">Non-Compliant Officer</td></tr>
    <tr><td align="center" style="color:#ccc; padding:20px;">
      ${name} cannot be deployed.
    </td></tr>
  `);
