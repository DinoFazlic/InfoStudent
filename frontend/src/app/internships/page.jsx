"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/Navbar";
import InternshipCard from "@/components/InternshipCard";
import { listInternships, createInternship, deleteInternship } from "@/utils/api/internships";
import { getMe } from "@/utils/api/auth";

export default function PraksePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", stipend: "" });
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await getMe().catch(() => null);
      setMe(user);
      setItems(await listInternships().catch(() => []));
      setLoading(false);
    })();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this internship posting?")) return;
    await deleteInternship(id);
    setItems(items.filter(i => i.id !== id));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        stipend: form.stipend ? Number(form.stipend) : undefined,
      };
      const newOne = await createInternship(payload);
      setItems(prev => [newOne, ...prev]);
      setShow(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <div className="container mx-auto flex-1 px-4 pt-6 pb-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-amber-600">Internships</h1>

          {!loading && (me?.role === "employer" || me?.role === "admin") && (
            <button
              onClick={() => setShow(true)}
              className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-white text-base font-semibold hover:bg-amber-600"
            >
              <span className="text-lg flex items-center justify-center">+</span> Add Internship
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-slate-600">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-slate-600">No internships posted yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items
            .filter((i) => !i.applied && !i.saved) 
            .map(i => (
              <InternshipCard
                key={i.id}
                item={{
                  ...i,
                  canDelete: me && (me.role === "admin" || me.id === i.created_by),
                  onDelete: handleDelete,
                }}
                onApply={(id) => setItems((prev) => prev.filter((internship) => internship.id !== id))}
                onSaveToggle={(id, nowSaved) => {
                  if (nowSaved) {
                    setItems((prev) => prev.filter((internship) => internship.id !== id));
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setShow(false)}
              className="absolute right-4 top-4 text-xl font-bold text-slate-600 hover:text-slate-800"
            >
              &times;
            </button>
            <h2 className="mb-4 text-2xl font-semibold text-amber-600">New Internship</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                className="w-full h-12 rounded border p-3 text-base"
                placeholder="Title*"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                className="w-full rounded border p-3 text-base"
                rows={4}
                placeholder="Description*"
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <input
                className="w-full h-12 rounded border p-3 text-base"
                placeholder="Stipend (KM)"
                value={form.stipend}
                onChange={e => setForm({ ...form, stipend: e.target.value })}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="rounded bg-gray-200 px-4 py-2 text-sm text-slate-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
