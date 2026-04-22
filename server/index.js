import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoute.js";
import matchRoutes from "./routes/matchRoute.js";
import interactionRoutes from "./routes/interactionRoutes.js";

import createUserTable from "./models/userModel.js";
import { createReportTable } from "./models/reportModel.js";
import { createNotificationTable } from "./models/notificationModel.js";
import { createMatchTable } from "./models/matchModel.js";
import { createMessageTable, createHandoffTable } from "./models/interactionModel.js";
import { createContactTable } from "./models/contactModel.js";
import contactRoutes from "./routes/contactRoute.js";

// Initialize tables
createUserTable();
createReportTable();
createNotificationTable();
createMatchTable();
createMessageTable();
createHandoffTable();
createContactTable();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2016;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/contact", contactRoutes);

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

app.listen(PORT, () => {
  console.log("sever is running on PORT:", PORT);
});