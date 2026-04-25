import pool from "./server/config/db.js";

const runMigration = async () => {
    try {
        console.log("Adding 'phone' column to 'users' table...");
        await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);");
        console.log("Migration successful!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err.message);
        process.exit(1);
    }
};

runMigration();
