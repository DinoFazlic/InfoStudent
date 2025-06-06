import { useState } from "react";
import { createInstruction } from "@/services/InstructionService";

export default function InstructionFormModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    hourly_rate: "",
    contact_info: "",
    subject: "",
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleaned = { ...form, hourly_rate: Number(form.hourly_rate) || undefined };
      await createInstruction(cleaned);
      onCreated();          // ⇦ refetch lista
      onClose();
    } catch (err) {
      alert(err.response?.data?.detail || "Greška");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-xl p-6 space-y-4 shadow-xl"
      >
        <h2 className="text-xl font-semibold">Nova instrukcija</h2>

        {["title", "subject", "hourly_rate", "contact_info"].map((f) => (
          <input
            key={f}
            required={f === "title"}
            name={f}
            value={form[f]}
            onChange={handleChange}
            placeholder={f.replace("_", " ").toUpperCase()}
            className="w-full input input-bordered"
          />
        ))}

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Opis"
          className="w-full textarea textarea-bordered"
          rows={4}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost">Otkaži</button>
          <button
            disabled={loading}
            className="btn btn-primary">
            {loading ? "Spremam..." : "Spremi"}
          </button>
        </div>
      </form>
    </div>
  );
}
