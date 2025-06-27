"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/Navbar";
import Footer from '@/components/Footer';
import InstructionCard from "@/components/InstructionCard";
import { listInstructions, createInstruction, deleteInstruction } from "@/utils/api/instructions";
import { getMe } from "@/utils/api/auth";
import UserProfilePopup from "@/components/UserProfileCard";
import Link from "next/link";

export default function InstructionsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); 

  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    hourly_rate: "",
  });

  const DESC_MAX = 300;

  useEffect(() => {
    (async () => {
      const user = await getMe().catch(() => null);
      setMe(user);
      setRows(await listInstructions().catch(() => []));
      setLoading(false);
    })();
  }, []);

  async function handleDelete(id) {
    await deleteInstruction(id);
    setRows(rows.filter(r => r.id !== id));
  }

  const handleEdit = (id) => {
    const inst = rows.find(r => r.id === id);
    if (!inst) return;
    setForm({
      title: inst.title,
      subject: inst.subject ?? "",
      description: inst.description,
      hourly_rate: inst.hourly_rate ?? "",
    });
    setIsEditMode(true);
    setCurrentId(id);
    setShowModal(true);
  };

  const onField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      payload.description = payload.description.slice(0, DESC_MAX);
      if (payload.hourly_rate === "") delete payload.hourly_rate;
      if (payload.subject === "") delete payload.subject;

      if (isEditMode && currentId) {
        const updated = await (await import("@/utils/api/instructions")).updateInstruction(currentId, payload);
        setRows(prev => prev.map(r => r.id === currentId ? updated : r));
      } else {
      const created = await createInstruction(payload);
        setRows(prev => [created, ...prev]);
      }
      setShowModal(false);
      setIsEditMode(false);
      setCurrentId(null);
    } finally {
      setSaving(false);
    }
  }

  const resetForm = () => {
    setForm({ title: "", subject: "", description: "", hourly_rate: "" });
    setIsEditMode(false);
    setCurrentId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 pt-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Instructions</h1>
          {me && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white text-base font-semibold hover:bg-blue-700"
          >
            <span className="text-lg flex items-center justify-center">+</span> Add Instruction
          </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-slate-600">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">No instructions available</h3>
              <p className="text-gray-600 mb-6">Sign in or register to access more features and find instruction opportunities.</p>
              <Link 
                href="/login" 
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
              >
                Login or Register
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rows.map(r => (
              <InstructionCard
                key={r.id}
                instruction={{
                  ...r,
                  canDelete: me && (me.role === "admin" || me.id === r.created_by),
                  createdBy: r.created_by,
                }}
                onSaveToggle={(id, nowSaved) => {
                  if (nowSaved) {
                    setRows((prev) => prev.filter((instruction) => instruction.id !== id));
                  }
                }}
                onProfileClick={(userId) => setSelectedUserId(userId)}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
        
      </main>
      <Footer />

          {selectedUserId && (
        <UserProfilePopup
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => { setShowModal(false); resetForm(); }}
              className="absolute right-4 top-4 text-xl font-bold text-slate-600 hover:text-slate-800"
            >
              &times;
            </button>

            <h2 className="p-6 pt-10 text-2xl font-semibold text-slate-900 text-center">
              {isEditMode ? 'Edit Instruction' : 'New Instruction'}
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
                  maxLength={DESC_MAX}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-right text-gray-500">{form.description.length}/{DESC_MAX}</p>
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
                  {saving ? "Saving…" : (isEditMode ? "Update" : "Post")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
