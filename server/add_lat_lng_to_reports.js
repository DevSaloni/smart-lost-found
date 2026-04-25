import pool from "./config/db.js";

const addColumns = async () => {
    try {
        await pool.query(`
            ALTER TABLE reports 
            ADD COLUMN IF NOT EXISTS lat DECIMAL(10, 7),
            ADD COLUMN IF NOT EXISTS lng DECIMAL(10, 7);
        `);
        console.log("Successfully added lat and lng columns to reports table.");
        process.exit(0);
    } catch (error) {
        console.error("Error adding columns:", error);
        process.exit(1);
    }
};

addColumns();
