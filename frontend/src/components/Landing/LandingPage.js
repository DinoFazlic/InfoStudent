"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      <section className="bg-gradient-to-r bg-gray-100 from-teal-100 to-cyan-100 py-10 sm:px-12 text-center sm:text-left  border-2 border-gray-300 shadow-sm"
        style={{ backgroundImage: "url('/backgrounds/post-bg4.svg')", backgroundPosition: "center"  }}
      >
        <div className="max-w mx-auto flex flex-col sm:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-black">
              Welcome to InfoStudent
            </h1>
            <p className="text-xl text-black">
              Connecting students with job, internship, and tutoring opportunities.
              Find flexible work, gain experience, or offer your knowledge — all in one place.
            </p>
            <div className="flex gap-4 items-center justify-center sm:justify-start">
              <Link href="/login">
                <button className="px-6 py-3 bg-cyan-900 text-white rounded hover:bg-cyan-700 transition">
                  Log in
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-3 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition">
                  Register
                </button>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <Image
              src="/illustrations/students_group.png"
              alt="Students illustration"
              width={500}
              height={600}
              className="h-auto"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-16 px-4 sm:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-3">
          <FeatureCard title="Jobs" description="Flexible student jobs near you." href="/landing/jobs"/>
          <FeatureCard title="Instructions" description="Help others and earn by giving lessons."  href="/landing/instructions/"/>
          <FeatureCard title="Internships" description="Gain experience through professional internships."  href="/landing/internships/"/>
        </div>
      </section>

      <section className="w-full py-16 px-4 sm:px-12 bg-gray-100 border-2 border-gray-300 shadow-sm text-center"
      style={{ backgroundImage: "url('/backgrounds/post-bg4.svg')", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold">About InfoStudent</h2>
          <p className="text-gray-700">
            InfoStudent is designed to give students direct access to local and flexible opportunities.
            Whether you're looking to earn extra money, gain practical experience, or share your skills — you're in the right place.
          </p>
        </div>
      </section>

      <section className="w-full py-20 ">
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

function FeatureCard({ title, description, href }) {
  return (
    <Link href={href} className="block h-full">
      <div className="h-full bg-gray-100 flex flex-col justify-between border-2 border-gray-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition text-center"
      style={{ backgroundImage: "url('/backgrounds/post-bg4.svg')"}}
      >
        <h3 className="text-xl font-semibold text-black">{title}</h3>
        <p className="text-gray-900 mt-2">{description}</p>
      </div>
    </Link>
  );
}
