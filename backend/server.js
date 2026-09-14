const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  database: "taskflow",
  host: "localhost",
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("Task Tracker Backend is running!");
});

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { text } = req.body;

    const result = await pool.query(
      "INSERT INTO tasks (text) VALUES ($1) RETURNING *",
      [text]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const result = await pool.query(
      "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM tasks WHERE id = $1",
      [id]
    );

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://127.0.0.1:${PORT}`);
});