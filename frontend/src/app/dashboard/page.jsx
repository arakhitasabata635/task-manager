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
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks?page=${page}&search=${search}&status=${status}`,
      { withCredentials: true },
    );

    setTasks(res.data);
  };

  const checkAuth = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
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
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
      withCredentials: true,
    });

    fetchTasks();
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";

    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task.id}`,
      { status: newStatus, id: task.id },
      { withCredentials: true },
    );

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

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          background: "#ffffff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "10px",
            flex: 1,
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <input
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: "10px",
            flex: 2,
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={createTask}
          style={{
            padding: "10px 18px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Add
        </button>
      </div>

      <hr />

      <h3 style={{ marginTop: "20px" }}>Search & Filter</h3>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          background: "#ffffff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <input
          placeholder="Search task title..."
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            flex: 2,
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <select
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#f8f9fa",
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <hr />

      <h3>Tasks</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h4 style={{ marginBottom: "5px" }}>{task.title}</h4>

            <p style={{ color: "#555", marginBottom: "10px" }}>
              {task.description}
            </p>

            <span
              style={{
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                background: task.status === "completed" ? "#28a745" : "#ffc107",
                color: "#fff",
              }}
            >
              {task.status}
            </span>

            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => toggleStatus(task)}
                style={{
                  padding: "6px 12px",
                  background: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Toggle Status
              </button>

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
          </div>
        ))}
      </div>
      <br />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          marginTop: "30px",
          padding: "15px",
          background: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          style={{
            padding: "8px 16px",
            background: page === 1 ? "#ccc" : "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: page === 1 ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          ◀ Prev
        </button>

        <span
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            color: "#333",
          }}
        >
          Page {page}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          style={{
            padding: "8px 16px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
