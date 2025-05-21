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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const handlePhotoUpdate = (e) => {
      const updatedUrl = e.detail.url;
      setProfilePic(`http://localhost:8000${updatedUrl}?t=${Date.now()}`);
    };

    window.addEventListener("profilePhotoUpdated", handlePhotoUpdate);
    return () => {
      window.removeEventListener("profilePhotoUpdated", handlePhotoUpdate);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
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

        <div className="flex items-center space-x-6 text-sm sm:text-lg font-medium text-gray-700">
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/chat" className="nav-link-underline transition">Chats</Link>
            <Link href="/jobs" className="nav-link-underline transition">Jobs</Link>
            <Link href="/instructions" className="nav-link-underline transition">Instructions</Link>
            <Link href="/internships" className="nav-link-underline transition">Internships</Link>
          </div>

          {roleLoaded && (
            <Link href={profileHref}>
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-[45px] h-[45px] aspect-square object-cover rounded-full cursor-pointer border border-gray-300 hover:border-blue-500 transition"
                />
              ) : (
                <div className="w-[45px] h-[45px] flex items-center justify-center rounded-full border border-gray-300 hover:border-blue-500 transition cursor-pointer text-gray-600 bg-gray-100">
                  <FiUser size={20} />
                </div>
              )}
            </Link>
          )}

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
      </div>

      <div
        className={`md:hidden bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-4 transition-all duration-300 ease-in-out transform ${
          isMenuOpen ? "opacity-100 translate-y-0" : "hidden"
        }`}
      >
        <Link href="/chat" className="nav-link-underline transition" onClick={() => setIsMenuOpen(false)}>Chats</Link>
        <Link href="/jobs" className="nav-link-underline transition" onClick={() => setIsMenuOpen(false)}>Jobs</Link>
        <Link href="/instructions" className="nav-link-underline transition" onClick={() => setIsMenuOpen(false)}>Instructions</Link>
        <Link href="/internships" className="nav-link-underline transition" onClick={() => setIsMenuOpen(false)}>Internships</Link>
      </div>
    </nav>
  );
}
