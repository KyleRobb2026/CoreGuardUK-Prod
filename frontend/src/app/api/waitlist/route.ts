import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes (in production, use a database)
const waitlist = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (waitlist.has(email)) {
      return NextResponse.json(
        { message: 'Email already registered for waitlist' },
        { status: 200 }
      );
    }

    // Add to waitlist
    waitlist.add(email);

    // Log the signup (in production, save to database)
    console.log(`Waitlist signup: ${email}`);
    console.log(`Total waitlist: ${waitlist.size} emails`);

    // Here you could also:
    // - Send confirmation email
    // - Add to email marketing service (Mailchimp, ConvertKit, etc.)
    // - Store in database
    // - Send Slack notification

    return NextResponse.json({
      message: 'Successfully joined waitlist',
      email: email,
      totalWaitlist: waitlist.size
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'CoreGuard UK Waitlist API',
    totalSignups: waitlist.size,
    launchDate: '2025-04-06T09:00:00+01:00'
  });
}
