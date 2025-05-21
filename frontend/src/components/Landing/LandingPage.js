"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-gradient-to-r from-teal-100 to-cyan-100 py-16 px-4 sm:px-12 text-center sm:text-left"
        style={{ backgroundImage: "url('/backgrounds/post-bg4.svg')" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
              Welcome to InfoStudent
            </h1>
            <p className="text-xl text-black-700">
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
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-16 px-4 sm:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-3">
          <FeatureCard title="Jobs" description="Flexible student jobs near you." />
          <FeatureCard title="Instructions" description="Help others and earn by giving lessons." />
          <FeatureCard title="Internships" description="Gain experience through professional internships." />
        </div>
      </section>

      <section className="w-full py-16 px-4 sm:px-12 bg-gray-50 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold">About InfoStudent</h2>
          <p className="text-gray-700">
            InfoStudent is designed to give students direct access to local and flexible opportunities.
            Whether you're looking to earn extra money, gain practical experience, or share your skills — you're in the right place.
          </p>
        </div>
      </section>

      <section className="w-full py-16 px-4 sm:px-12 bg-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-6">Contact Us</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 p-3 rounded"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 p-3 rounded"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="w-full border border-gray-300 p-3 rounded"
            />
            <button
              type="submit"
              className="w-full bg-cyan-600 text-white py-3 rounded hover:bg-cyan-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition text-center">
      <h3 className="text-xl font-semibold text-cyan-700">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}
