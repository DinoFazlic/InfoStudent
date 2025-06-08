"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { getMe } from "@/utils/api/auth";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';


export default function InstructionCard({ instruction, onSaveToggle }) {
  const [hidden, setHidden] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [me, setMe] = useState(null);
  const [saving, setSaving] = useState(false);
  const [messaging, setMessaging] = useState(false);
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

  const fetchInsight = async () => {
    setLoadingInsight(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/ai/insight",
        { description: instruction.description },
        { withCredentials: true }
      );
      setAiInsight(response.data.insight);
    } catch (error) {
      console.error("AI Insight error:", error);
      setAiInsight("Cannot fetch AI Insight.");
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await axios.post(
        `http://localhost:8000/api/instruction-saves`,
        { instruction_id: instruction.id },
        { withCredentials: true }
      );

      toast.success("Instruction saved!");
      setHidden(true);

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
      alert("Cannot message, no user found.");
    }
  };

  return (
    <article className="relative overflow-hidden rounded-2xl shadow bg-[url('/backgrounds/post-bg4.svg')] bg-cover text-slate-800">
      {/* Delete Button */}
      {instruction.canDelete && (
        <button
          onClick={() => instruction.onDelete(instruction.id)}
          className="absolute right-3 top-3 text-xl font-bold text-red-500 hover:text-red-700"
        >
          &times;
        </button>
      )}

      {/* Header */}
      <header className="flex items-center gap-3 p-5">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={authorName}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-600">
            {authorName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold">{authorName}</span>
          <time className="text-sm text-slate-600">
            {createdIso ? new Date(createdIso).toLocaleDateString("en-GB") : "--"}
          </time>
        </div>
      </header>

      {/* Instruction Details */}
      <div className="px-5 pb-5">
        <div className="rounded-lg bg-white/70 backdrop-blur-sm p-4 space-y-1">
          <h3 className="font-semibold text-lg">{instruction.title}</h3>
          {instruction.subject && (
            <p className="text-sm font-medium text-slate-700">
              Subject: {instruction.subject}
            </p>
          )}
          <p className="text-slate-800 text-sm">{instruction.description}</p>
          {instruction.hourly_rate != null && (
            <p className="text-sm font-medium text-blue-600">
              {instruction.hourly_rate} KM / h
            </p>
          )}
        </div>
      </div>

      {/* Buttons (Students Only) */}
      {me?.role === "student" && (
        <div className="flex flex-col gap-3 px-5 pb-6">
          <div className="flex gap-3">
            <button
              onClick={handleMessage}
              disabled={messaging}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white shadow transition hover:brightness-90 active:scale-[0.98]"
            >
              {messaging ? "Opening…" : "Message"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-xl border-2 border-blue-600 px-4 py-2 text-blue-600 transition hover:bg-blue-50 active:scale-[0.98]"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>

         
        </div>
      )}

    </article>
  );
}
