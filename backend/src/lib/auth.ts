import { betterAuth } from "better-auth";
import { createAdapter } from "better-auth/adapters";
import { sendVerificationEmail, sendResetPasswordEmail } from "./email";
import { SubscriptionService } from "../services/subscriptionService";
import dotenv from "dotenv";

dotenv.config();

// Required environment variables (with fallbacks for development)
const requiredEnvVars = [
  'DATABASE_URL',
  'BETTER_AUTH_URL',
  'APP_URL',
  'RESEND_API_KEY'
] as const;

// Validate required environment variables (only in production)
if (process.env.NODE_ENV === 'production') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
} else {
  // In development, warn about missing variables but don't fail
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables in development: ${missingVars.join(', ')}`);
  }
}

// Create a simple database adapter (you'll need to implement the actual database operations)
export const auth = betterAuth({
  database: process.env.DATABASE_URL ? {
    provider: "postgres",
    url: process.env.DATABASE_URL!,
    // Note: You'll need to implement the actual database adapter
    // For now, using Better Auth's internal adapter
  } : undefined,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        // Build reset URL using APP_URL instead of localhost
        const resetUrl = `${process.env.APP_URL}/reset-password?token=${url.split('token=')[1]}`;
        
        await sendResetPasswordEmail({
          user: {
            email: user.email,
            firstName: user.name?.split(' ')[0]
          },
          resetUrl
        });
        
        // Log successful password reset request (without sensitive data)
        console.log(`Password reset requested for user: ${user.email}`);
      } catch (error) {
        console.error('Failed to send reset password email:', error);
        // Don't throw error to prevent user enumeration attacks
      }
    },
    sendVerificationEmail: async ({ user, url }) => {
      try {
        // Build verification URL using APP_URL instead of localhost
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${url.split('token=')[1]}`;
        
        await sendVerificationEmail({
          user: {
            email: user.email,
            firstName: user.name?.split(' ')[0]
          },
          verificationUrl
        });
        
        // Log successful verification email sent (without sensitive data)
        console.log(`Verification email sent to user: ${user.email}`);
      } catch (error) {
        console.error('Failed to send verification email:', error);
        // Don't throw error to prevent user enumeration attacks
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    cookie: {
      attributes: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // CSRF protection
        httpOnly: true, // Not accessible via JavaScript
        path: '/', // Available site-wide
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days in milliseconds
      }
    },
    extendSessionData: async (session, user) => {
      try {
        // Get user's organisation from session or user data
        const organisationId = (user as any).organisationId;
        if (!organisationId) {
          return session;
        }

        const subscription = await SubscriptionService.getActiveSubscription(organisationId);
        
        return {
          ...session,
          subscription: {
            plan: subscription?.plan || 'core',
            status: subscription?.status || 'inactive',
            trialEndsAt: subscription?.trialEndsAt
          }
        };
      } catch (error) {
        console.error('Failed to extend session with subscription data:', error);
        return session;
      }
    },
  },
  socialProviders: {},
  advanced: {
    generateId: false,
    crossSubDomainCookies: {
      enabled: false,
    },
    // Custom user attributes for organisation and role
    additionalUserFields: {
      organisationId: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.APP_URL!],
});
