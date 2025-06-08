"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { getMe } from "@/utils/api/auth";
import toast from 'react-hot-toast';


export default function InternshipCard({ item, onApply, onSaveToggle }) {
  const [hidden, setHidden] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [me, setMe] = useState(null);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [applied, setApplied] = useState(item.applied || false);
  const [saved, setSaved] = useState(item.saved || false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const openApplyModal = () => {
  setShowApplyModal(true);
};


  useEffect(() => {
    async function fetchUser() {
      const user = await getMe().catch(() => null);
      setMe(user);
    }
    fetchUser();
  }, []);

  if (hidden) return null;

  const authorName = item.author_name ?? item.authorName ?? "Unknown";
  const avatarUrl = item.author_avatar_url ?? item.authorAvatarUrl ?? null;
  const createdIso = item.created_at ?? item.createdAt;

  const fetchInsight = async () => {
    setLoadingInsight(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/ai/insight",
        { description: item.description },
        { withCredentials: true }
      );

      setAiInsight(response.data.insight);
      setShowInsightModal(true);

    } catch (error) {
      console.error("AI Insight error:", error);
      toast.error("Could not fetch AI Insight.");

    } finally {
      setLoadingInsight(false);
    }
  };

  const handleApply = async () => {
    if (applied) return;
    setApplying(true);

    try {
      await axios.post(
        `http://localhost:8000/api/internship-applications`,
        { internship_id: item.id },
        { withCredentials: true }
      );
      toast.success("Application submitted successfully!");

      setApplied(true);
      if (onApply) {
        onApply(item.id);
      }

    } catch (err) {
      console.error("Application error:", err);
      toast.error("Could not apply to the internship.");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
  setSaving(true);

  try {
    if (!saved) {
      await axios.post(
        `http://localhost:8000/api/internship-saves`,
        { internship_id: item.id },
        { withCredentials: true }
      );
      toast.success("Internship saved!");
    } else {
      await axios.delete(
        `http://localhost:8000/api/internship-saves/${item.id}`,
        { withCredentials: true }
      );
      toast.success("Internship unsaved!");
    }

    setSaved(!saved);

    if (onSaveToggle) {
      onSaveToggle(item.id, !saved);
    }
  } catch (err) {
    console.error("Save/Unsave error:", err);
    toast.error("Could not update saved status.");
  } finally {
    setSaving(false);
  }
};

const confirmApply = async (useExisting = false) => {
  setApplying(true);
  try {
    const formData = new FormData();
    formData.append("internship_id", item.id);

    if (!useExisting) {
      if (!selectedFile) {
        toast.error("Please select a file.");
        setApplying(false);
        return;
      }
      formData.append("file", selectedFile);
    }

    await axios.post(
      `http://localhost:8000/api/internship-applications`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Application submitted successfully!");

    if (onApply) {
      onApply(item.id);
    }

    setShowApplyModal(false);

  } catch (err) {
    console.error("Application error:", err);
    toast.error("Could not apply to the internship.");
  } finally {
    setApplying(false);
  }
};



  return (
    <>
      <article className="relative overflow-hidden rounded-2xl shadow bg-[url('/backgrounds/post-bg4.svg')] bg-cover text-slate-800">
        {/* Delete Button (Admin or Owner) */}
        {item.canDelete && (
          <button
            onClick={() => item.onDelete(item.id)}
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
            <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-700">
              {authorName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold">{authorName}</span>
            <time className="text-sm text-amber-700">
              {createdIso ? new Date(createdIso).toLocaleDateString("en-GB") : "--"}
            </time>
          </div>
        </header>

        {/* Internship Details */}
        <div className="px-5 pb-5">
          <div className="rounded-lg bg-white/70 backdrop-blur-sm p-4 space-y-1">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-slate-800">{item.description}</p>
            {item.stipend != null && (
              <p className="text-sm font-medium text-amber-600">
                Stipend: {item.stipend} KM
              </p>
            )}
          </div>
        </div>

        {/* Buttons (Students Only) */}
        {me?.role === "student" && (
          <div className="flex flex-col gap-3 px-5 pb-6">
            <div className="flex gap-3">
              <button
                onClick={openApplyModal}
                disabled={applying || applied}
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-white shadow transition hover:brightness-90 active:scale-[0.98]"
              >
                {applied ? "Applied" : applying ? "Applying…" : "Apply"}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl border-2 border-amber-500 px-4 py-2 text-amber-600 hover:bg-amber-50 active:scale-[0.98]"
              >
                {saving ? (saved ? "Unsaving…" : "Saving…") : (saved ? "Unsave" : "Save")}
              </button>
            </div>

            {/* AI Insight Button */}
            <button
              onClick={fetchInsight}
              disabled={loadingInsight}
              className="rounded-xl border-2 border-blue-600 px-4 py-2 text-center text-blue-600 transition hover:bg-blue-50 active:scale-[0.98]"
            >
              {loadingInsight ? "Loading AI Insight…" : "AI Insight"}
            </button>
          </div>
        )}

      </article>

      {showInsightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-4 relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-800"
              onClick={() => setShowInsightModal(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-slate-900 mb-4">AI Recommendation</h2>

            {loadingInsight ? (
              <p className="text-slate-600">Loading...</p>
            ) : (
              <p className="text-slate-800 whitespace-pre-line">{aiInsight}</p>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowInsightModal(false)}
                className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showApplyModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 relative">
      <button
        className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-800"
        onClick={() => setShowApplyModal(false)}
      >
        &times;
      </button>

      <h2 className="text-lg font-semibold">Submit Application</h2>

      {me?.student_profile?.cv_url ? (
        <div className="space-y-4">
          <button
            onClick={() => confirmApply(true)}
            className="w-full rounded bg-amber-500 text-white py-2 hover:bg-amber-600"
          >
            Use My Existing CV
          </button>
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-600">Or upload a new CV:</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button
              onClick={() => confirmApply(false)}
              className="w-full rounded border border-amber-500 text-amber-500 py-2 hover:bg-amber-50"
            >
              Upload New CV and Apply
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600">You don’t have a CV yet. Please upload one:</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button
            onClick={() => confirmApply(false)}
            className="w-full rounded bg-amber-500 text-white py-2 hover:bg-amber-600"
          >
            Upload and Apply
          </button>
        </div>
      )}
    </div>
  </div>
)}

    </>
  );
}
