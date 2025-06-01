// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for port 465
      auth: {
        user: process.env.EMAIL_FROM, // your Brevo email
        pass: process.env.EMAIL_PASS  // your SMTP key
      }
    });

    await transporter.sendMail({
      from: `"Logbook App" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    // Optionally log to a monitoring service or write to a log file
  }
};

module.exports = sendEmail;
