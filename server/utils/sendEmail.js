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
        subject: "Verify Your Email",
        html: `<h3>Click to verify</h3><a href="${url}">Verify Email</a>`,

    });
};

