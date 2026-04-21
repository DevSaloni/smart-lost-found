import pool from "../config/db.js";

export const createNotificationTable = async () => {
    try {
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                report_id INT REFERENCES reports(id) ON DELETE CASCADE,
                type VARCHAR(50) NOT NULL, -- e.g., 'match_found', 'report_success'
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            `
        );
        console.log('Notification table initialized');
    } catch (err) {
        console.log('Error creating notification table', err);
    }
};

export const createNotification = async (notificationData) => {
    const { user_id, report_id, type, message } = notificationData;
    const query = `
        INSERT INTO notifications (user_id, report_id, type, message)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [user_id, report_id, type, message];
    const result = await pool.query(query, values);
    return result.rows[0];
};
