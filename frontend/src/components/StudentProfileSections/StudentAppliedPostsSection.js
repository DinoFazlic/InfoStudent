"use client";

import React, { useState } from "react";
import InstructionCard from "@/components/InstructionCard";
import JobCard from "@/components/JobCard";
import InternshipCard from "@/components/InternshipCard";

export default function StudentAppliedPostsSection({
  appliedJobs,
  appliedInternships,
  appliedInstructions,
  savedJobs,
  savedInternships,
  savedInstructions,
  setSavedJobs,
  setSavedInternships,
  setSavedInstructions,
}) {
  const [activeType, setActiveType] = useState("jobs");

  const handleUnsaveJob = async (jobId) => {
    const res = await fetch(`http://localhost:8000/api/job-saves/${jobId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 204) {
      setSavedJobs((prev) => [...prev.filter((job) => job.id !== jobId)]);
    }
  };

  const handleUnsaveInternship = async (internshipId) => {
    const res = await fetch(`http://localhost:8000/api/internship-saves/${internshipId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 204) {
      setSavedInternships((prev) => [...prev.filter((i) => i.id !== internshipId)]);
    }
  };

  const handleUnsaveInstruction = async (instructionId) => {
    const res = await fetch(`http://localhost:8000/api/instruction-saves/${instructionId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 204) {
      setSavedInstructions((prev) => [...prev.filter((i) => i.id !== instructionId)]);
    }
  };

  const tabClasses = (type) =>
    `cursor-pointer px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base transition font-medium ${
      activeType === type
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-blue-600"
    }`;

  const renderPosts = (title, posts, type) => {
    if (!posts || posts.length === 0) return null;

    return (
      <div className="mb-8" key={posts.length}>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {posts.map((post) => {
            if (type === "jobs") {
              return (
                <JobCard
                  key={post.id}
                  job={post}
                  onSaveToggle={(id, newSaved) => {
                    if (!newSaved) {
                      setSavedJobs((prev) => prev.filter((job) => job.id !== id));
                    }
                  }}
                />
              );
            }
            if (type === "internships") {
              return (
                <InternshipCard
                  key={post.id}
                  item={post}
                  onSaveToggle={(id, newSaved) => {
                    if (!newSaved) {
                      setSavedInternships((prev) => prev.filter((i) => i.id !== id));
                    }
                  }}
                />
              );
            }
            if (type === "instructions") {
              return (
                <InstructionCard
                  key={post.id}
                  instruction={post}
                  onSaveToggle={(id, newSaved) => {
                    if (!newSaved) {
                      setSavedInstructions((prev) => prev.filter((i) => i.id !== id));
                    }
                  }}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  const appliedMap = {
    jobs: appliedJobs,
    internships: appliedInternships,
    instructions: appliedInstructions,
  };

  const savedMap = {
    jobs: savedJobs,
    internships: savedInternships,
    instructions: savedInstructions,
  };

  const applied = appliedMap[activeType] || [];
  const saved = savedMap[activeType] || [];

  return (
    <div className="bg-gray-100 ring-1 p-[35px] md:p-[45px] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[800px] w-full">
      <h2 className="text-[1.8rem] font-bold text-gray-800 mb-[25px] text-center">
        My Applications
      </h2>

      {/* Tabs */}
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

      {(activeType === "jobs" || activeType === "internships") && (
        <>
          {renderPosts("Applied", applied, activeType)}
          <hr className="my-4 border-gray-300" />
        </>
      )}

      {renderPosts("Saved", saved, activeType)}

      {applied.length === 0 && saved.length === 0 && (
        <p className="text-gray-500 text-center">No {activeType} posts found.</p>
      )}
    </div>
  );
}
