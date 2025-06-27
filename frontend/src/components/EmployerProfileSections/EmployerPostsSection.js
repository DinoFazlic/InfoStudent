"use client";

import React, { useState, useEffect } from "react";
import InstructionCard from "@/components/InstructionCard";
import JobCard from "@/components/JobCard";
import InternshipCard from "@/components/InternshipCard";
import PostApplicantsModal from "@/components/PostApplicantsModal";
import toast from "react-hot-toast";
import { getMe } from "@/utils/api/auth";

export default function EmployerPostsSection({ posts, setEmployerPosts }) {
  const [activeType, setActiveType] = useState("jobs");
  const [selectedPost, setSelectedPost] = useState(null);
  const [me, setMe] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    title: "",
    description: "",
    location: "",
    price: "",
    subject: "",
    hourly_rate: "",
    contact_info: "",
    stipend: "",
    application_deadline: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    getMe().then(setMe).catch(() => null);
  }, []);

  const currentPosts = posts[activeType] || [];

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/${activeType}/${id}`, {
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

  const handleEdit = (post) => {
    setEditForm({
      id: post.id,
      title: post.title,
      description: post.description,
      location: post.location || "",
      price: post.price || "",
      subject: post.subject || "",
      hourly_rate: post.hourly_rate || "",
      contact_info: post.contact_info || "",
      stipend: post.stipend || "",
      application_deadline: post.application_deadline || "",
      start_date: post.start_date || "",
      end_date: post.end_date || "",
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let body;
      if (activeType === "instructions") {
        body = {
          title: editForm.title,
          subject: editForm.subject,
          description: editForm.description,
          hourly_rate: parseFloat(editForm.hourly_rate),
          contact_info: editForm.contact_info,
        };
      } else if (activeType === "internships") {
        body = {
          title: editForm.title,
          description: editForm.description,
          location: editForm.location || null,
          stipend: editForm.stipend,
          application_deadline: editForm.application_deadline || null,
          start_date: editForm.start_date || null,
          end_date: editForm.end_date || null,
        };
      } else {
        body = {
          title: editForm.title,
          description: editForm.description,
          location: editForm.location,
          price: parseFloat(editForm.price),
        };
      }

      const res = await fetch(`http://localhost:8000/api/${activeType}/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to update post.");
      const updated = await res.json();

      setEmployerPosts((prev) => ({
        ...prev,
        [activeType]: prev[activeType].map((p) =>
          p.id === updated.id ? { ...p, ...updated } : p
        ),
      }));

      toast.success("Post updated.");
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Error updating post.");
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
          <div key={type} onClick={() => setActiveType(type)} className={tabClasses(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
      </div>

      {currentPosts.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">
          No {activeType} posts found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentPosts.map((post) => {
            const commonProps = {
              ...post,
              createdBy: post.created_by,
              applied: false,
              saved: false,
              author_id: me?.id,
              author_role: me?.role,
              company_name: me?.employer_profile?.company_name || ""            };
            console.log("company_name:", me.company_name);
            let card;
            if (activeType === "jobs") {
              card = (
                <JobCard
                  key={post.id}
                  job={commonProps}
                  me={me}
                  onEdit={() => handleEdit(post)}
                  onDelete={() => handleDelete(post.id)}
                />
              );
            } else if (activeType === "internships") {
              card = (
                <InternshipCard
                  key={post.id}
                  item={commonProps}
                  me={me}
                  onEdit={() => handleEdit(post)}
                  onDelete={() => handleDelete(post.id)}
                />
              );
            } else {
              card = (
                <InstructionCard
                  key={post.id}
                  instruction={commonProps}
                  me={me}
                  onEdit={() => handleEdit(post)}
                  onDelete={() => handleDelete(post.id)}
                />
              );
            }

            return (
              <div key={post.id} className="cursor-pointer" onClick={() => handleCardClick(post)}>
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

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 text-xl font-bold text-slate-600 hover:text-slate-800"
            >
              &times;
            </button>
            <div className="p-6 pt-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
                Edit {activeType.slice(0, -1).charAt(0).toUpperCase() + activeType.slice(1, -1)}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                  <input
                    required
                    name="title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {activeType === "instructions" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                      <input
                        name="subject"
                        value={editForm.subject}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                        className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={4}
                    name="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {activeType === "instructions" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (KM)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="hourly_rate"
                        value={editForm.hourly_rate}
                        onChange={(e) => setEditForm({ ...editForm, hourly_rate: e.target.value })}
                        className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info</label>
                      <input
                        name="contact_info"
                        value={editForm.contact_info}
                        onChange={(e) => setEditForm({ ...editForm, contact_info: e.target.value })}
                        className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </>
                ) : activeType === "jobs" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input
                      name="location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price / Salary</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : null}
                {activeType === "internships" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stipend (KM)</label>
                    <input
                      name="stipend"
                      type="text"
                      value={editForm.stipend}
                      onChange={(e) => setEditForm({ ...editForm, stipend: e.target.value })}
                      placeholder="Enter amount or 'None' for volunteer"
                      className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
                      <input
                        type="date"
                        name="application_deadline"
                        value={editForm.application_deadline || ""}
                        onChange={(e) => setEditForm({ ...editForm, application_deadline: e.target.value })}
                        className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        name="start_date"
                        value={editForm.start_date || ""}
                        onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                        className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                      <input
                        type="date"
                        name="end_date"
                        value={editForm.end_date || ""}
                        onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                        className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}
                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
