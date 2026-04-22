import pool from '../config/db.js';

const migrate = async () => {
    try {
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0;');
        console.log('Successfully added trust_score column to users table.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
