"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/JobCard";
import NavBar from "@/components/Navbar";
import Footer from '@/components/Footer';
import { listJobs, createJob, deleteJob } from "@/utils/api/jobs";
import { getMe } from "@/utils/api/auth";
import Link from "next/link";
import axios from "axios";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
  });

  const [me, setMe] = useState(null);

  

  useEffect(() => {
  async function fetchJobs() {
    setLoading(true);
    const user = await getMe().catch(() => null);
    setMe(user);

    const filters = {
      search: searchQuery || undefined,
      location: locationFilter || undefined,
      min_price: minPrice || undefined,
    };

    const allJobs = await listJobs(filters).catch(() => []);
    const visibleJobs = user?.role === "student"
      ? allJobs.filter((job) => !job.applied)
      : allJobs;

    setJobs(visibleJobs);

    // Za dropdown lokacije (po svim poslodavcima)
    const locations = [...new Set(allJobs.map((j) => j.location).filter(Boolean))];
    setUniqueLocations(locations);

    setLoading(false);
  }

  fetchJobs();
}, [searchQuery, locationFilter, minPrice]);



useEffect(() => {
  async function fetchAllLocations() {
    const jobs = await listJobs(); // bez filtera
    const locations = [...new Set(jobs.map((j) => j.location).filter(Boolean))];
    setAllLocations(locations);
  }

  fetchAllLocations();
}, []);




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
    console.log("PUT payload:", payload);
      if (isEditMode && currentJobId) {
        const response = await axios.put(`http://localhost:8000/api/jobs/${currentJobId}`, payload, { withCredentials: true });
        const updatedJob = response.data;
        setJobs(prev => prev.map(j => j.id === currentJobId ? { ...j, ...updatedJob } : j));
      } else {
        const newJob = await createJob(payload);
        setJobs([newJob, ...jobs]);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.detail || "Error while saving the job.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await deleteJob(id);
    setJobs(jobs.filter((j) => j.id !== id));
  }

  function handleEdit(id) {
    const jobToEdit = jobs.find((j) => j.id === id);
    if (!jobToEdit) return;

    setForm({
      title: jobToEdit.title,
      description: jobToEdit.description,
      location: jobToEdit.location || "",
      price: jobToEdit.price ? jobToEdit.price.toString() : "",
    });
    setCurrentJobId(id);
    setIsEditMode(true);
    setShowModal(true);
  }

  function handleJobApplied(jobId) {
    setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
  }

  function handleJobSaved(jobId) {
    setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
  }

  function resetForm() {
    setForm({ title: "", description: "", location: "", price: "" });
    setCurrentJobId(null);
    setIsEditMode(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <div className="container mx-auto flex-1 px-4 pt-6 pb-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-amber-600">Job Listings</h1>

          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <input
              type="text"
              placeholder="Search by title or description..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full md:w-1/4 px-4 py-2 border rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">All locations</option>
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>


            <select
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full md:w-1/4 px-4 py-2 border rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">All hourly rates</option>
              <option value="10">10 KM/h+</option>
              <option value="15">15 KM/h+</option>
              <option value="20">20 KM/h+</option>
              <option value="25">25 KM/h+</option>
              <option value="30">30 KM/h+</option>
              <option value="35">35 KM/h+</option>
            </select>

          </div>


          {!loading && (me?.role === "employer" || me?.role === "admin") && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-white text-base font-semibold hover:bg-amber-600"
            >
              <span className="text-lg flex items-center justify-center">+</span> {isEditMode ? "Edit Job" : "Add Job"}
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-slate-600">Loading…</p>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">No job postings available</h3>
              <p className="text-gray-600 mb-6">Sign in or register to access more features and apply for jobs.</p>
              <Link href="/login" className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors">
                Login or Register
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs
            .map((j) => (

            <JobCard
              key={j.id}
              job={{
                ...j,
                author_id: j.created_by,
                authorName: j.author_name,
                authorAvatarUrl: j.author_avatar_url,
                createdAt: j.created_at,
                canDelete: me && (me.role === "admin" || me.id === j.created_by),
              }}
              onApply={() => handleJobApplied(j.id)}
              onSaveToggle={(id, nowSaved) => {
                if (nowSaved) {
                  setJobs((prev) => prev.filter((job) => job.id !== id));
                }
              }}
              onEdit={() => handleEdit(j.id)}
              onDelete={() => handleDelete(j.id)}
            />
            ))}
          </div>
        )}
      </div>
      <Footer />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => { setShowModal(false); resetForm(); }}
              className="absolute right-4 top-4 text-xl font-bold text-slate-600 hover:text-slate-800"
            >
              &times;
            </button>
            <div className="p-6 pt-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">{isEditMode ? "Edit Job" : "Add New Job"}</h2>
              <form onSubmit={onSubmit} className="space-y-6">
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
                    onClick={() => { setShowModal(false); resetForm(); }}
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
                    {saving ? "Saving…" : isEditMode ? "Update Job" : "Post Job"}
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
