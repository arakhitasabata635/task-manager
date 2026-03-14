"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center w-[400px]">
        <h1 className="text-3xl font-bold mb-4">Task Manager</h1>

        <p className="text-gray-500 mb-8">Manage your tasks securely</p>

        <div className="flex flex-col gap-4">
          <Link href="/login">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
