"use client";

import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/auth/forgot-password", null, {
        params: { email }
      });
      setResetLink(res.data.reset_link);
    } catch (err) {
      setError(err.response?.data?.detail || "Error sending reset email");
    }
  };

  return (
    <section className= "h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-50 to-cyan-100"
    style={{
        backgroundImage: "url('/backgrounds/post-bg4.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl ring p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Your Password?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Send Reset Link
          </button>
        </form>

        {resetLink && (
          <div className="mt-6 text-center">
            <p className="text-green-600 font-medium mb-2">Reset link generated:</p>
            <a
              href={resetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-blue-600 underline"
            >
              {resetLink}
            </a>
          </div>
        )}

        {error && (
          <p className="text-red-600 font-medium mt-4 text-center">{error}</p>
        )}
      </div>
    </section>
  );
}
