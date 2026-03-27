// Resend Domain Setup Script
// Run this once to set up your custom domain

const { Resend } = require('resend');

// Initialize Resend with your API key
const resend = new Resend('re_LFrjWySQ_3CvHYo5oShzHvjtBcEWYqT88');

async function setupDomain() {
  try {
    console.log('🚀 Setting up Resend domain: mail@no-reply.coreguardsms.co.uk');
    
    // Create the domain
    const { data, error } = await resend.domains.create({
      name: 'coreguardsms.co.uk',
    });

    if (error) {
      console.error('❌ Error creating domain:', error);
      return;
    }

    console.log('✅ Domain created successfully!');
    console.log('📋 Next steps:');
    console.log('1. Go to your DNS provider for coreguardsms.co.uk');
    console.log('2. Add the DNS records shown in Resend dashboard');
    console.log('3. Wait for DNS verification (usually 5-10 minutes)');
    console.log('4. Verify the domain in Resend dashboard');
    console.log('5. Add mail@no-reply.coreguardsms.co.uk as a verified sender');
    console.log('\n📧 Once verified, emails will be sent from mail@no-reply.coreguardsms.co.uk');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Run the setup
setupDomain();
