import React from "react";

export default function StudentInstructionPostsSection({ posts }) {
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
              <div
                key={post.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    Instruction
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{post.description}</p>
                {post.location && (
                  <p className="text-xs text-gray-400 mt-2">{post.location}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
