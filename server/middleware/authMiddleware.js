import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Not authorized. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user exists in database to prevent foreign key errors
        const userResult = await pool.query("SELECT id, name, email, is_verified, trust_score FROM users WHERE id = $1", [decoded.id]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "User session is invalid or user was deleted." });
        }

        req.user = userResult.rows[0];
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ error: "Session expired. Please log in again." });
    }
};