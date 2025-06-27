"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import InternshipCard from "@/components/InternshipCard";
import InstructionCard from "@/components/InstructionCard";
import EmployerReviewsSection from "@/components/EmployerProfileSections/EmployerReviewsSection";
import StudentReviewsSection from "@/components/StudentProfileSections/StudentReviewsSection";
import axios from "axios";
import toast from "react-hot-toast";
import { getMe } from "@/utils/api/auth";
import Stars from "@/components/Stars";

// helper to group posts for EmployerPostsSection-like layout
function groupEmployerPosts(allJobs, allInternships, allInstructions, userId, userMeta) {
  const mapPost = (p) => ({
    ...p,
    author_id: p.created_by,
    authorName: userMeta.name,
    authorAvatarUrl: userMeta.avatar,
    createdAt: p.created_at,
  });
  return {
    jobs: allJobs.filter((j) => j.created_by === userId).map(mapPost),
    internships: allInternships.filter((i) => i.created_by === userId).map(mapPost),
    instructions: allInstructions.filter((ins) => ins.created_by === userId).map((ins) => ({
      ...mapPost(ins),
      createdBy: ins.created_by,
    })),
  };
}

export default function PublicProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8000/auth/users/view/${id}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "Failed to load profile");
        }
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;

    // Fetch posts (jobs, internships, instructions) in parallel
    Promise.all([
      fetch("http://localhost:8000/api/jobs", { credentials: "include" }).then(r => r.json()).catch(() => []),
      fetch("http://localhost:8000/api/internships", { credentials: "include" }).then(r => r.json()).catch(() => []),
      fetch("http://localhost:8000/api/instructions", { credentials: "include" }).then(r => r.json()).catch(() => []),
    ]).then(([allJobs, allInternships, allInstructions]) => {
      const grouped = groupEmployerPosts(
        allJobs,
        allInternships,
        allInstructions,
        user.id,
        { name: user.role === "employer" && user.employer_profile?.company_name ? user.employer_profile.company_name : fullName, avatar: user.profile_photo_url }
      );
      setPosts(grouped);
    });

    // Fetch reviews received by that user (public endpoint)
    fetch(`http://localhost:8000/reviews/received/${user.id}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [user]);

  useEffect(() => {
    getMe().then(setMe).catch(() => setMe(null));
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      toast.error("Please choose rating");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/reviews",
        { reviewee_id: user.id, rating: newReview.rating, comment: newReview.comment },
        { withCredentials: true }
      );
      toast.success("Review submitted");
      // prepend new review to list
      setReviews((prev) => [
        {
          reviewer_id: me.id,
          reviewer_name: `${me.first_name ?? ""} ${me.last_name ?? ""}`.trim() || me.email,
          rating: newReview.rating,
          comment: newReview.comment,
          avatar_url: me.profile_photo_url ? `http://localhost:8000${me.profile_photo_url}` : null,
        },
        ...prev,
      ]);
      setNewReview({ rating: 0, comment: "" });
    } catch (err) {
      console.error(err);
      toast.error("Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  return (
    <div className="min-h-screen flex flex-col items-center py-12 bg-gray-100" style={{ backgroundImage: "url('/backgrounds/post-bg4.svg')", backgroundPosition: "center" }}>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl lg:max-w-5xl">
        <div className="flex flex-col items-center">
          {user.profile_photo_url ? (
            <Image
              src={`http://localhost:8000${user.profile_photo_url}`}
              alt="Avatar"
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-600">
              {fullName ? fullName[0] : "👤"}
            </div>
          )}
          <h1 className="mt-4 text-2xl font-bold text-gray-800 text-center">
            {user.role === "employer" && user.employer_profile?.company_name
              ? user.employer_profile.company_name
              : fullName || "Unnamed"}
          </h1>
          <p className="text-gray-500 capitalize mb-1">{user.role}</p>
          {/* Average rating */}
          {reviews.length > 0 ? (
            <div className="flex items-center gap-2 mb-2">
              <Stars rating={(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1)} />
              <span className="text-gray-700 text-sm">{(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1)}/5 · {reviews.length} review{reviews.length===1?"":"s"}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm mb-2">No ratings yet</span>
          )}
          {user.city && <p className="text-gray-700">📍 {user.city}</p>}
          {user.contact_phone && <p className="text-gray-700">📞 {user.contact_phone}</p>}
          {user.email && <p className="text-gray-700 mb-4">📧 {user.email}</p>}
          <Link
            href={`/chat/${user.id}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Send Message
          </Link>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex justify-center gap-6 border-b border-gray-200">
          {[
            { key: "posts", label: "Posts" },
            { key: "reviews", label: "Reviews" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`pb-2 text-lg font-medium ${activeTab === t.key ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "posts" && (
          <div className="mt-6 space-y-10">
            {!posts ? (
              <p className="text-center text-gray-500">Loading posts…</p>
            ) : (
              [
                { arr: posts.jobs, title: "Jobs", card: (p) => <JobCard key={p.id} job={p} /> },
                { arr: posts.internships, title: "Internships", card: (p) => <InternshipCard key={p.id} item={p} /> },
                { arr: posts.instructions, title: "Instructions", card: (p) => <InstructionCard key={p.id} instruction={p} /> },
              ].map(({ arr, title, card }) =>
                arr.length === 0 ? null : (
                  <section key={title}>
                    <h3 className="text-xl font-semibold text-amber-600 mb-4">{title}</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{arr.map(card)}</div>
                  </section>
                )
              )
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-6">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500">No reviews yet.</p>
            ) : user.role === "employer" ? (
              <EmployerReviewsSection reviewsReceived={reviews} averageScore={`${(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1)}`} />
            ) : (
              <StudentReviewsSection reviewsReceived={reviews} averageScore={`${(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1)}`} />
            )}

            {/* Leave review form */}
            {me && me.id !== user.id && !reviews.some(r=>r.reviewer_id===me.id) && (
              <form onSubmit={handleReviewSubmit} className="mt-8 max-w-lg mx-auto bg-gray-50 p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Leave a review</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[1,2,3,4,5].map((star)=>(
                    <button type="button" key={star} onClick={()=>setNewReview(prev=>({...prev,rating:star}))} className={`text-2xl ${star<=newReview.rating?"text-yellow-400":"text-gray-300"}`}>★</button>
                  ))}
                  <span className="ml-2 text-gray-700">{newReview.rating}/5</span>
                </div>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Write your comment (optional)"
                  value={newReview.comment}
                  onChange={(e)=>setNewReview({...newReview, comment:e.target.value})}
                ></textarea>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-60"
                >
                  {submittingReview?"Submitting...":"Submit Review"}
                </button>
              </form>
            )}
          </div>
        )}

        {user.role === "student" && (
          <div className="mt-8 space-y-6">
            {user.biography && (
              <section>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Biography</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{user.biography}</p>
              </section>
            )}

            {user.skills && user.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((s, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full shadow-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {user.experience && (
              <section>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Experience</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{user.experience}</p>
              </section>
            )}

            {user.cv_url && (
              <section>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">CV</h2>
                <a
                  href={`http://localhost:8000${user.cv_url}`}
                  target="_blank"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition"
                >
                  View CV
                </a>
              </section>
            )}
          </div>
        )}

        {user.role === "employer" && (
          <div className="mt-8 space-y-6">
            {user.employer_profile?.company_description && (
              <section>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">About Company</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{user.employer_profile.company_description}</p>
              </section>
            )}
            {user.employer_profile?.website_url && (
              <section>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Website</h2>
                <a
                  href={user.employer_profile.website_url}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {user.employer_profile.website_url}
                </a>
              </section>
            )}
            {user.employer_profile?.address && (
              <section>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Address</h2>
                <p className="text-gray-700">{user.employer_profile.address}</p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 