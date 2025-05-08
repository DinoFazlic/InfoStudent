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
      const res = await axios.post("http://localhost:8000/api/auth/forgot-password", null, {
        params: { email }
      });
      setResetLink(res.data.reset_link); // For demo, show link
    } catch (err) {
      setError(err.response?.data?.detail || "Error sending reset email");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input mb-4"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button className="btn w-full" type="submit">Send reset link</button>
      </form>
      {resetLink && (
        <div className="mt-4">
          <p className="text-green-600">Reset link (dev/demo):</p>
          <a className="break-all text-blue-600 underline" href={resetLink}>{resetLink}</a>
        </div>
      )}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
