import nodemailer from 'nodemailer';

// @desc    Send contact email via Nodemailer
// @route   POST /api/contact
// @access  Public
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || emailUser;

    // If credentials are not configured
    if (!emailUser || !emailPass || emailUser === 'your-gmail-address@gmail.com') {
      console.warn('Nodemailer SMTP credentials are not configured in .env. Logging message instead:');
      console.log(`--- CONTACT INQUIRY ---\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n----------------------`);
      
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured on the server. Please check the EMAIL_USER and EMAIL_PASS variables.'
      });
    }

    // Configure the Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Email content options
    const mailOptions = {
      from: `"${name}" <${emailUser}>`,
      to: receiverEmail,
      replyTo: email, // Allows direct replies to the sender
      subject: `[VeloraHD Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
          <div style="background-color: #6366f1; padding: 15px 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px; font-weight: bold;">New Contact Form Message</h2>
          </div>
          <div style="padding: 20px; color: #333333; line-height: 1.6;">
            <p style="margin-top: 0;"><strong>Sender Name:</strong> ${name}</p>
            <p><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #6366f1; text-decoration: none;">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #6366f1; border-radius: 4px; font-style: italic;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="border-top: 1px solid #e0e0e0; padding: 15px 20px; text-align: center; font-size: 11px; color: #888888; background-color: #fcfcfc; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
            This email was sent from the contact form at VeloraHD.
          </div>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Nodemailer error:', error);
    res.status(500).json({ success: false, message: 'Failed to send your message. Please try again later.' });
  }
};

// @desc    Send DMCA complaint email via Nodemailer
// @route   POST /api/contact/dmca
// @access  Public
export const sendDmcaEmail = async (req, res) => {
  try {
    const {
      reporterName,
      reporterEmail,
      reporterPhone,
      copyrightOwner,
      infringingUrl,
      workDescription,
      infringementDetails,
      goodFaithCheck1,
      goodFaithCheck2,
    } = req.body;

    // Validation
    if (
      !reporterName ||
      !reporterEmail ||
      !copyrightOwner ||
      !infringingUrl ||
      !workDescription ||
      !infringementDetails ||
      !goodFaithCheck1 ||
      !goodFaithCheck2
    ) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields and accept the declarations.' });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || emailUser;

    // If credentials are not configured
    if (!emailUser || !emailPass || emailUser === 'your-gmail-address@gmail.com') {
      console.warn('Nodemailer SMTP credentials are not configured in .env. Logging DMCA notice instead:');
      console.log(
        `--- DMCA NOTICE ---\nReporter: ${reporterName}\nEmail: ${reporterEmail}\nPhone: ${reporterPhone}\nOwner: ${copyrightOwner}\nInfringing URL: ${infringingUrl}\nWork Desc: ${workDescription}\nInfringement Details: ${infringementDetails}\n-------------------`
      );
      
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured on the server. Please check the EMAIL_USER and EMAIL_PASS variables.'
      });
    }

    // Configure the Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Email content options
    const mailOptions = {
      from: `"VeloraHD DMCA Portal" <dmca@velorahd.in>`,
      to: receiverEmail,
      replyTo: reporterEmail,
      subject: `[VeloraHD DMCA Complaint] Infringement Claim by ${reporterName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
          <div style="background-color: #dc2626; padding: 15px 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px; font-weight: bold;">DMCA Copyright Infringement Notice</h2>
          </div>
          <div style="padding: 20px; color: #333333; line-height: 1.6;">
            <p style="margin-top: 0; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; font-weight: bold; color: #111827;">Reporter Details</p>
            <p style="margin: 8px 0;"><strong>Legal Name:</strong> ${reporterName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${reporterEmail}" style="color: #dc2626; text-decoration: none;">${reporterEmail}</a></p>
            <p style="margin: 8px 0;"><strong>Phone / Contact:</strong> ${reporterPhone || 'Not provided'}</p>
            <p style="margin: 8px 0;"><strong>Copyright Owner Name:</strong> ${copyrightOwner}</p>

            <p style="margin-top: 25px; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; font-weight: bold; color: #111827;">Infringement Information</p>
            <p style="margin: 8px 0;"><strong>URL of Infringing Material:</strong> <a href="${infringingUrl}" target="_blank" style="color: #dc2626; text-decoration: none;">${infringingUrl}</a></p>
            
            <p style="margin: 15px 0 5px 0;"><strong>Description of Original Work:</strong></p>
            <div style="padding: 10px 15px; background-color: #f9fafb; border-left: 4px solid #9ca3af; border-radius: 4px; font-style: italic; white-space: pre-wrap; font-size: 13px;">${workDescription}</div>
            
            <p style="margin: 15px 0 5px 0;"><strong>Description of Infringement:</strong></p>
            <div style="padding: 10px 15px; background-color: #f9fafb; border-left: 4px solid #dc2626; border-radius: 4px; font-style: italic; white-space: pre-wrap; font-size: 13px;">${infringementDetails}</div>

            <p style="margin-top: 25px; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; font-weight: bold; color: #111827;">Statements & Signature</p>
            <p style="margin: 8px 0;">✅ <strong>Good Faith Belief:</strong> Confirmed</p>
            <p style="margin: 8px 0;">✅ <strong>Accuracy & Penalty statement:</strong> Confirmed</p>
            <p style="margin: 15px 0 8px 0;"><strong>Digital Signature (Type-written Name):</strong> ${reporterName}</p>
          </div>
          <div style="border-top: 1px solid #e0e0e0; padding: 15px 20px; text-align: center; font-size: 11px; color: #888888; background-color: #fcfcfc; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
            This DMCA notice was submitted via the Copyright DMCA Form at VeloraHD.
          </div>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Your DMCA complaint has been submitted successfully!' });
  } catch (error) {
    console.error('Nodemailer DMCA error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit your complaint. Please try again later.' });
  }
};
