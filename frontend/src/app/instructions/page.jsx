"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/Navbar";
import InstructionCard from "@/components/InstructionCard";
import {
  listInstructions,
  createInstruction,
} from "@/utils/api/instructions";

export default function InstructionsPage() {
  /* state */
  const [rows,      setRows]   = useState([]);
  const [loading,   setLoad]   = useState(true);
  const [showModal, setModal]  = useState(false);
  const [saving,    setSave]   = useState(false);
  const [form, setForm] = useState({
    title: "", subject: "", description: "",
    hourly_rate: "", contact_info: "",
  });

  /* initial fetch */
  useEffect(() => {
    (async () => {
      try { setRows(await listInstructions()); }
      catch (e) { console.error(e); }
      finally { setLoad(false); }
    })();
  }, []);

  /* handlers */
  const onField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSave(true);
    try {
      /* payload cleanup */
      const p = { ...form };
      if (p.hourly_rate === "")   delete p.hourly_rate;
      if (p.contact_info === "")  delete p.contact_info;
      if (p.subject === "")       delete p.subject;

      const created = await createInstruction(p);
      setRows([created, ...rows]);          // prepend
      setModal(false);
    } catch (err) {
      alert("Greška pri spremanju instrukcije");
    } finally {
      setSave(false);
    }
  }

  /* render */
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <main className="flex-1 container mx-auto px-4 pt-6 pb-12">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Instrukcije</h1>
          <button
            onClick={() => {
              setForm({ title: "", subject: "", description: "", hourly_rate: "", contact_info: "" });
              setModal(true);
            }}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <span className="text-xl leading-none">+</span> Dodaj novu
          </button>
        </div>

        {/* list */}
        {loading ? (
          <p className="text-center text-slate-700">Učitavanje…</p>
        ) : rows.length === 0 ? (
          <p className="text-center text-slate-700">Trenutno nema objavljenih instrukcija.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rows.map((r) => (
              <InstructionCard key={r.id} instruction={r} />
            ))}
          </div>
        )}
      </main>

      {/* modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setModal(false)}
              className="absolute right-4 top-4 text-xl font-bold text-slate-600 hover:text-slate-800"
            >
              &times;
            </button>

            <h2 className="p-6 pt-10 text-2xl font-semibold text-slate-900">
              Nova instrukcija
            </h2>

            {/* FORM */}
            <form onSubmit={onSubmit} className="space-y-4 px-6 pb-8">
              {/* title */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Naslov <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="title"
                  value={form.title}
                  onChange={onField}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Predmet
                </label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={onField}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* description */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Opis <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={onField}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* two-col */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Satnica (KM/h)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="hourly_rate"
                    value={form.hourly_rate}
                    onChange={onField}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Kontakt info
                  </label>
                  <input
                    name="contact_info"
                    value={form.contact_info}
                    onChange={onField}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-300"
                  disabled={saving}
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
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
