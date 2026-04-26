import pool from "../config/db.js";

export const createMatchTable = async () => {
    try {
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS matches (
                id SERIAL PRIMARY KEY,
                lost_report_id INT REFERENCES reports(id) ON DELETE CASCADE,
                found_report_id INT REFERENCES reports(id) ON DELETE CASCADE,
                similarity_score INT, -- percentage 0-100
                match_reason TEXT,
                status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(lost_report_id, found_report_id)
            )
            `
        );
        console.log('Match table initialized');
    } catch (err) {
        console.log('Error creating match table', err);
    }
};

export const createMatch = async (matchData) => {
    const { lost_report_id, found_report_id, similarity_score, match_reason } = matchData;
    const query = `
        INSERT INTO matches (lost_report_id, found_report_id, similarity_score, match_reason)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (lost_report_id, found_report_id) DO UPDATE 
        SET similarity_score = EXCLUDED.similarity_score,
            match_reason = EXCLUDED.match_reason
        RETURNING *;
    `;
    const values = [lost_report_id, found_report_id, similarity_score, match_reason];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getMatchesByReportId = async (reportId) => {
    const query = `
        SELECT m.*, r.item_name, r.image_url, r.location, r.type as match_type
        FROM matches m
        JOIN reports r ON (m.lost_report_id = r.id OR m.found_report_id = r.id)
        WHERE (m.lost_report_id = $1 OR m.found_report_id = $1)
        AND r.id != $1;
    `;
    const result = await pool.query(query, [reportId]);
    return result.rows;
};
