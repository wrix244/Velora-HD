import dotenv from 'dotenv';
import path from 'path';
import { sendEmail } from '../utils/emailHelper.js';

// Load environment variables
dotenv.config({ path: path.resolve('d:/SaaS Tools/Dream-Lens/backend/.env') });

async function runTest() {
  console.log('--- Testing Configurable Contact Email Send ---');
  
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'velorahdwallart@gmail.com';
  const senderEmail = process.env.SENDER_EMAIL || 'VeloraHD <onboarding@resend.dev>';
  
  const senderName = 'VeloraHD Contact Form';
  const fromAddress = senderEmail.includes('<')
    ? `${senderName} <${senderEmail.split('<')[1]}`
    : `${senderName} <${senderEmail}>`;

  console.log('From Address   :', fromAddress);
  console.log('Receiver Email :', receiverEmail);

  // Send email
  const result = await sendEmail({
    from: fromAddress,
    to: receiverEmail,
    replyTo: 'test_user@example.com',
    subject: '[VeloraHD Contact] System Email Delivery Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <div style="background-color: #6366f1; padding: 15px 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; font-weight: bold;">New Contact Form Message</h2>
        </div>
        <div style="padding: 20px; color: #333333; line-height: 1.6;">
          <p style="margin-top: 0;"><strong>Sender Name:</strong> Test Script User</p>
          <p><strong>Sender Email:</strong> <a href="mailto:test_user@example.com" style="color: #6366f1; text-decoration: none;">test_user@example.com</a></p>
          <p><strong>Subject:</strong> System Email Delivery Test</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #6366f1; border-radius: 4px; font-style: italic;">
            <p style="margin: 0; white-space: pre-wrap;">This is a test contact inquiry triggered by the automated test suite.</p>
          </div>
        </div>
        <div style="border-top: 1px solid #e0e0e0; padding: 15px 20px; text-align: center; font-size: 11px; color: #888888; background-color: #fcfcfc; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
          This email was sent from the contact form at VeloraHD.
        </div>
      </div>
    `
  });

  console.log('\nEmail Delivery Result:', result);
}

runTest().catch(console.error);
