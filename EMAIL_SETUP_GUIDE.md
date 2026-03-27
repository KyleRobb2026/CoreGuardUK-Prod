# Email Setup Guide for CoreGuard UK Waitlist

## Quick Setup (5 minutes)

### 1. Get a Resend API Key

1. **Sign up for free** at [https://resend.com](https://resend.com)
2. **Verify your email** address
3. **Get your API key** from the dashboard:
   - Go to API Keys → Create API Key
   - Copy the key (starts with `re_`)

### 2. Configure the API Key

Edit the `.env` file in the `frontend/` directory:

```bash
# Replace with your actual Resend API key
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd frontend
node simple-frontend-server.js
```

### 4. Test Email Sending

1. Go to `http://localhost:3000`
2. Enter your email in the waitlist form
3. Click "Join Waitlist"
4. Check your email for the confirmation!

## What Happens Next

- ✅ **Real emails** will be sent to waitlist signups
- ✅ **Professional email template** with CoreGuard branding
- ✅ **Error handling** if email service fails
- ⚠️ **Fallback to simulation** if no API key is configured

## Email Template Preview

The email includes:
- Welcome message with CoreGuard branding
- Launch details (April 6th, 2025 • 9:00 AM BST)
- What's next section with benefits
- Contact information

## Troubleshooting

### "Email not sent" - Check:
1. API key is correctly set in `.env`
2. No spaces or quotes around the API key
3. Server restarted after configuration
4. Check spam/junk folder

### Server logs show:
- `✅ Resend email service initialized` → Working
- `⚠️ RESEND_API_KEY not configured` → Need API key

## Production Deployment

For production (Railway, Vercel, etc.):

1. **Set environment variable** in your hosting platform:
   ```
   RESEND_API_KEY=re_your_production_api_key
   ```

2. **Verify domain** in Resend dashboard for better deliverability

3. **Monitor email logs** in Resend dashboard

## Alternative Email Services

If you prefer other services, the code can be easily adapted for:
- SendGrid
- Mailgun
- AWS SES
- Gmail SMTP

## Security Notes

- ✅ API key is loaded from environment variables
- ✅ Not committed to git (add `.env` to `.gitignore`)
- ✅ Graceful fallback if API key is missing
- ✅ Error messages don't expose sensitive information

---

**Need help?** Check the server logs or contact support@coreguard.uk
