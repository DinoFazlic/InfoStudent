"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInstruction } from "@/utils/api/instructions";

export default function NewInstruction() {
  const [form, setForm] = useState({
    title: "", description: "", hourly_rate: "", contact_info: "", subject: ""
  });
  const [loading, setL] = useState(false);
  const router = useRouter();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setL(true);
    try {
      await createInstruction({ ...form, hourly_rate: Number(form.hourly_rate) || undefined });
      router.push("/instruction");      // nazad na listu
      router.refresh();                 // refetch server-side ako koristiš SSG/SSR
    } catch (err) {
      alert(err.message);
    } finally { setL(false); }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Nova instrukcija</h1>
      <form onSubmit={submit} className="space-y-3">
        {["title","subject","hourly_rate","contact_info"].map(f => (
          <input key={f} name={f} value={form[f]}
            onChange={handle} placeholder={f.replace("_"," ").toUpperCase()}
            className="input input-bordered w-full" required={f==="title"} />
        ))}
        <textarea name="description" rows={4} value={form.description}
          onChange={handle} placeholder="Opis"
          className="textarea textarea-bordered w-full" />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => router.back()} className="btn btn-ghost">Otkaži</button>
          <button disabled={loading} className="btn btn-primary">
            {loading ? "Spremam…" : "Spremi"}
          </button>
        </div>
      </form>
    </main>
  );
}
