"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const router = useRouter();     
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    try {

      const res = await axios.post(
        "/auth/login",
        data,
        { withCredentials: true }
      );

      console.log(res.data); 
      const { user } = res.data;         
      if (user.role === "student") {
        router.push("/students/home");
      } else if (user.role === "employer") {
        router.push("/employers/home");
      } else {
        router.push("/");
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#f7fafd] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid gap-10 md:grid-cols-2 items-center">
        
        {/* ← LEFT SIDE */}
        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left px-6 sm:px-10">
          {/* logo */}
          <Image
            src="/logo.png"
            width={60}
            height={60}
            alt="Logo"
            className="mb-8"
          />

          {/* big title */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4">
            Student
          </h1>

          {/* bosnian subtitle */}
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          A platform for discovering <br />
            jobs, internships <br />
            and practical opportunities
          </p>

          {/* illustration with blue block behind */}
          <div className="relative ml-0 md:ml-12 lg:ml-16">
           <div className="absolute -left-6 -top-6 w-48 h-48 bg-blue-100 rounded-xl"></div>
            <Image
              src="/illustrations/students_group.png"
              width={400}
              height={360}
              alt="Students illustration"
              className="relative"
/>
          </div>
        </div>

        {/* → RIGHT SIDE */}
        <div className="flex justify-center items-center px-6 sm:px-10">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Log in
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Log in
              </button>
            </form>

            <div className="mt-4 text-sm text-center text-gray-600">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="mt-2 text-sm text-center text-gray-700">
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
