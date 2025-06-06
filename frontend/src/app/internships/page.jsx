// src/app/prakse/page.jsx
"use client";
import { useEffect, useState } from "react";
import NavBar         from "@/components/Navbar";
import InternshipCard from "@/components/InternshipCard";
import { listInternships, createInternship } from "@/utils/api/internships";

export default function PraksePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", stipend:"" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listInternships().then(setItems).finally(() => setLoading(false));
  }, []);

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
    } finally { setSaving(false); }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <div className="container mx-auto flex-1 px-4 pt-6 pb-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-amber-600">Prakse</h1>
          <button
            onClick={() => setShow(true)}
            className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
            <span className="text-xl leading-none">+</span> Dodaj praksu
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-600">Učitavanje…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-slate-600">Nema objavljenih praksi.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map(i => <InternshipCard key={i.id} item={i} />)}
          </div>
        )}
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <button onClick={() => setShow(false)} className="absolute right-4 top-4 text-xl font-bold text-slate-600">&times;</button>
            <h2 className="mb-4 text-2xl font-semibold text-amber-600">Nova praksa</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <input className="w-full rounded border p-2" placeholder="Naslov*" required
                     value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
              <textarea className="w-full rounded border p-2" rows={4} placeholder="Opis*"
                        required value={form.description}
                        onChange={e=>setForm({...form,description:e.target.value})}/>
              <input className="w-full rounded border p-2" placeholder="Stipendija (KM)"
                     value={form.stipend} onChange={e=>setForm({...form,stipend:e.target.value})}/>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={()=>setShow(false)}
                        className="rounded bg-gray-200 px-4 py-2 text-sm text-slate-700 hover:bg-gray-300">
                  Odustani
                </button>
                <button type="submit" disabled={saving}
                        className="rounded bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600 disabled:opacity-50">
                  {saving?"Spremanje…":"Objavi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
