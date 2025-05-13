/* src/components/PostCard.js */
"use client";                     // ⬅️ obavezno: koristi useState u client-komponenti
import { useState } from "react";
import Image from "next/image";

/**
 * @param {{post: {
 *    id:number,
 *    authorName:string,
 *    authorAvatarUrl:string,
 *    createdAt:string,           // ISO string
 *    body:string
 * }}} props
 */
export default function PostCard({ post }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <article
      className="
        relative overflow-hidden rounded-2xl shadow
        bg-[url('/post-bg.svg')] bg-cover bg-center
        text-slate-900
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
        <Image
          src={post.authorAvatarUrl}
          alt={post.authorName}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold">{post.authorName}</span>
          <time className="text-sm text-slate-600">
            {new Date(post.createdAt).toLocaleDateString("sr-Latn-BA")}
          </time>
        </div>
      </header>

      {/* TEKST – blur-bijela podloga za bolju čitljivost */}
      <div className="px-5 pb-5">
        <div
          className="
            rounded-lg bg-white/70 backdrop-blur-sm
            p-4 text-sm leading-relaxed
          "
        >
          {post.body}
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
          Javi se u chat
        </button>

        {/* sekundarno dugme */}
        <button
          className="
            flex-1 rounded-xl border-2 border-blue-600
            px-4 py-2 text-center text-blue-600 transition
            hover:bg-blue-50 active:scale-[0.98]
          "
        >
          Zainteresovan
        </button>
      </div>
    </article>
  );
}
