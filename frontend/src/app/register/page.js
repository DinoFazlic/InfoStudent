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
    <section
      className="flex-1 flex items-center justify-center px-10 py-28 relative overflow-hidden"
      style={{
        backgroundImage: "url('/backgrounds/post-bg4.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 items-center bg-white/80 rounded-3xl shadow-xl ring-1 p-6 md:p-10 backdrop-blur-md">

        <div className="flex flex-col justify-center items-center px-4 sm:px-8">
          <div className="relative -bottom-12 w-50 h-50 z-0">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="rounded-xl object-cover"
            />
          </div>
          <Image
            src="/illustrations/students_group.png"
            width={320}
            height={320}
            alt="Students illustration"
            className="rounded-lg relative -top-12 z-1"
          />
        </div>

        {/* RIGHT SIDE: register form */}
        <div className="flex justify-center items-center py-4 px-4 sm:px-8">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Register
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("first_name")}
                placeholder="First Name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm -mt-2">{errors.first_name.message}</p>
              )}

              <input
                {...register("last_name")}
                placeholder="Last Name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm -mt-2">{errors.last_name.message}</p>
              )}

              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
              />
              {errors.email && (
                <p className="text-red-500 text-sm -mt-2">{errors.email.message}</p>
              )}

              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
              />
              {errors.password && (
                <p className="text-red-500 text-sm -mt-2">{errors.password.message}</p>
              )}

              <select
                {...register("role")}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800"
              >
                <option value="student">Student</option>
                <option value="employer">Employer</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm -mt-2">{errors.role.message}</p>
              )}

              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Register
              </button>
            </form>

            <div className="text-center mt-4 text-sm text-gray-700">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-cyan-700 hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );

}
