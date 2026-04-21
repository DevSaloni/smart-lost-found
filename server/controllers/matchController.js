import pool from "../config/db.js";

export const getUserMatchesController = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT 
                m.id as match_id,
                m.similarity_score,
                m.status as match_status,
                m.lost_report_id,
                m.found_report_id,
                r_lost.user_id as owner_user_id,
                r_found.user_id as finder_user_id,
                r1.id as my_report_id,
                r1.item_name as my_item,
                r2.id as matched_report_id,
                r2.item_name as matched_item,
                r2.image_url as matched_image,
                r2.location as matched_location,
                r2.type as matched_type
            FROM matches m
            JOIN reports r_lost ON m.lost_report_id = r_lost.id
            JOIN reports r_found ON m.found_report_id = r_found.id
            JOIN reports r1 ON (m.lost_report_id = r1.id OR m.found_report_id = r1.id)
            JOIN reports r2 ON (
                (m.lost_report_id = r2.id AND m.found_report_id = r1.id) OR 
                (m.found_report_id = r2.id AND m.lost_report_id = r1.id)
            )
            WHERE r1.user_id = $1
            ORDER BY m.similarity_score DESC;
        `;
        const { rows: matches } = await pool.query(query, [userId]);
        res.status(200).json({ success: true, matches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getMatchByIdController = async (req, res) => {
    try {
        const { matchId } = req.params;
        const query = `
            SELECT 
                m.id as match_id,
                m.similarity_score,
                m.status as match_status,
                r_lost.item_name as lost_item,
                r_lost.description as lost_desc,
                r_lost.location as lost_loc,
                r_lost.image_url as lost_img,
                r_lost.date as lost_date,
                r_lost.user_id as owner_id,
                r_found.item_name as found_item,
                r_found.description as found_desc,
                r_found.location as found_loc,
                r_found.image_url as found_img,
                r_found.date as found_date,
                r_found.user_id as finder_id
            FROM matches m
            JOIN reports r_lost ON m.lost_report_id = r_lost.id
            JOIN reports r_found ON m.found_report_id = r_found.id
            WHERE m.id = $1;
        `;
        const { rows } = await pool.query(query, [matchId]);
        if (rows.length === 0) return res.status(404).json({ error: "Match not found" });
        res.status(200).json({ success: true, match: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
