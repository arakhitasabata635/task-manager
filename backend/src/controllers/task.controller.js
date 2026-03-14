import pool from "../config/db.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, user_id)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [title, description, status || "pending", req.userId],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
