import nodemailer from 'nodemailer';

/**
 * Utility function to send emails using Nodemailer with fallback logging
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 */
export const sendEmail = async ({ to, subject, html }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  // If credentials are not configured or are set to placeholder values
  const isConfigured = emailUser && emailPass && 
                       emailUser !== 'your_email@gmail.com' && 
                       emailUser !== 'your-gmail-address@gmail.com';

  if (!isConfigured) {
    console.log('\n=================== SMTP EMAIL SIMULATION ===================');
    console.log(`To      : ${to}`);
    console.log(`Subject : ${subject}`);
    console.log('-------------------- HTML Content ---------------------------');
    // Strip HTML tags for clean console display
    const textPlain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(textPlain.slice(0, 500) + (textPlain.length > 500 ? '...' : ''));
    console.log('=============================================================\n');
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"VeloraHD Wallpaper Platform" <${emailUser}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer error: Failed to send email.', error);
    // Return success: false, but don't throw an unhandled exception that crashes request
    return { success: false, error: error.message };
  }
};
