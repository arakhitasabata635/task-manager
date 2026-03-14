# Task Manager Application

A full-stack **Task Management Application** built with Next.js (Frontend) and Express.js (Backend) using Neon PostgreSQL database.

The application allows users to register, login, and manage their personal tasks securely.

---

# Tech Stack

## Frontend

- Next.js
- React
- Axios
- CryptoJS (AES Encryption)

## Backend

- Node.js
- Express.js
- JWT Authentication
- Cookie-based Authentication

## Database

- Neon PostgreSQL

## Deployment

- Frontend: Vercel
- Backend: Render

---

# Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Secure HTTP-only Cookies

## Task Management

Users can:

- Create tasks
- View tasks
- Delete tasks
- Toggle task status

## Task Features

- Pagination
- Search tasks
- Filter tasks by status
- Toggle task status (Pending / Completed)

## Security

- AES encryption for task creation
- JWT authentication
- User-specific task access
- Protected routes

---

# Project Structure

```
task-manager
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── db
│   └── server.js
│
├── frontend
│   ├── app
│   │   ├── login
│   │   ├── register
│   │   └── dashboard
│
└── README.md
```

---

# Installation Guide

Clone the repository

```
git clone https://github.com/yourusername/task-manager.git
```

```
cd task-manager
```

---

# Backend Setup

Go to backend folder

```
cd backend
```

Install dependencies

```
npm install
```

Create `.env` file

```
PORT=5000
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
AES_SECRET=your_encryption_key
```

Start backend server

```
npm run dev
```

Backend runs at

```
http://localhost:5000
```

---

# Frontend Setup

Go to frontend folder

```
cd frontend
```

Install dependencies

```
npm install
```

Create `.env.local` file

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AES_SECRET=your_encryption_key
```

Start frontend

```
npm run dev
```

Frontend runs at

```
http://localhost:3000
```

---

# API Endpoints

## Authentication

Register

```
POST /api/auth/register
```

Login

```
POST /api/auth/login
```

Get current user

```
GET /api/auth/me
```

---

## Tasks

Get tasks

```
GET /api/tasks?page=1&search=&status=
```

Create task

```
POST /api/tasks
```

Update task

```
PUT /api/tasks/:id
```

Delete task

```
DELETE /api/tasks/:id
```

---

# Environment Variables

Backend `.env`

```
PORT=
DATABASE_URL=
JWT_SECRET=
AES_SECRET=
```

Frontend `.env.local`

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_AES_SECRET=
```

---

# Deployment

Frontend deployed on Vercel

Backend deployed on Render

Database hosted on Neon PostgreSQL

Example

```
Frontend
https://your-frontend.vercel.app

Backend
https://your-backend.onrender.com
```

---

# Security

- JWT Authentication
- Cookie-based sessions
- AES encryption for task data
- User-based authorization
- CORS protection

---

# Future Improvements

- Task editing UI
- Drag and drop task board
- Task deadlines
- Email notifications

---

# Author

Your Name  
Full Stack Developer

---

# License

This project is created for assignment and educational purposes.
