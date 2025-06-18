"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { getMe } from "@/utils/api/auth";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { FaEdit, FaTrashAlt, FaEnvelope, FaPhoneAlt, FaRegCalendarCheck, FaBookmark, FaRegBookmark, FaGraduationCap, FaClock } from 'react-icons/fa';

export default function InstructionCard({ instruction, onSaveToggle, onEdit, onDelete }) {
  const [hidden, setHidden] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [me, setMe] = useState(null);
  const [saving, setSaving] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [saved, setSaved] = useState(instruction.saved || false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const user = await getMe().catch(() => null);
      setMe(user);
    }
    fetchUser();
  }, []);

  if (hidden) return null;

  const authorName = instruction.authorName ?? "Unknown";
  const avatarUrl = instruction.authorAvatarUrl ?? null;
  const createdIso = instruction.createdAt ?? null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(
        `http://localhost:8000/api/instruction-saves`,
        { instruction_id: instruction.id },
        { withCredentials: true }
      );
      setSaved(true);
      toast.success("Instruction saved!");
      if (onSaveToggle) {
        onSaveToggle(instruction.id, true);
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Could not save the instruction.");
    } finally {
      setSaving(false);
    }
  };

  const handleMessage = () => {
    if (instruction.createdBy) {
      router.push(`/chat/${instruction.createdBy}`);
    } else {
      toast.error("Cannot message, no user found.");
    }
  };

  return (
    <article className="relative overflow-hidden rounded-2xl shadow-lg bg-[url('/backgrounds/post-bg4.svg')] bg-cover text-slate-800 flex flex-col justify-between">
      {(me && (me.id === instruction.createdBy || me.role === "admin")) && (
        <div className="absolute right-3 top-3 flex gap-2 z-10">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(instruction.id); }}
              title="Edit Instruction"
              className="text-lg font-bold text-blue-600 hover:text-blue-800"
            >
              <FaEdit />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(instruction.id); }}
              title="Delete Instruction"
              className="text-lg font-bold text-red-600 hover:text-red-800"
            >
              <FaTrashAlt />
            </button>
          )}
        </div>
      )}

      {me && me.role === "student" && (
        <div className="absolute right-3 top-3 flex gap-2 z-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-lg font-bold text-yellow-500 hover:text-yellow-700"
            title={saved ? "Unsave Instruction" : "Save Instruction"}
          >
            {saved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
      )}

      <div>
        <header className="flex items-center gap-3 p-5 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
          {avatarUrl ? (
            <Image
              src={`http://localhost:8000${avatarUrl}`}
              alt={authorName}
              width={48}
              height={48}
              className="rounded-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-600">
              {authorName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{authorName}</span>
            <time className="text-sm text-slate-500">
              Posted: {createdIso ? new Date(createdIso).toLocaleDateString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) : "--"}
            </time>
          </div>
        </header>

        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 text-gray-900">{instruction.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{instruction.description}</p>

          <div className="space-y-3 text-sm">
            {instruction.subject && (
              <div className="flex items-center gap-3 text-gray-700">
                <FaGraduationCap className="text-gray-400" />
                <span>Subject: <strong>{instruction.subject}</strong></span>
              </div>
            )}
            {instruction.hourly_rate != null && (
              <div className="flex items-center gap-3 text-gray-700">
                <FaClock className="text-amber-500" />
                <span className="font-medium">Rate: {instruction.hourly_rate} KM/h</span>
              </div>
            )}
            {instruction.author_email && (
              <div className="flex items-center gap-3 text-gray-700">
                <FaEnvelope className="text-gray-400" />
                <span>{instruction.author_email}</span>
              </div>
            )}
            {instruction.author_phone && (
              <div className="flex items-center gap-3 text-gray-700">
                <FaPhoneAlt className="text-gray-400" />
                <span>{instruction.author_phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
        {!me ? (
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Log in or Register for More
          </button>
        ) : me.role === "student" ? (
          <div className="flex gap-3">
            {instruction.author_schedule_url && (
              <button
                onClick={() => window.open(`http://localhost:8000${instruction.author_schedule_url}`, '_blank')}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white font-semibold shadow-sm transition hover:bg-green-500 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <FaRegCalendarCheck /> Schedule
              </button>
            )}
            <button
              onClick={handleMessage}
              disabled={messaging}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white font-semibold shadow-sm transition hover:brightness-90 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <FaEnvelope /> Send Message
            </button>
          </div>
        ) : me.role === "admin" && me.id === instruction.createdBy ? (
          <div className="flex gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(instruction.id); }}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaEdit className="text-lg" />
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(instruction.id); }}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaTrashAlt className="text-lg" />
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
