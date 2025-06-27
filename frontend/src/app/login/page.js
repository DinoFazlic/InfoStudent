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
    <section
      className="flex-1 flex items-center justify-center px-10 py-28 relative overflow-hidden"
      style={{
        backgroundImage: "url('/backgrounds/post-bg4.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className=" bg-gray-100 relative z-10 w-full max-w-6xl grid md:grid-cols-2 items-center  rounded-3xl shadow-2xl ring-1 p-6 md:p-10 backdrop-blur-md">
        
        <div className="flex flex-col justify-center items-center px-4 sm:px-8">
          <div className="relative -bottom-12  w-50 h-50 z-0">
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


        <div className="flex justify-center items-center py-4 px-4 sm:px-8">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg ring p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Log in
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Log in
              </button>
            </form>

            <div className="mt-4 text-sm text-center text-gray-600">
              <Link href="/forgot-password" className="text-cyan-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <div className="mt-2 text-sm text-center text-gray-700">
              Don’t have an account?{" "}
              <Link href="/register" className="font-semibold text-cyan-700 hover:underline">
                Register
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
