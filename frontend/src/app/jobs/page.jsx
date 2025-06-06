"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/JobCard";
import NavBar from "@/components/Navbar";
import { listJobs, createJob, deleteJob } from "@/utils/api/jobs";
import { getMe } from "@/utils/api/auth";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal & forma
  const [showModal, setShowModal]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", location: "", price: "",
  });

  // user info da znamo je li employer / admin
  const [me, setMe] = useState(null);

  /* ────────── initial fetch ────────── */
  useEffect(() => {
    (async () => {
      setMe(await getMe().catch(() => null));
      setJobs(await listJobs().catch(() => []));
      setLoading(false);
    })();
  }, []);

  /* ────────── helpers ────────── */
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

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
      alert("Greška pri spremanju posla");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Obrisati oglas?")) return;
    await deleteJob(id);
    setJobs(jobs.filter(j => j.id !== id));
  }

  /* ────────── render ────────── */
  return (
    <div className="min-h-screen flex flex-col bg-[url('/backgrounds/chat-bg.png')] bg-cover bg-fixed">
      <NavBar />

      <div className="flex-1 container mx-auto px-4 pt-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Poslovi</h1>

          { (me?.role === "employer" || me?.role === "admin") && (
            <button
              onClick={() => { setForm({title:"",description:"",location:"",price:""}); setShowModal(true); }}
              className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <span className="text-xl leading-none">+</span> Dodaj posao
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-slate-700">Učitavanje…</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-slate-700">Trenutno nema oglasa.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(j => (
              <JobCard
                key={j.id}
                job={{
                  ...j,
                  authorName:  j.author_name,
                  authorAvatarUrl: j.author_avatar_url,
                  createdAt:  j.created_at,
                  canDelete:  me && (me.role === "admin" || me.id === j.created_by),
                  onDelete:   handleDelete,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ───── Modal ───── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <button onClick={()=>setShowModal(false)} className="absolute right-4 top-4 text-xl font-bold text-slate-600 hover:text-slate-800">&times;</button>
            <h2 className="p-6 pt-10 text-2xl font-semibold text-slate-900">Novi posao</h2>
            <form onSubmit={onSubmit} className="space-y-4 px-6 pb-8">
              {/* title */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Naziv *</label>
                <input required name="title" value={form.title} onChange={onChange}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"/>
              </div>
              {/* description */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Opis *</label>
                <textarea required rows={4} name="description" value={form.description} onChange={onChange}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"/>
              </div>
              {/* two-col */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Lokacija</label>
                  <input name="location" value={form.location} onChange={onChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Cijena (KM/h)</label>
                  <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={onChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"/>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" onClick={()=>setShowModal(false)}
                  className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-300"
                  disabled={saving}>Odustani</button>
                <button type="submit"
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  disabled={saving || !form.title || !form.description}>
                  {saving ? "Spremanje…" : "Objavi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
