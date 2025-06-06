"use client";
import { useState } from "react";
import Image from "next/image";

export default function JobCard({ job }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  const authorName  = job.authorName        ?? "Nepoznato";
  const avatarUrl   = job.authorAvatarUrl   ?? null;
  const createdIso  = job.createdAt         ?? null;

  return (
    <article className="relative overflow-hidden rounded-2xl shadow bg-[url('/post-bg-invert.svg')] bg-cover text-slate-800">

      {job.canDelete && (
        <button onClick={()=>job.onDelete(job.id)} className="absolute right-3 top-3 text-xl font-bold text-red-500 hover:text-red-700">&times;</button>
      )}

      <header className="flex items-center gap-3 p-5">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={authorName} width={48} height={48} className="rounded-full object-cover"/>
        ) : (
          <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-700">
            {authorName.slice(0,1).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold">{authorName}</span>
          <time className="text-sm text-slate-600">
            {createdIso ? new Date(createdIso).toLocaleDateString("sr-Latn-BA") : "--"}
          </time>
        </div>
      </header>

      {/* sadržaj */}
      <div className="px-5 pb-5">
        <span className="inline-block mb-2 rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
          {job.location || "Remote"}
        </span>
        <div className="rounded-lg bg-white/70 backdrop-blur-sm p-4 space-y-1">
          <h3 className="font-semibold text-lg">{job.title}</h3>
          <p className="text-slate-800 text-sm">{job.description}</p>
          {job.price != null && (
            <p className="text-sm font-medium text-emerald-600">{job.price} KM / h</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 px-5 pb-6">
        <button className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-center text-white shadow transition hover:brightness-90 active:scale-[0.98]">
          Pošalji CV
        </button>
        <button className="flex-1 rounded-xl border-2 border-emerald-600 px-4 py-2 text-center text-emerald-600 transition hover:bg-emerald-50 active:scale-[0.98]">
          Spremi
        </button>
      </div>
    </article>
  );
}
