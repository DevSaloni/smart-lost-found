import pool from "../config/db.js";
import { io } from "../index.js";
import { sendExternalNotification } from "../services/notificationService.js";

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

        // Emit real-time socket event for the message
        io.to(`user_${receiver_id}`).emit("new_message", {
            ...result.rows[0],
            sender_name: req.user.name
        });

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

        // Notify owner via SMS/Email if they have it enabled for the related report
        try {
            const owner = await pool.query("SELECT email, phone, name FROM users WHERE id = $1", [owner_id]);
            const report = await pool.query(`
                SELECT alert_method 
                FROM reports r 
                JOIN matches m ON (r.id = m.lost_report_id) 
                WHERE m.id = $1 AND r.user_id = $2
            `, [match_id, owner_id]);

            if (owner.rows.length > 0 && report.rows.length > 0) {
                const method = report.rows[0].alert_method ? report.rows[0].alert_method.toLowerCase() : '';
                if (method === 'sms') {
                    await sendExternalNotification(
                        owner.rows[0],
                        `[FindIt] Security Alert: Your recovery handoff token is ${code}. Share this ONLY with the finder when you receive your item.`,
                        'sms'
                    );
                }
            }
        } catch (notifyErr) {
            console.error("Handoff notification failed:", notifyErr.message);
        }

        res.status(201).json({ success: true, code: result.rows[0].verification_code });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate code" });
    }
};

export const verifyHandoffCode = async (req, res) => {
    const { match_id, code } = req.body;
    const current_user_id = req.user.id;
    console.log(`DEBUG - Verifying Handoff: Match=${match_id}, Code=${code}, User=${current_user_id}`);

    try {
        const verification = await pool.query(
            "SELECT * FROM handoffs WHERE match_id = $1 AND verification_code = $2 AND status = 'pending'",
            [match_id, code.toString().trim()]
        );

        if (verification.rows.length === 0) {
            console.log("DEBUG - Verification failed: No pending handoff found for this code/match.");
            return res.status(400).json({ error: "Invalid or expired code. Please ensure you have the correct 6-digit token from the owner." });
        }

        const handoff = verification.rows[0];

        // Security check: Only the finder should be verifying the code provided by the owner
        if (handoff.finder_id !== current_user_id) {
            console.log(`DEBUG - Role Mismatch: Expected Finder ${handoff.finder_id}, but got ${current_user_id}`);
            return res.status(403).json({ error: "Unauthorized. Only the person who found the item can verify the handoff token." });
        }

        // Update handoff status
        await pool.query(
            "UPDATE handoffs SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = $1",
            [handoff.id]
        );

        // Update match status and report status
        await pool.query("UPDATE matches SET status = 'resolved' WHERE id = $1", [match_id]);

        // Mark reports as resolved
        await pool.query("UPDATE reports SET status = 'resolved' WHERE id IN (SELECT lost_report_id FROM matches WHERE id=$1 UNION SELECT found_report_id FROM matches WHERE id=$1)", [match_id]);

        // Increase trust score for the finder (+10 points)
        await pool.query("UPDATE users SET trust_score = trust_score + 10 WHERE id = $1", [handoff.finder_id]);

        // Emit real-time socket event to the OWNER to refresh their dashboard
        io.to(`user_${handoff.owner_id}`).emit("handoff_completed", {
            match_id: match_id,
            message: "The finder has successfully verified the handoff! Your item is now marked as returned."
        });

        res.status(200).json({ success: true, message: "Handoff verified! Trust scores increased (+10)." });
    } catch (err) {
        console.error("Handoff verification error:", err);
        res.status(500).json({ error: "Verification failed due to a server error." });
    }
};
