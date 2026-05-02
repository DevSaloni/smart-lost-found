import pool from "../config/db.js";

export const getUserNotificationsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT * FROM notifications 
            WHERE user_id = $1 
            ORDER BY created_at DESC 
            LIMIT 50;
        `;
        const { rows: notifications } = await pool.query(query, [userId]);
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const markNotificationsAsReadController = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            UPDATE notifications 
            SET is_read = TRUE 
            WHERE user_id = $1 AND is_read = FALSE;
        `;
        await pool.query(query, [userId]);
        res.status(200).json({ success: true, message: "Notifications marked as read" });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const clearNotificationsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `DELETE FROM notifications WHERE user_id = $1;`;
        await pool.query(query, [userId]);
        res.status(200).json({ success: true, message: "Notifications cleared" });
    } catch (error) {
        console.error("Error clearing notifications:", error);
        res.status(500).json({ error: "Server error" });
    }
};
