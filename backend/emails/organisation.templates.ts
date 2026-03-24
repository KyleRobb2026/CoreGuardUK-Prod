import { baseTemplate } from './base.template';

export const organisationCreated = (name: string) =>
  baseTemplate(`
    <tr><td align="center" style="color:#fff; font-size:20px;">Organisation Created</td></tr>
    <tr><td align="center" style="color:#ccc; padding:20px;">
      ${name} is now active on CoreGuard.
    </td></tr>
  `);

export const inviteUser = (url: string) =>
  baseTemplate(`
    <tr><td align="center" style="color:#fff; font-size:20px;">You're Invited</td></tr>
    <tr><td align="center" style="color:#ccc; padding:20px;">
      Join your organisation on CoreGuard.
    </td></tr>
    <tr><td align="center">
      <a href="${url}" style="background:#0EAC00; color:#fff; padding:12px 24px; border-radius:6px;">
        Accept Invitation
      </a>
    </td></tr>
  `);
