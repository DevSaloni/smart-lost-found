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

export const getAllReportsForBrowse = async (filters) => {
    const { type, category, status, search, sort, dateRange } = filters;
    let query = `SELECT * FROM reports WHERE 1=1`;
    const values = [];
    let paramCount = 1;

    if (type && type !== 'ALL') {
        query += ` AND type = $${paramCount++}`;
        values.push(type.toLowerCase());
    }

    if (category && category !== 'All categories') {
        query += ` AND category ILIKE $${paramCount++}`;
        values.push(`%${category}%`);
    }

    if (status && status !== 'All statuses') {
        query += ` AND status = $${paramCount++}`;
        values.push(status.toLowerCase());
    }

    if (dateRange && dateRange !== 'All time') {
        if (dateRange === 'Today') {
            query += ` AND created_at >= CURRENT_DATE`;
        } else if (dateRange === 'This week') {
            query += ` AND created_at >= CURRENT_DATE - INTERVAL '7 days'`;
        } else if (dateRange === 'This month') {
            query += ` AND created_at >= CURRENT_DATE - INTERVAL '1 month'`;
        }
    }

    if (search) {
        query += ` AND (item_name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR location ILIKE $${paramCount})`;
        values.push(`%${search}%`);
        paramCount++;
    }

    if (sort === 'Oldest first') {
        query += ` ORDER BY created_at ASC`;
    } else {
        query += ` ORDER BY created_at DESC`;
    }

    const result = await pool.query(query, values);
    return result.rows;
};
