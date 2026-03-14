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
    <div style={{ padding: "40px" }}>
      <h2>Task Dashboard</h2>

      <h3>Create Task</h3>

      <input
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={createTask}>Add Task</button>

      <hr />

      <h3>Search</h3>

      <input
        placeholder="search title"
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option>

        <option value="pending">Pending</option>

        <option value="completed">Completed</option>
      </select>

      <hr />

      <h3>Tasks</h3>

      {tasks.map((task) => (
        <div
          key={task.id}
          style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}
        >
          <h4>{task.title}</h4>

          <p>{task.description}</p>

          <p>Status: {task.status}</p>

          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}

      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Prev
      </button>

      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
