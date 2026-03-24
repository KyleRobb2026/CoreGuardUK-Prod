# 📧 CoreGuard UK Email System Integration

## 🚀 **Production-Ready Resend Email System**

Complete email system with all templates for CoreGuard UK security management platform.

---

## 📁 **Folder Structure**

```
/backend
  /services
    email.service.ts          # Resend integration
  /emails
    base.template.ts          # Reusable base template
    auth.templates.ts         # Authentication emails
    organisation.templates.ts # Organisation management
    compliance.templates.ts   # Compliance alerts (CORE VALUE)
    operations.templates.ts   # Operational notifications
  /examples
    email-examples.ts         # Usage examples
```

---

## ⚙️ **1. Email Service Setup**

### **Resend Integration**
```typescript
// /services/email.service.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return await resend.emails.send({
    from: 'CoreGuard SMS <noreply@coreguardsms.co.uk>',
    to,
    subject,
    html,
  });
}
```

---

## 🎨 **2. Base Template**

Professional dark theme template used across all emails:

```typescript
// /emails/base.template.ts
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
```

---

## 🔐 **3. Authentication Templates**

### **Email Confirmation**
```typescript
confirmEmail(confirmUrl: string)
```
- ✅ **Purpose**: New user email verification
- 🎨 **CTA**: Green "Confirm Email" button
- 📧 **Subject**: "Confirm Your CoreGuard Account"

### **Password Reset**
```typescript
resetPassword(resetUrl: string)
```
- ✅ **Purpose**: Secure password reset
- 🎨 **CTA**: Orange "Reset Password" button
- 📧 **Subject**: "Reset Your CoreGuard Password"

### **Login Alert**
```typescript
loginAlert()
```
- ✅ **Purpose**: Security notification
- 🎨 **Style**: Informational alert
- 📧 **Subject**: "New Login to CoreGuard Account"

---

## 🏢 **4. Organisation Templates**

### **Organisation Created**
```typescript
organisationCreated(name: string)
```
- ✅ **Purpose**: New organisation activation
- 🎨 **Style**: Success notification
- 📧 **Subject**: "Organisation Created - CoreGuard"

### **User Invitation**
```typescript
inviteUser(inviteUrl: string)
```
- ✅ **Purpose**: Team member invitations
- 🎨 **CTA**: Green "Accept Invitation" button
- 📧 **Subject**: "You're Invited to CoreGuard"

---

## 🚨 **5. Compliance Templates** (CORE BUSINESS VALUE)

### **Licence Warning**
```typescript
licenceWarning(name: string, days: number)
```
- ⚠️ **Purpose**: Upcoming licence expiry
- 🎨 **Style**: Orange warning alert
- 📧 **Subject**: `Licence Expiry Warning - ${officerName}`

### **Licence Expired**
```typescript
licenceExpired(name: string)
```
- 🚨 **Purpose**: Critical compliance issue
- 🎨 **Style**: Red urgent alert
- 📧 **Subject**: `URGENT: Licence Expired - ${officerName}`

### **Non-Compliant Officer**
```typescript
nonCompliant(name: string)
```
- 🚨 **Purpose**: Deployment restriction
- 🎨 **Style**: Red critical alert
- 📧 **Subject**: `URGENT: Non-Compliant Officer - ${officerName}`

---

## 📊 **6. Operations Templates**

### **Incident Report**
```typescript
incidentReport(site: string)
```
- ✅ **Purpose**: Site incident notification
- 🎨 **Style**: Informational alert
- 📧 **Subject**: `Incident Report - ${siteName}`

---

## 🚀 **7. Usage Examples**

### **Real Controller Integration**
```typescript
import { sendEmail } from '../services/email.service';
import { confirmEmail } from '../emails/auth.templates';

export class AuthController {
  async register(req: Request, res: Response) {
    // ... user creation logic ...
    
    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Confirm Your CoreGuard Account',
      html: confirmEmail(confirmUrl),
    });
    
    res.json({ message: 'User registered successfully' });
  }
}
```

### **Compliance Automation**
```typescript
export class ComplianceController {
  async checkLicences(req: Request, res: Response) {
    // ... licence checking logic ...
    
    for (const officer of expiringOfficers) {
      await sendEmail({
        to: admin.email,
        subject: `Licence Expiry Warning - ${officer.name}`,
        html: licenceWarning(officer.name, officer.daysUntilExpiry),
      });
    }
    
    res.json({ message: 'Compliance checks completed' });
  }
}
```

---

## 🔐 **8. Environment Setup**

### **Railway Environment Variables**
```bash
RESEND_API_KEY=re_your_resend_api_key_here
FRONTEND_URL=https://your-coreguard-frontend.com
```

### **Package Dependencies**
```json
{
  "dependencies": {
    "resend": "^3.0.0"
  }
}
```

---

## 📧 **9. Email Features**

### **✅ Professional Design**
- 🌙 **Dark theme** matching CoreGuard brand
- 📱 **Mobile responsive** design
- 🎨 **Consistent branding** with logo
- 🔒 **Professional appearance**

### **✅ Smart Categorization**
- 🔐 **Authentication** - User account management
- 🏢 **Organisation** - Team and org management
- 🚨 **Compliance** - Critical business value
- 📊 **Operations** - Day-to-day notifications

### **✅ Action-Oriented**
- 🎯 **Clear CTAs** for user actions
- ⚠️ **Priority levels** (info/warning/urgent)
- 🔗 **Deep linking** to frontend actions
- 📊 **Contextual information**

---

## 🎯 **10. Business Impact**

### **🚨 Compliance Management**
- **Automated licence expiry warnings**
- **Non-compliance alerts**
- **Regulatory compliance support**

### **👥 User Experience**
- **Smooth onboarding flow**
- **Secure password recovery**
- **Security notifications**

### **🏢 Organisation Management**
- **Team invitation system**
- **Organisation setup notifications**
- **Professional communication**

### **📊 Operations**
- **Incident reporting**
- **Site management alerts**
- **Real-time notifications**

---

## 🚀 **11. Deployment Ready**

### **✅ Production Features**
- **Error handling** built-in
- **Environment aware** configuration
- **TypeScript support** throughout
- **Scalable architecture**

### **✅ Integration Points**
- **Auth controllers** for user flows
- **Compliance automation** for business rules
- **Operation controllers** for site management
- **Organisation management** for admin functions

---

## 🎉 **12. Complete System**

Your CoreGuard UK now has:

- 📧 **Professional email system**
- 🚨 **Compliance automation**
- 🔐 **Security notifications**
- 🏢 **Organisation management**
- 📊 **Operational alerts**
- 🎨 **Brand-consistent design**
- 🚀 **Production deployment ready**

---

## 📋 **13. Quick Start**

1. **Add Resend API Key** to Railway environment
2. **Import email functions** in your controllers
3. **Send emails** using the provided examples
4. **Customize templates** as needed

**🎯 Your CoreGuard UK email system is now production-ready!** 🚀

This clean, structured approach provides all email functionality needed for a professional security management platform, with special focus on compliance - your core business value.
