import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (email, token) => {
    const url = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🔐 Verify Your FindIt Account",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
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
                                                Welcome to FindIt!
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="color: #555555; font-size: 16px; line-height: 24px; padding-bottom: 30px;">
                                                Thank you for joining our community. To start finding or reporting items, please verify your email address by clicking the button below.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
                                                <a href="${url}" style="background-color: #FF2E7E; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(255, 46, 126, 0.2);">
                                                    Verify Email Address
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="color: #888888; font-size: 14px; line-height: 22px; padding-top: 40px;">
                                                If the button above doesn't work, you can also copy and paste this link into your browser: <br>
                                                <a href="${url}" style="color: #FF2E7E; word-break: break-all;">${url}</a>
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
                                                If you didn't create an account, you can safely ignore this email.
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
    });
};

