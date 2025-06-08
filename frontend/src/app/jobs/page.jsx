"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/JobCard";
import NavBar from "@/components/Navbar";
import { listJobs, createJob, deleteJob } from "@/utils/api/jobs";
import { getMe } from "@/utils/api/auth";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
  });

  const [me, setMe] = useState(null);

  // ────────── initial fetch ──────────
  useEffect(() => {
    (async () => {
      const user = await getMe().catch(() => null);
      console.log("Logged-in user:", user); // Debug user
      setMe(user);
      const allJobs = await listJobs().catch(() => []);
      const visibleJobs = user?.role === "student"
        ? allJobs.filter((job) => !job.applied)
        : allJobs; // Employers/Admins see all jobs

      setJobs(visibleJobs);
      setLoading(false);
    })();
  }, []);

  // ────────── handlers ──────────
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location || undefined,
        price: form.price ? Number(form.price) : undefined,
      };
      const newJob = await createJob(payload);
      setJobs([newJob, ...jobs]);
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.detail || "Error while saving the job.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this job posting?")) return;
    await deleteJob(id);
    setJobs(jobs.filter((j) => j.id !== id));
  }

  function handleJobApplied(jobId) {
    setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
  }

  function handleJobSaved(jobId) {
    setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
  }

  



  // ────────── render ──────────
  return (
    <div className="min-h-screen flex flex-col bg-[url('/backgrounds/chat-bg.png')] bg-cover bg-fixed">
      <NavBar />

      <div className="flex-1 container mx-auto px-4 pt-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Job Listings</h1>


          {/* Only show button when me is loaded */}
          {!loading && (me?.role === "employer" || me?.role === "admin") && (
            <button
            onClick={() => {
              setForm({ title: "", description: "", location: "", price: "" });
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white text-base font-semibold hover:bg-emerald-700"
          >
            <span className="text-lg flex items-center justify-center">
              +
            </span>
            Add Job
          </button>


          )}
        </div>

        {/* Jobs list */}
        {loading ? (
          <p className="text-center text-slate-700">Loading jobs…</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-slate-700">No job postings available.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => (
              <JobCard
                key={j.id}
                job={{
                  ...j,
                  authorName: j.author_name,
                  authorAvatarUrl: j.author_avatar_url,
                  createdAt: j.created_at,
                  canDelete: me && (me.role === "admin" || me.id === j.created_by),
                  onDelete: handleDelete,
                }}
                onApply={() => handleJobApplied(j.id)}
                onSaveToggle={(id, nowSaved) => {
                  if (nowSaved) {
                    setJobs((prev) => prev.filter((job) => job.id !== id));
                  }
                }}

              />
            ))}
          </div>
        )}
      </div>

      {/* Modal for Adding Job */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-xl font-bold text-slate-600 hover:text-slate-800"
            >
              &times;
            </button>
            <div className="p-6 pt-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Add New Job</h2>
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
                  <input
                    required
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    placeholder="e.g. Frontend Developer"
                    className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-emerald-500 focus:ring-emerald-500"
                  />

                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Description *</label>
                  <textarea
                    required
                    rows={4}
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    placeholder="Describe the responsibilities, requirements, and qualifications."
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  />
                </div>
                {/* Two-column layout */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={onChange}
                      placeholder="e.g. Sarajevo or Remote"
                      className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Salary (KM/h)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      value={form.price}
                      onChange={onChange}
                      placeholder="e.g. 15.00"
                      className="w-full h-12 rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-300"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                    disabled={saving || !form.title || !form.description}
                  >
                    {saving ? "Saving…" : "Post Job"}
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
