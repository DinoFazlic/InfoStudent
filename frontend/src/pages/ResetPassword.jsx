import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await axios.post("http://localhost:8000/api/auth/reset-password", {
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
          className="input mb-4"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <button className="btn w-full" type="submit">Reset password</button>
      </form>
      {msg && <p className="text-green-600 mt-2">{msg}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
