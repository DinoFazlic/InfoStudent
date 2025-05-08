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
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input mb-4 w-full border border-gray-300 rounded px-3 py-2"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="btn w-full bg-blue-500 text-white py-2 rounded" type="submit">
          Reset password
        </button>
      </form>
      {msg && <p className="text-green-600 mt-2">{msg}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
