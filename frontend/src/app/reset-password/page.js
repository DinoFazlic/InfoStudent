"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await axios.post("http://localhost:8000/auth/reset-password", {
        token,
        new_password: newPassword
      });
      setMsg("Password reset successful! You can now log in.");
    } catch (err) {
      setError(err.response?.data?.detail || "Error resetting password");
    }
  };

return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-cyan-50 to-blue-100"
    style={{
        backgroundImage: "url('/backgrounds/post-bg4.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl ring p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Reset Password
          </button>
        </form>

        {msg && (
          <p className="text-green-600 font-medium mt-4 text-center">{msg}</p>
        )}
        {error && (
          <p className="text-red-600 font-medium mt-4 text-center">{error}</p>
        )}
      </div>
    </section>
  );
}
