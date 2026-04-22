import nodemailer from 'nodemailer';

// Mock SMS sending (In real life use Twilio)
const sendSMS = async (phone, message) => {
    console.log(`[SMS MOCK] Sending to ${phone}: ${message}`);
    return true;
};

// Email Transporter (Mock settings - user should update with real SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendExternalNotification = async (user, message, method) => {
    try {
        if (method === 'email' || method === 'EMAIL') {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'New Match Found — FindIt',
                text: message,
                html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #FF2E7E; border-radius: 10px;">
                        <h2 style="color: #FF2E7E;">FindIt — Match Alert</h2>
                        <p>${message}</p>
                        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" style="background: #FF2E7E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Match</a>
                      </div>`
            };
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${user.email}`);
        } else if (method === 'sms' || method === 'SMS') {
            // Assuming user model has a phone number field (it doesn't currently, but we can mock)
            await sendSMS(user.phone || 'Unknown', message);
        }
    } catch (error) {
        console.error('External notification failed:', error.message);
    }
};
