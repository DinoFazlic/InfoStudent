"use client";

import { useEffect, useState } from "react";
import InstructionCard from "@/components/InstructionCard";
import toast from "react-hot-toast";
import { getMe } from "@/utils/api/auth";

export default function StudentInstructionPostsSection({ posts, setInstructionPosts }) {
  const [me, setMe] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    hourly_rate: "",
    contact_info: "",
  });

  useEffect(() => {
    getMe().then(setMe).catch(() => setMe(null));
  }, []);

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      subject: post.subject ?? "",
      description: post.description,
      hourly_rate: post.hourly_rate ?? "",
      contact_info: post.contact_info ?? "",
    });
    setCurrentId(post.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const onField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ title: "", subject: "", description: "", hourly_rate: "", contact_info: "" });
    setIsEditMode(false);
    setCurrentId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.hourly_rate === "") delete payload.hourly_rate;
      if (payload.contact_info === "") delete payload.contact_info;
      if (payload.subject === "") delete payload.subject;

      const updated = await (await import("@/utils/api/instructions")).updateInstruction(currentId, payload);
      setInstructionPosts((prev) => prev.map((p) => (p.id === currentId ? updated : p)));

      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error("Failed to update instruction.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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
                  createdBy: post.created_by,
                }}
                me={me} 
                onDelete={async (id) => {
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
                }}
                onEdit={() => handleEdit(post)}
              />
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => { setShowModal(false); resetForm(); }}
              className="absolute right-4 top-4 text-xl font-bold text-slate-600 hover:text-slate-800"
            >
              &times;
            </button>

            <h2 className="p-6 pt-10 text-2xl font-semibold text-slate-900 text-center">
              Edit Instruction
            </h2>

            <form onSubmit={onSubmit} className="space-y-6 px-6 pb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  required
                  name="title"
                  value={form.title}
                  onChange={onField}
                  className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={onField}
                  className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  name="description"
                  value={form.description}
                  onChange={onField}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (KM)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="hourly_rate"
                  value={form.hourly_rate}
                  onChange={onField}
                  className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info</label>
                <input
                  name="contact_info"
                  value={form.contact_info}
                  onChange={onField}
                  className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-300"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={saving || !form.title || !form.description}
                >
                  {saving ? "Saving…" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
