"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const schema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "employer"], {
    required_error: "Role is required",
  }),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "student",
    },
  });

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8000/auth/register", data, {
        withCredentials: true,
      });
      alert("Registration successful!");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

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
              Register
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("first_name")}
                placeholder="First Name"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm -mt-2">
                  {errors.first_name.message}
                </p>
              )}

              <input
                {...register("last_name")}
                placeholder="Last Name"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm -mt-2">
                  {errors.last_name.message}
                </p>
              )}

              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800"
              />
              {errors.email && (
                <p className="text-red-500 text-sm -mt-2">
                  {errors.email.message}
                </p>
              )}

              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800"
              />
              {errors.password && (
                <p className="text-red-500 text-sm -mt-2">
                  {errors.password.message}
                </p>
              )}

              <select
                {...register("role")}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800"
              >
                <option value="student">Student</option>
                <option value="employer">Employer</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm -mt-2">{errors.role.message}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
              >
                Register
              </button>
            </form>

            <div className="text-center mt-4 text-sm text-gray-700">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
