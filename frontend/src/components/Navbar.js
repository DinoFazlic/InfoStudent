"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          InfoStudent
        </Link>

        <div className="space-x-4">
          <Link href="/profile" className="text-gray-700 hover:text-blue-600">
            Profile
          </Link>
          <Link href="/chat" className="text-gray-700 hover:text-blue-600">
            Chat
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
