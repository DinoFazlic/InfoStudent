/*  src/components/InstructionCard.jsx  */
"use client";
import { useState } from "react";
import Image from "next/image";

export default function InstructionCard({ instruction }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  const authorName  = instruction.authorName      ?? "Nepoznato";
  const avatarUrl   = instruction.authorAvatarUrl ?? null;
  const createdIso  = instruction.createdAt       ?? null;

  return (
    <article
        className="
          relative overflow-hidden rounded-2xl shadow
          bg-[url('/backgrounds/post-bg4.svg')] bg-cover            /*  ←  nova slika */
          text-slate-800
        "
    >
      {/* sakrij karticu */}
      <button onClick={()=>setHidden(true)}
        className="absolute right-3 top-3 text-xl font-bold text-slate-500 hover:text-slate-700">
        &times;
      </button>

      {/* zaglavlje */}
      <header className="flex items-center gap-3 p-5">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={authorName} width={48} height={48}
                 className="rounded-full object-cover"/>
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-600">
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
        <div className="rounded-lg bg-white/70 backdrop-blur-sm p-4 space-y-1">
          <h3 className="font-semibold text-lg">{instruction.title}</h3>
          {instruction.subject && (
            <p className="text-sm font-medium text-slate-700">Predmet: {instruction.subject}</p>
          )}
          <p className="text-slate-800 text-sm">{instruction.description}</p>
          {instruction.hourly_rate != null && (
            <p className="text-sm font-medium text-blue-600">
              {instruction.hourly_rate} KM / h
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 px-5 pb-6">
        <button
          className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white shadow transition hover:brightness-90 active:scale-[0.98]">
          Javi se u chat
        </button>
        <button
          className="flex-1 rounded-xl border-2 border-blue-600 px-4 py-2 text-blue-600 transition hover:bg-blue-50 active:scale-[0.98]">
          Spremi
        </button>
      </div>
    </article>
  );
}
