import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";


const schema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "employer"], { required_error: "Role is required" }),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "student" }
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(
        "http://localhost:8000/api/auth/register",
        data,
        { withCredentials: true }
      );
      alert("Registration successful! You can now log in.");
      
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow"
      >
      <h2 className="text-2xl font-bold mb-6">Register</h2>

      <div className="mb-3">
        <input {...register("first_name")} placeholder="First Name" className="input" />
        {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
      </div>
      <div className="mb-3">
        <input {...register("last_name")} placeholder="Last Name" className="input" />
        {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
      </div>
      <div className="mb-3">
        <input {...register("email")} placeholder="Email" className="input" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div className="mb-3">
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="input"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      <div className="mb-3">
        <select {...register("role")} className="input">
          <option value="student">Student</option>
          <option value="employer">Employer</option>
        </select>
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}
      </div>

        <button type="submit" className="btn mt-6 w-full">
          Register
        </button>
      </form>

      <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </div>
    
  );
}
