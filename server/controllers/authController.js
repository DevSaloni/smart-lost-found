import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const signup = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await pool.query(
            "INSERT INTO users(name,email,phone,password,is_verified) VALUES($1,$2,$3,$4,$5) RETURNING *",
            [name, email, phone, hashPassword, true]
        );
        res.json({ message: "Signup successful! You can now log in." });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ error: err.message || "An error occurred during signup." });
    }
}

//email verify
export const verifyEmail = async (req, res) => {
    const token = req.params.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await pool.query(
            "UPDATE users SET is_verified = true WHERE id = $1",
            [decoded.id]
        );
        // Redirect to login with success message
        res.redirect(`${process.env.FRONTEND_URL}/auth?verified=true`);
    } catch (err) {
        console.error("Verification error:", err);
        res.redirect(`${process.env.FRONTEND_URL}/auth?verified=false`);
    }
}

import fs from "fs";
import path from "path";

const logError = (msg) => {
    const logPath = path.join(process.cwd(), "scratch", "auth_errors.log");
    const timestamp = new Date().toISOString();
    try {
        fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
    } catch (e) {
        console.error("Failed to write to log file:", e);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );
        if (user.rows.length === 0) {
            logError(`Login failed: User not found - ${email}`);
            return res.status(401).json({ message: "user not found" });
        }

        const valid = await bcrypt.compare(password, user.rows[0].password);

        if (!valid) {
            logError(`Login failed: Wrong password for ${email}`);
            return res.status(400).json({ message: "Wrong password" });
        }

        if (!user.rows[0].is_verified) {
            logError(`Login failed: Email not verified for ${email}`);
            return res.status(400).json({ message: "Verify email first" });
        }

        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET
        );

        res.json({ token });

    } catch (err) {
        logError(`Login Exception: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const googleLogin = async (req, res) => {
    const { token, email, name, googleId, isAccessToken } = req.body;
    try {
        let userData = {};

        if (isAccessToken) {
            userData = { email, name, sub: googleId };
        } else {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            userData = { email: payload.email, name: payload.name, sub: payload.sub };
        }

        let user = await pool.query("SELECT * FROM users WHERE email = $1", [userData.email]);

        if (user.rows.length === 0) {
            const placeholderPassword = await bcrypt.hash(userData.sub, 10);
            user = await pool.query(
                "INSERT INTO users(name, email, password, is_verified) VALUES($1, $2, $3, $4) RETURNING *",
                [userData.name, userData.email, placeholderPassword, true]
            );
        }

        const jwtToken = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token: jwtToken });
    } catch (err) {
        console.error("Google Login Error:", err);
        res.status(400).json({ error: "Google authentication failed" });
    }
}