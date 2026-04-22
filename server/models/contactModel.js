import pool from "../config/db.js";

export const createContactTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                topic VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("contact table created");
    } catch (err) {
        console.log("error creating contact table", err);
    }
};

export const createContactMessage = async (name, email, topic, message) => {
    const query = `
        INSERT INTO contacts (name, email, topic, message)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const result = await pool.query(query, [name, email, topic, message]);
    return result.rows[0];
};
