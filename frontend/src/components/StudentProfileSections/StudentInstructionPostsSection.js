"use client";
import React from "react";
import toast from "react-hot-toast";
import InstructionCard from "@/components/InstructionCard";

export default function StudentInstructionPostsSection({ posts, setInstructionPosts }) {
  return (
    <div className="bg-gray-100 ring-1 p-[35px] md:p-[45px] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[800px] w-full">
      <h2 className="text-[1.8rem] font-bold text-gray-800 mb-[25px] text-center">
        My Instruction Posts
      </h2>
      <div className="flex flex-col gap-5">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No instruction posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <InstructionCard
                key={post.id}
                instruction={{
                  ...post,
                  canDelete: true,
                  onDelete: async (id) => {
                    const confirmed = confirm("Are you sure you want to delete this post?");
                    if (!confirmed) return;
                    try {
                      await fetch(`http://localhost:8000/api/instructions/${id}`, {
                        method: "DELETE",
                        credentials: "include",
                      });
                      toast.success("Instruction deleted");
                      setInstructionPosts((prev) => prev.filter((p) => p.id !== id));
                    } catch (err) {
                      toast.error("Failed to delete instruction.");
                      console.error(err);
                    }
                  },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
