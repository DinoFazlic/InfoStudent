/* src/components/InternshipCard.jsx */
"use client";
import { useState } from "react";
import Image from "next/image";

export default function InternshipCard({ item }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  const name   = item.author_name ?? item.authorName ?? "Nepoznato";
  const avatar = item.author_avatar_url ?? item.authorAvatarUrl ?? null;
  const iso    = item.created_at ?? item.createdAt;

  return (
    <article
      className="
        relative overflow-hidden rounded-2xl shadow
        bg-[url('/backgrounds/post-bg4.svg')] bg-cover text-slate-800
      "
    >
      <button
        onClick={() => setHidden(true)}
        className="absolute right-3 top-3 text-xl font-bold text-amber-600 hover:text-amber-800"
      >
        &times;
      </button>

      <header className="flex items-center gap-3 p-5">
        {avatar ? (
          <Image src={avatar} alt={name} width={48} height={48} className="rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-700">
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold">{name}</span>
          <time className="text-sm text-amber-700">
            {iso ? new Date(iso).toLocaleDateString("sr-Latn-BA") : "--"}
          </time>
        </div>
      </header>

      <div className="px-5 pb-5">
        <div className="rounded-lg bg-white/70 backdrop-blur-sm p-4 space-y-1">
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-sm text-slate-800">{item.description}</p>
          {item.stipend != null && (
            <p className="text-sm font-medium text-amber-600">
              Stipendija: {item.stipend} KM
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 px-5 pb-6">
        <button className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-white shadow transition hover:brightness-90">
          Pošalji CV
        </button>
        <button className="flex-1 rounded-xl border-2 border-amber-500 px-4 py-2 text-amber-600 hover:bg-amber-50">
          Spremi
        </button>
      </div>
    </article>
  );
}
