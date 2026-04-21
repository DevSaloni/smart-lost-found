import pool from "../config/db.js";

// --- MESSAGING CONTROLLERS ---

export const sendMessage = async (req, res) => {
    const { match_id, receiver_id, message } = req.body;
    const sender_id = req.user.id;
    const file_url = req.file ? req.file.filename : null;

    try {
        const result = await pool.query(
            "INSERT INTO messages (match_id, sender_id, receiver_id, message, file_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [match_id, sender_id, receiver_id, message, file_url]
        );
        res.status(201).json({ success: true, message: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send message" });
    }
};

export const getMessages = async (req, res) => {
    const { match_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM messages WHERE match_id = $1 ORDER BY created_at ASC",
            [match_id]
        );
        res.status(200).json({ success: true, messages: result.rows });
    } catch (err) {
        res.status(500).json({ error: "Failed to load messages" });
    }
};

// --- HANDOFF CONTROLLERS ---

export const generateHandoffCode = async (req, res) => {
    const { match_id } = req.body;
    const owner_id = req.user.id;

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

    try {
        // Find who the finder is for this match
        const match = await pool.query(`
            SELECT m.*, r_lost.user_id as owner_user_id, r_found.user_id as finder_user_id
            FROM matches m
            JOIN reports r_lost ON m.lost_report_id = r_lost.id
            JOIN reports r_found ON m.found_report_id = r_found.id
            WHERE m.id = $1
        `, [match_id]);

        if (match.rows.length === 0) return res.status(404).json({ error: "Match not found" });
        if (match.rows[0].status === 'resolved') return res.status(400).json({ error: "This item is already marked as returned." });

        // Check if a code already exists
        const existing = await pool.query("SELECT verification_code FROM handoffs WHERE match_id = $1 AND status = 'pending'", [match_id]);
        if (existing.rows.length > 0) {
            return res.status(200).json({ success: true, code: existing.rows[0].verification_code });
        }

        const finder_id = match.rows[0].finder_user_id;

        const result = await pool.query(
            "INSERT INTO handoffs (match_id, owner_id, finder_id, verification_code) VALUES ($1, $2, $3, $4) RETURNING *",
            [match_id, owner_id, finder_id, code]
        );
        
        res.status(201).json({ success: true, code: result.rows[0].verification_code });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate code" });
    }
};

export const verifyHandoffCode = async (req, res) => {
    const { match_id, code } = req.body;
    const finder_id = req.user.id;

    try {
        const verification = await pool.query(
            "SELECT * FROM handoffs WHERE match_id = $1 AND verification_code = $2 AND status = 'pending'",
            [match_id, code]
        );

        if (verification.rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired code" });
        }

        // Update handoff status
        await pool.query(
            "UPDATE handoffs SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = $1",
            [verification.rows[0].id]
        );

        // Update match status and report status
        await pool.query("UPDATE matches SET status = 'resolved' WHERE id = $1", [match_id]);
        
        // Mark reports as resolved
        const matchData = verification.rows[0];
        await pool.query("UPDATE reports SET status = 'resolved' WHERE id IN (SELECT lost_report_id FROM matches WHERE id=$1 UNION SELECT found_report_id FROM matches WHERE id=$1)", [match_id]);

        res.status(200).json({ success: true, message: "Handoff verified! Case closed." });
    } catch (err) {
        res.status(500).json({ error: "Verification failed" });
    }
};
