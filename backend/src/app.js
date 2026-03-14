import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/test-users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.use("/api/auth", authRoutes);

export default app;
