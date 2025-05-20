// components/LoggedInLanding.jsx
"use client";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import Navbar from "./Navbar";

export default function LoggedInLanding() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/posts", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška u dohvaćanju postova");
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Nešto je pošlo po zlu pri dohvaćanju objava.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[url('/post-bg-4.svg')] bg-repeat text-slate-900">
      <Navbar />
      <div className="container mx-auto px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">Dobrodošao nazad!</h1>

        {loading && <p className="text-center text-slate-600">Učitavanje objava...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
