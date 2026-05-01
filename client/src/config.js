// In Vite, environment variables must start with VITE_
// This will use the variable set in Vercel/Render, or fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:2017";

export default BASE_URL;
