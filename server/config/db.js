import pkg from "pg";
const { Pool } = pkg;

import dotenv from "dotenv";
dotenv.config();

// Avoid logging sensitive information in production
if (process.env.NODE_ENV !== 'production') {
  console.log(process.env.DATABASE_URL);
}

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

// Render databases and production environments require SSL
if (
  process.env.NODE_ENV === "production" || 
  (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("render.com"))
) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

export default pool;