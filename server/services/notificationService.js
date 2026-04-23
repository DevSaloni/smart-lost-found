import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Twilio Config (User should set these in .env)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client if credentials exist
const twilioClient = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

// Real SMS sending using Twilio
const sendSMS = async (phone, message) => {
    if (!phone || phone === 'Unknown') {
        console.warn('[SMS] Skipping: No phone number provided for user.');
        return false;
    }

    // Basic E.164 formatting check - Twilio requires the '+' prefix and country code
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
        // If it looks like a 10-digit Indian number, add +91
        if (formattedPhone.length === 10 && /^[6-9]/.test(formattedPhone)) {
            formattedPhone = `+91${formattedPhone}`;
            console.log(`[SMS] Auto-formatted number to ${formattedPhone}`);
        } else if (formattedPhone.length > 10) {
            // If it's longer than 10 but no plus, just add plus (assuming they put country code but no +)
            formattedPhone = `+${formattedPhone}`;
        }
    }

    if (!twilioClient) {
        console.log(`[SMS MOCK] Sending to ${formattedPhone}: ${message}`);
        console.warn('[SMS] Twilio credentials missing in .env. Falling back to mock.');
        return true;
    }

    try {
        const response = await twilioClient.messages.create({
            body: message,
            from: twilioPhone,
            to: formattedPhone
        });
        console.log(`[SMS] Notification sent successfully to ${formattedPhone}. SID: ${response.sid}`);
        return true;
    } catch (error) {
        console.error(`[SMS] Failed to send to ${formattedPhone}:`, error.message);
        return false;
    }
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
        const normalizedMethod = method ? method.toLowerCase() : '';
        console.log(`[Notification] Attempting to send via: ${normalizedMethod} to ${user.email || user.phone}`);

        if (normalizedMethod === 'email') {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: '🔍 New Match Found — FindIt',
                text: message,
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>FindIt Match Alert</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="padding: 20px 0 30px 0;">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                                    <!-- Header -->
                                    <tr>
                                        <td align="center" style="padding: 40px 0 30px 0; background-color: #FF2E7E;">
                                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">FindIt</h1>
                                            <p style="color: #ffe0eb; margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase;">Lost & Found Assistant</p>
                                        </td>
                                    </tr>
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px 40px 30px;">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td style="color: #333333; font-size: 20px; font-weight: 600; padding-bottom: 20px;">
                                                        Hi ${user.name || 'there'},
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #555555; font-size: 16px; line-height: 24px; padding-bottom: 30px;">
                                                        We have exciting news! Our smart matching system has detected a potential match for your reported item.
                                                     </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div style="background-color: #fff5f8; border-left: 4px solid #FF2E7E; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                                                            <p style="margin: 0; color: #333333; font-size: 16px; font-weight: 500; font-style: italic;">
                                                                "${message}"
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center">
                                                        <a href="${frontendUrl}/dashboard" style="background-color: #FF2E7E; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(255, 46, 126, 0.2);">
                                                            View Match Details
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #888888; font-size: 14px; line-height: 22px; padding-top: 40px;">
                                                        If you've already found your item or this match isn't correct, you can manage your reports directly from the dashboard.
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 30px 30px; background-color: #f9fafb; border-top: 1px solid #eeeeee;">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td style="color: #999999; font-size: 12px; text-align: center;">
                                                        &copy; 2026 FindIt Inc. Helping you reunite with what matters.<br>
                                                        You are receiving this because you opted for email notifications.
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>`
            };
            await transporter.sendMail(mailOptions);
            console.log(`[Email] Success: Sent to ${user.email}`);
        } else if (normalizedMethod === 'sms') {
            await sendSMS(user.phone || 'Unknown', message);
        } else {
            console.log(`[Notification] Skipped: Method is '${normalizedMethod}' (not email or sms)`);
        }
    } catch (error) {
        console.error('[Notification] Error:', error.message);
    }
};
