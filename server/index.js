import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2016;

app.use(cors());
app.use(express.json());

//test route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database()");

    res.send(`Connected to DB: ${result.rows[0].current_database}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error connecting to DB");
  }
});


app.listen(PORT,() =>{
    console.log("sever is running on PORT:", PORT);
});