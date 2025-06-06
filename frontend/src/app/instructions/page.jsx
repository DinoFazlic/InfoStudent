// src/app/instructions/page.jsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import InstructionCard from "@/components/InstructionCard";
import { listInstructions, createInstruction } from "@/utils/api/instructions";

export default function InstructionsPage() {
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Za modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hourly_rate: "",
    contact_info: "",
    subject: "",
  });
  const [saving, setSaving] = useState(false);

  // Kad se komponenta mounta, dohvatimo sve instrukcije
  useEffect(() => {
    async function fetchAll() {
      try {
        const data = await listInstructions();
        setInstructions(data);
      } catch (err) {
        console.error("Greška pri dohvaćanju instrukcija:", err);
        // Možeš htjeti pokazati neki toast ili alert
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Handler za otvaranje modala
  function onOpenModal() {
    setFormData({
      title: "",
      description: "",
      hourly_rate: "",
      contact_info: "",
      subject: "",
    });
    setShowModal(true);
  }

  // Handler za submit forme
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // Pošalji backendu
      const payload = {
        title: formData.title,
        description: formData.description,
        hourly_rate: formData.hourly_rate
          ? Number(formData.hourly_rate)
          : undefined,
        contact_info: formData.contact_info || undefined,
        subject: formData.subject || undefined,
      };
      const newInst = await createInstruction(payload);
      // Dodaj u stanje
      setInstructions((prev) => [newInst, ...prev]);
      setShowModal(false);
    } catch (err) {
      console.error("Greška pri kreiranju instrukcije:", err);
      alert("Greška pri spremanju instrukcije. Pokušaj ponovo.");
    } finally {
      setSaving(false);
    }
  }

  // Kad korisnik popuni polje
  function onChangeField(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div
      className="
        min-h-screen flex flex-col
        bg-[url('/backgrounds/chat-bg.png')] bg-cover bg-fixed
      "
    >
      {/* NAVBAR */}
      <NavBar />

      <div className="flex-1 container mx-auto px-4 pt-6 pb-12">
        {/* Zaglavlje i gumb za novu instrukciju */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Instruktori i instrukcije
          </h1>
          <button
            onClick={onOpenModal}
            className="
              flex items-center gap-2 rounded-full bg-blue-600
              px-4 py-2 text-white text-sm font-semibold
              hover:bg-blue-700 transition
            "
          >
            <span className="text-xl leading-none">+</span> Dodaj novu
          </button>
        </div>

        {/* Lista instrukcija */}
        {loading ? (
          <p className="text-center text-slate-700">Učitavanje…</p>
        ) : instructions.length === 0 ? (
          <p className="text-center text-slate-700">
            Trenutno nema objavljenih instrukcija.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {instructions.map((inst) => (
              <InstructionCard
                key={inst.id}
                instruction={{
                  id: inst.id,
                  authorName: inst.author_name || "Nepoznato",
                  authorAvatarUrl: inst.author_avatar_url || null,
                  createdAt: inst.created_at,
                  title: inst.title,
                  description: inst.description,
                  hourly_rate: inst.hourly_rate,
                  subject: inst.subject,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL za dodavanje nove instrukcije */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-xl font-bold text-slate-600 hover:text-slate-800"
            >
              &times;
            </button>
            <h2 className="p-6 pt-10 text-2xl font-semibold text-slate-900">
              Nova instrukcija
            </h2>
            <form
              onSubmit={onSubmit}
              className="space-y-4 px-6 pb-8"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Naslov <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={onChangeField}
                  className="
                    mt-1 block w-full rounded-md border-gray-300
                    shadow-sm focus:border-blue-500 focus:ring-blue-500
                    sm:text-sm
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Predmet
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={onChangeField}
                  className="
                    mt-1 block w-full rounded-md border-gray-300
                    shadow-sm focus:border-blue-500 focus:ring-blue-500
                    sm:text-sm
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Opis <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={onChangeField}
                  className="
                    mt-1 block w-full rounded-md border-gray-300
                    shadow-sm focus:border-blue-500 focus:ring-blue-500
                    sm:text-sm
                  "
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Satnica (KM/h)
                  </label>
                  <input
                    type="number"
                    name="hourly_rate"
                    step="0.01"
                    min="0"
                    value={formData.hourly_rate}
                    onChange={onChangeField}
                    className="
                      mt-1 block w-full rounded-md border-gray-300
                      shadow-sm focus:border-blue-500 focus:ring-blue-500
                      sm:text-sm
                    "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Kontakt info
                  </label>
                  <input
                    type="text"
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={onChangeField}
                    className="
                      mt-1 block w-full rounded-md border-gray-300
                      shadow-sm focus:border-blue-500 focus:ring-blue-500
                      sm:text-sm
                    "
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="
                    mr-2 rounded-md bg-gray-200 px-4 py-2 text-sm
                    font-medium text-slate-700 hover:bg-gray-300
                  "
                  disabled={saving}
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="
                    rounded-md bg-blue-600 px-4 py-2 text-sm
                    font-medium text-white hover:bg-blue-700
                    disabled:opacity-50
                  "
                  disabled={saving}
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
