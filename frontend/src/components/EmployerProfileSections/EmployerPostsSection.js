"use client";
import React, { useState } from "react";
import InstructionCard from "@/components/InstructionCard";
import JobCard from "@/components/JobCard";
import InternshipCard from "@/components/InternshipCard";
import PostApplicantsModal from "@/components/PostApplicantsModal";
import toast from "react-hot-toast";

export default function EmployerPostsSection({ posts, setEmployerPosts }) {
  const [activeType, setActiveType] = useState("jobs");
  const [selectedPost, setSelectedPost] = useState(null);

  const currentPosts = posts[activeType] || [];

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    const urlMap = {
      jobs: "jobs",
      instructions: "instructions",
      internships: "internships",
    };

    try {
      await fetch(`http://localhost:8000/api/${urlMap[activeType]}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      toast.success("Post deleted");
      setEmployerPosts((prev) => ({
        ...prev,
        [activeType]: prev[activeType].filter((p) => p.id !== id),
      }));
    } catch (err) {
      toast.error("Failed to delete post.");
      console.error(err);
    }
  };

  const tabClasses = (type) =>
    `cursor-pointer px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base transition font-medium ${
      activeType === type
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-blue-600"
    }`;

  const handleCardClick = (post) => {
    if (activeType !== "instructions") {
      setSelectedPost(post);
    }
  };

  return (
    <div className="bg-gray-100 ring-1 p-[35px] md:p-[45px] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[800px] w-full">
      <h2 className="text-[1.8rem] font-bold text-gray-800 mb-[25px] text-center">
        My Posts
      </h2>

      <div className="flex justify-center space-x-6 border-b border-gray-200 mb-6">
        {["jobs", "instructions", "internships"].map((type) => (
          <div
            key={type}
            onClick={() => setActiveType(type)}
            className={tabClasses(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
      </div>

      {currentPosts.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No {activeType} posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentPosts.map((post) => {
            const commonProps = {
              ...post,
              applied: false,
              canDelete: true,
              onDelete: () => handleDelete(post.id),
            };

            const card = activeType === "jobs"
              ? <JobCard key={post.id} job={commonProps} />
              : activeType === "internships"
              ? <InternshipCard key={post.id} item={commonProps} />
              : <InstructionCard key={post.id} instruction={commonProps} />;

            return (
              <div
                key={post.id}
                className="cursor-pointer"
                onClick={() => handleCardClick(post)}
              >
                {card}
              </div>
            );
          })}
        </div>
      )}

      {selectedPost && (
        <PostApplicantsModal
          postId={selectedPost.id}
          type={activeType}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
