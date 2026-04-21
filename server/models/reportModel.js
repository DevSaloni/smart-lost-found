import pool from "../config/db.js";

export const createReportTable = async () => {
    try {
        await pool.query(
            `
    CREATE TABLE IF NOT EXISTS reports(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ,
    type VARCHAR(10) NOT NULL,
    item_name VARCHAR(255),
    category VARCHAR(100),
    location TEXT,
    date DATE,
    description TEXT,
    identifiers TEXT,
     image_url TEXT,
     alert_method VARCHAR(50),
     status VARCHAR(20) DEFAULT 'active',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `
        )
        console.log('report table created');
    } catch (err) {
        console.log('error creating report table', err);
    }
}

export const createReport = async (reportData) => {
    const {
        user_id,
        type,
        item_name,
        category,
        location,
        date,
        description,
        identifiers,
        image_url,
        alert_method
    } = reportData;

    const query = `
        INSERT INTO reports (user_id, type, item_name, category, location, date, description, identifiers, image_url, alert_method)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;

    const values = [user_id, type, item_name, category, location, date, description, identifiers, image_url, alert_method];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getUserReports = async (userId) => {
    const query = `
        SELECT * FROM reports 
        WHERE user_id = $1 
        ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

export const getReportById = async (id) => {
    const query = `SELECT * FROM reports WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
