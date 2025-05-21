"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
        <div className="mb-4 sm:mb-0">
          © 2025 InfoStudent. All rights reserved.
        </div>

        <div className="flex gap-8">
          <a href="#" aria-label="Instagram" className="hover:text-cyan-600 transition">
            <img src="/favicons/instagram_logo.svg" alt="Instagram" className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-cyan-600 transition">
            <img src="/favicons/twitter_logo.svg" alt="Twitter" className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-cyan-600 transition">
            <img src="/favicons/facebook_logo.svg" alt="Facebook" className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}