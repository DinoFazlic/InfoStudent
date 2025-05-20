import React from "react";
import styles from "@/styles/Profile.module.css";

export default function StudentInstructionPostsSection({ posts }) {
  return (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>My Instruction Posts</h2>
      <div className={styles.profileFormWrapper}>
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
