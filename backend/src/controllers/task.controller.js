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

//update task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title=$1, description=$2, status=$3
       WHERE id=$4 AND user_id=$5
       RETURNING *`,
      [title, description, status, id, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id=$1 AND user_id=$2
       RETURNING *`,
      [id, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//pagination

export const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const offset = (page - 1) * limit;

    const { status, search } = req.query;

    let query = `
      SELECT * FROM tasks
      WHERE user_id=$1
    `;

    let values = [req.userId];
    let index = 2;

    if (status) {
      query += ` AND status=$${index}`;
      values.push(status);
      index++;
    }

    if (search) {
      query += ` AND title ILIKE $${index}`;
      values.push(`%${search}%`);
      index++;
    }

    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
