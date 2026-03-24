export function baseTemplate(content: string) {
  return `
  <html>
    <body style="margin:0; padding:0; background:#0f0f0f; font-family:Arial;">
      <table width="100%" style="padding:40px 0;">
        <tr>
          <td align="center">

            <table width="480" style="background:#1a1a1a; border-radius:8px; padding:30px;">

              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <img src="https://i.postimg.cc/WtrRtjv2/Core-Guard-SMS-Official-Logo-white-(2)-(1).png" width="160"/>
                </td>
              </tr>

              ${content}

              <tr>
                <td align="center" style="padding-top:30px; font-size:11px; color:#666;">
                  CoreGuard SMS — Secure. Compliant. Operational.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}
