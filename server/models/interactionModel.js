import pool from "../config/db.js";

export const createMessageTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                match_id INT REFERENCES matches(id) ON DELETE CASCADE,
                sender_id INT REFERENCES users(id),
                receiver_id INT REFERENCES users(id),
                message TEXT,
                file_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        // Migration: Add file_url if it doesn't exist
        try {
            await pool.query("ALTER TABLE messages ADD COLUMN file_url TEXT;");
        } catch (e) {
            // Column already exists, ignore
        }
        console.log("Messages table initialized");
    } catch (err) {
        console.error("Error creating messages table:", err);
    }
};

export const createHandoffTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS handoffs (
                id SERIAL PRIMARY KEY,
                match_id INT REFERENCES matches(id) ON DELETE CASCADE,
                owner_id INT REFERENCES users(id),
                finder_id INT REFERENCES users(id),
                verification_code VARCHAR(6) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending', -- pending, completed, expired
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP
            )
        `);
        console.log("Handoffs table initialized");
    } catch (err) {
        console.error("Error creating handoffs table:", err);
    }
};
