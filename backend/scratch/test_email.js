import dotenv from 'dotenv';
import path from 'path';
import { sendEmail } from '../utils/emailHelper.js';

// Load environment variables
dotenv.config({ path: path.resolve('d:/SaaS Tools/Dream-Lens/backend/.env') });

async function runTest() {
  console.log('--- Testing Email Utilities ---');
  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);

  const testRecipient = 'rupamdebnath2003@gmail.com'; // Testing to user's registered gmail
  
  console.log(`\n1. Sending test email to ${testRecipient}...`);
  const result = await sendEmail({
    to: testRecipient,
    subject: 'VeloraHD Test Email',
    html: '<p>This is a test email from VeloraHD server to verify email delivery.</p>'
  });
  
  console.log('Result:', result);
}

runTest().catch(console.error);
