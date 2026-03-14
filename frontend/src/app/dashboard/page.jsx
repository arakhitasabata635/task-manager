"use client";

import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const encryptData = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.NEXT_PUBLIC_AES_SECRET,
  ).toString();

  return ciphertext;
};

export default function Dashboard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchTasks = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/tasks?page=${page}&search=${search}&status=${status}`,
      { withCredentials: true },
    );

    setTasks(res.data);
  };

  const checkAuth = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    checkAuth();
    fetchTasks();
  }, [page, search, status]);

  const createTask = async () => {
    const encrypted = encryptData({
      title,
      description,
      status: "pending",
    });

    await axios.post(
      "http://localhost:5000/api/tasks",
      { data: encrypted },
      { withCredentials: true },
    );

    setTitle("");
    setDescription("");

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      withCredentials: true,
    });

    fetchTasks();
  };

  return (
    <div style={{ padding: "40px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Task Dashboard</h2>

        <button
          onClick={() => router.push("/login")}
          style={{
            padding: "8px 15px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <hr />

      <h3>Create Task</h3>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px", flex: 1 }}
        />

        <input
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "8px", flex: 2 }}
        />

        <button
          onClick={createTask}
          style={{
            padding: "8px 15px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Task
        </button>
      </div>

      <hr />

      <h3>Search & Filter</h3>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="search title"
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", flex: 2 }}
        />

        <select
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <hr />

      <h3>Tasks</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "15px",
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h4>{task.title}</h4>

            <p>{task.description}</p>

            <span
              style={{
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                background: task.status === "completed" ? "#28a745" : "#ffc107",
                color: "#fff",
              }}
            >
              {task.status}
            </span>

            <br />
            <br />

            <button
              onClick={() => deleteTask(task.id)}
              style={{
                padding: "6px 12px",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <br />

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>

        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
