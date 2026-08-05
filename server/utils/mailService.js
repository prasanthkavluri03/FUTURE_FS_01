/**
 * server/utils/mailService.js
 * Nodemailer email notification service.
 * Handles owner notifications and automated visitor thank-you replies.
 */

const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

const sendOwnerNotification = async ({ name, email, subject, message }) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
            to: process.env.OWNER_EMAIL || process.env.EMAIL_USER,
            subject: `[Portfolio] New Contact: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #6c5ce7; border-bottom: 2px solid #6c5ce7; padding-bottom: 10px;">📬 New Message Received</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #6c5ce7; border-radius: 4px;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Owner notification email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`⚠️ Owner email notification failed: ${error.message}`);
        return false;
    }
};

const sendVisitorThankYou = async ({ name, email }) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Kavluri Prasanth" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Thank you for reaching out!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #6c5ce7;">Thank you for your message, ${name}!</h2>
                    <p>I have received your message and will review it promptly.</p>
                    <p>I usually respond within 24 to 48 hours. Looking forward to connecting!</p>
                    <br>
                    <p>Best regards,<br><strong>Kavluri Prasanth</strong><br>Full Stack Developer</p>
                </div>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Visitor thank-you email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`⚠️ Visitor thank-you email failed: ${error.message}`);
        return false;
    }
};

module.exports = {
    sendOwnerNotification,
    sendVisitorThankYou
};
