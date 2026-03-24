import { baseTemplate } from './base.template';

export const incidentReport = (site: string) =>
  baseTemplate(`
    <tr><td align="center" style="color:#fff; font-size:20px;">Incident Report</td></tr>
    <tr><td align="center" style="color:#ccc; padding:20px;">
      A new incident was logged at ${site}.
    </td></tr>
  `);
