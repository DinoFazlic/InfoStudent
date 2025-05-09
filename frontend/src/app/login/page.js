"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    try {
      await axios.post("http://localhost:8000/auth/login", data, {
        withCredentials: true,
      });
      alert("Login successful!");
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid gap-10 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <Image
            src="/logo.png" 
            width={60}
            height={60}
            alt="Logo"
            className="mb-8"
          />
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Student
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            A platform for discovering <br />
            jobs, internships <br />
            and practical opportunities
          </p>
          <div className="mt-10 hidden md:block">
            <Image
              src="/illustrations/students_group.png"
              width={420}
              height={380}
              alt="Students illustration"
              priority
            />
          </div>
        </div>
  
        <div className="flex justify-center items-center">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
              Log in
            </h2>
  
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
              >
                Log in
              </button>
            </form>
  
            <div className="text-center mt-4">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="text-center mt-2 text-sm text-gray-700">
              Don’t have an account?{" "}
              <Link href="/register" className="font-semibold text-blue-600 hover:underline">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}
