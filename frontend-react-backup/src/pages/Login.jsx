import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

// Zod validacija (ostaje isto)
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function Login() {
  // React Hook Form setup (ostaje isto)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  // Submit funkcija (ostaje isto)
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        data,
        { withCredentials: true }
      );
      alert("Login successful!");
      // Ovdje možeš dodati redirect ili nešto drugo
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  // Novi dizajn stranice
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(90deg, #f8fafc 55%, #e0eaff 100%)"
      }}
    >
      {/* Lijeva strana - naslov i ilustracija */}
      <div className="w-1/2 flex flex-col justify-center items-center px-8">
        {/* Logo */}
        <div className="mb-8">
          <span
            style={{
              fontWeight: "bold",
              fontSize: "3rem",
              color: "#00b4d8",
              letterSpacing: "-2px"
            }}
          >
            S
          </span>
        </div>
        {/* Glavni tekst */}
        <h1 className="text-5xl font-bold mb-4 text-slate-900 drop-shadow-lg">
          Student
        </h1>
        <p className="text-xl mb-8 text-slate-800 font-medium text-center">
          Stranica za pretrazivanje poslova, praksi i internshipa
        </p>
        {/* Ilustracija */}
        <img
          src="/student-illustration.png" // Ubaci ilustraciju u /public folder!
          alt="Student illustration"
          className="w-80 mt-8 rounded-xl"
        />
      </div>

      {/* Desna strana - login forma */}
      <div className="w-1/3 bg-white/95 rounded-2xl shadow-xl p-10 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Log in</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("email")}
            className="border border-slate-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          <input
            {...register("password")}
            type="password"
            className="border border-slate-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            placeholder="Password"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          <button
            type="submit"
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition"
          >
            Log in
          </button>
        </form>
        <div className="flex justify-between items-center mt-4 text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="text-center mt-4 text-base">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
