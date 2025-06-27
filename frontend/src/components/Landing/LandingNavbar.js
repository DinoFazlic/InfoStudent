"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "@/styles/Navbar.css";

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const homeHref = "/landing/home";

  return (
    <nav className="bg-gray-200 h-[96px] shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="object-contain"
          />
          <span className="font-bold text-xl sm:inline-block">
            <span className="text-[#0f172a]">Info</span>
            <span className="text-[#14b8a6]">Student</span>
          </span>
        </Link>

        <div className="hidden  md:flex items-center gap-6 text-gray-700 font-medium">
          <Link href="/jobs" className="nav-link-underline transition">Jobs</Link>
          <Link href="/instructions" className="nav-link-underline transition">Instructions</Link>
          <Link href="/internships" className="nav-link-underline transition">Internships</Link>

          <Link href="/login">
            <button className="px-4 py-2 bg-cyan-900 text-white rounded hover:bg-cyan-700 transition">
              Log in
            </button>
          </Link>
          <Link href="/register">
            <button className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition">
              Register
            </button>
          </Link>
        </div>

        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden  bg-gray-200 border-t border-gray-200 px-4 py-4 flex flex-col gap-4 transition-all duration-300 ease-in-out transform ${
          isMenuOpen ? "opacity-100 translate-y-0" : "hidden"
        }`}
      >
        <Link href="/landing/jobs" className="nav-link-underline transition" onClick={() => setIsMenuOpen(false)}>Jobs</Link>
        <Link href="/landing/instructions" className="nav-link-underline transition" onClick={() => setIsMenuOpen(false)}>Instructions</Link>
        <Link href="/landing/internships" className="nav-link-underline transition" onClick={() => setIsMenuOpen(false)}>Internships</Link>
        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
          <button className="w-full py-2 bg-cyan-900 text-white rounded hover:bg-cyan-700 transition">Log in</button>
        </Link>
        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
          <button className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition">Register</button>
        </Link>
      </div>
    </nav>
  );
}
