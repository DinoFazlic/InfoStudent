/* src/components/InstructionCard.jsx */
"use client";
import { useState } from "react";
import Image from "next/image";

/**
 * @param {{
 *   instruction: {
 *     id: number,
 *     authorName: string,
 *     authorAvatarUrl?: string,  // opcionalno, ako želiš avatar
 *     createdAt: string,         // ISO string
 *     title: string,
 *     description: string,
 *     hourly_rate?: number,
 *     subject?: string
 *   }
 * }} props
 */
export default function InstructionCard({ instruction }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <article
      className="
        relative overflow-hidden rounded-2xl shadow-xl
        bg-[url('/post-bg-invert.svg')] bg-cover 
        text-slate-800 max-w-md mx-auto
      "
    >
      {/* gumb za sakrivanje kartice */}
      <button
        onClick={() => setHidden(true)}
        className="absolute right-3 top-3 text-xl font-bold text-slate-500 hover:text-slate-700"
      >
        &times;
      </button>

      {/* zaglavlje: avatar, ime, datum */}
      <header className="flex items-center gap-3 p-5">
        {instruction.authorAvatarUrl ? (
          <Image
            src={instruction.authorAvatarUrl}
            alt={instruction.authorName}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold">
            {instruction.authorName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold">{instruction.authorName}</span>
          <time className="text-sm text-slate-600">
            {new Date(instruction.createdAt).toLocaleDateString("sr-Latn-BA", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </time>
        </div>
      </header>

      {/* Sadržaj: naslov, predmet, opis */}
      <div className="px-5 pb-5">
        <div className="rounded-lg bg-white/70 backdrop-blur-sm p-4 text-sm leading-relaxed space-y-2">
          <h3 className="font-semibold text-lg">{instruction.title}</h3>
          {instruction.subject && (
            <p className="text-sm text-slate-700 italic">
              Predmet: {instruction.subject}
            </p>
          )}
          <p className="text-slate-800">{instruction.description}</p>
          {instruction.hourly_rate != null && (
            <p className="text-sm font-medium text-blue-600">
              Satnica: {instruction.hourly_rate} KM
            </p>
          )}
        </div>
      </div>

      {/* DUGMAD */}
      <div className="flex gap-3 px-5 pb-6">
        {/* primarno dugme */}
        <button
          className="
            flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500
            px-4 py-2 text-center text-white shadow-md transition
            hover:from-blue-700 hover:to-blue-600 active:scale-[0.98]
          "
        >
          Pogledaj detalje
        </button>

        {/* sekundarno dugme */}
        <button
          className="
            flex-1 rounded-xl border-2 border-blue-600
            px-4 py-2 text-center text-blue-600 transition
            hover:bg-blue-50 active:scale-[0.98]
          "
        >
          Javi se
        </button>
      </div>
    </article>
  );
}
