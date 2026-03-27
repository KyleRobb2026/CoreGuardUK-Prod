// Test Resend API directly
const { Resend } = require('resend');

const resend = new Resend('re_LFrjWySQ_3CvHYo5oShzHvjtBcEWYqT88');

async function testResend() {
  try {
    console.log('🧪 Testing Resend API...');
    
    const { data, error } = await resend.emails.send({
      from: 'CoreGuard UK <onboarding@resend.dev>',
      to: ['test@example.com'],
      subject: 'Test Email',
      html: '<p>This is a test email</p>'
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      return;
    }

    console.log('✅ Resend API Working:', data);
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testResend();
