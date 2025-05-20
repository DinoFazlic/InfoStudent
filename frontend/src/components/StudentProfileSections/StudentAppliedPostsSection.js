import React, { useState } from "react";
import styles from "@/styles/Profile.module.css";

export default function StudentAppliedPostsSection({ jobs, internships, instructions }) {
  const [activeType, setActiveType] = useState("jobs");

  const dataMap = { jobs, internships, instructions };
  const currentPosts = dataMap[activeType] || [];

  const tabClasses = (type) =>
    `cursor-pointer px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base transition font-medium ${
      activeType === type
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-blue-600"
    }`;

  return (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>My Applications</h2>
      <div className={styles.profileFormWrapper}>
        <div className="flex justify-center space-x-6 border-b border-gray-200 mb-6">
          {["jobs", "internships", "instructions"].map((type) => (
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
          <p className="text-gray-500 text-center">No {activeType} applied to yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                    {activeType}
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
