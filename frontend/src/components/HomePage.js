"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePageLayout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/auth/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const fullData = {
          ...data,
          ...data.student_profile,
          ...data.employer_profile,
        };
        setUser(fullData);
      })
      .catch(err => console.error("User fetch error:", err));
  }, []);

  const renderGreeting = () => {
    if (!user) return "Welcome!";
    if (user.role === "employer") {
      return `Welcome, ${user.company_name?.trim() || `${user.first_name} ${user.last_name}`}`;
    } else {
      return `Welcome, ${user.first_name} ${user.last_name}`;
    }
  };

  const renderSubtitle = () => {
    if (!user) return "";
    if (user.role === "employer") {
      return "Create job, internship or instruction posts, manage applications, and connect with talented students.";
    } else {
      return "Discover jobs, internships, instructions or give lessons yourself.";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <section
        className="w-full bg-gray-100 bg-gradient-to-r from-teal-100 to-cyan-100 py-20 sm:px-12 text-center sm:text-left border-2 border-gray-300 shadow-sm"
        style={{ backgroundImage: "url('/backgrounds/post-bg4.svg')", backgroundPosition: "center" }}
      >
        <div className="max-w mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex-1 space-y-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-black">{renderGreeting()}</h1>
            <p className="text-xl text-black">
              {renderSubtitle()}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center px-4 sm:px-8">
            <div className="relative -bottom-16 w-70 h-60 z-0">
              <Image src="/logo.png" alt="Logo" fill className="rounded-xl object-cover" />
            </div>
            <Image
              src="/illustrations/students_group.png"
              width={450}
              height={600}
              alt="Illustration"
              className="h-auto rounded-lg relative -top-14 z-1"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-35 px-4 sm:px-12 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Start Exploring Now</h2>
          <p className="text-gray-600 mt-2">Browse through flexible work and learning opportunities.</p>
        </div>
        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-3">
          <FeatureCard role={user?.role} title="Jobs" description="Student jobs near you." />
          <FeatureCard role={user?.role} title="Internships" description="Gain real-world experience." />
          <FeatureCard role={user?.role} title="Instructions" description="Teach and earn." />
        </div>
      </section>


      <section className="w-full py-25 ">
        <div className="w-full  bg-gray-100 border-2 border-gray-300 shadow-sm">
          <div
            className="w-full bg-cover bg-center p-8 sm:p-12 backdrop-blur-sm"
            style={{
              backgroundImage: "url('/backgrounds/post-bg4.svg')",
            }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Contact Us
          </h2>
            <form className="max-w-3xl mx-auto space-y-6">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-lg border border-gray-300 p-4 bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-lg border border-gray-300 p-4 bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
              />
              <textarea
                placeholder="Message"
                rows={3}
                className="w-full rounded-lg border border-gray-300 p-4 bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, role }) {
  const baseRoute = title.toLowerCase();
  const href = role ? `/${role}s/${baseRoute}` : `/landing/${baseRoute}`;

  return (
    <Link href={href} className="block h-full">
      <div
        className="h-full bg-gray-100 flex flex-col justify-between border-2 border-gray-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition text-center"
        style={{ backgroundImage: "url('/backgrounds/post-bg4.svg')" }}
      >
        <h3 className="text-xl font-semibold text-black">{title}</h3>
        <p className="text-gray-900 mt-2">{description}</p>
      </div>
    </Link>
  );
}
