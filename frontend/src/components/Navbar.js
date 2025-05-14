"use client";

import Link from "next/link";
import Image from "next/image";
import { FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import "@/styles/Navbar.css";


export default function Navbar() {
  const [profileHref, setProfileHref] = useState("/login");
  const [homeHref, setHomeHref] = useState("/");
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth/users/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();

        if (data.profile_photo_url) {
          setProfilePic(`http://localhost:8000${data.profile_photo_url}`);
        }

        if (data.role === "student") {
          setProfileHref("/students/student-profile");
          setHomeHref("/students/home");
        } else if (data.role === "employer") {
          setProfileHref("/employers/employer-profile");
          setHomeHref("/employers/home");
        }

        setRoleLoaded(true);
      } catch (err) {
        console.warn("User not authenticated");
        setProfileHref("/login");
        setHomeHref("/");
        setRoleLoaded(true);
      }
    };

    fetchRole();
  }, []);


  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="hidden sm:inline-block font-bold text-xl">
            <span className="text-[#0f172a]">Info</span><span className="text-[#14b8a6]">Student</span>
          </span>
        </Link>
        <div className="space-x-6 text-sm sm:text-lg font-medium text-gray-700 flex items-center">
          <Link href="/chat" className="nav-link-underline text-gray-700 transition">Chats</Link>
          <Link href="/jobs" className="nav-link-underline text-gray-700 transition">Jobs</Link>
          <Link href="/instructions" className="nav-link-underline text-gray-700 transition">Instructions</Link>
          <Link href="/internships" className="nav-link-underline text-gray-700 transition">Internships</Link>

          {roleLoaded && (
            <Link href={profileHref}>
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-9 h-9 object-cover rounded-full cursor-pointer border border-gray-300 hover:border-blue-500 transition"
                />
              ) : (
                <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:border-blue-500 transition cursor-pointer text-gray-600 bg-gray-100">
                  <FiUser size={20} />
                </div>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}