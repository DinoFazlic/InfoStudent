"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { getMe } from "@/utils/api/auth";
import toast from 'react-hot-toast';


export default function JobCard({ job, onApply, onSaveToggle }) {
  const [hidden, setHidden] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [me, setMe] = useState(null);
  const [applying, setApplying] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  const [saved, setSaved] = useState(job.saved || false);

  const [showModal, setShowModal] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [uploadNewCV, setUploadNewCV] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const user = await getMe().catch(() => null);
      setMe(user);
    }
    fetchUser();
  }, []);

  if (hidden) return null;

  const authorName = job.authorName ?? "Unknown";
  const avatarUrl = job.authorAvatarUrl ?? null;
  const createdIso = job.createdAt ?? null;

  const handleToggleSave = async () => {
    setSavingJob(true);
    try {
      if (!saved) {
        await axios.post(
          `http://localhost:8000/api/job-saves`,
          { job_id: job.id },
          { withCredentials: true }
        );
        toast.success("Job saved!");
      } else {
        await axios.delete(
          `http://localhost:8000/api/job-saves/${job.id}`,
          { withCredentials: true }
        );
        toast.success("Job unsaved!");
      }

      setSaved(!saved); 

      if (onSaveToggle) {
        onSaveToggle(job.id, !saved); 
      }
    } catch (err) {
      console.error("Save/Unsave error:", err);
      toast.error("Could not update saved status.");
    } finally {
      setSavingJob(false);
    }
  };

  const fetchInsight = async () => {
    if (!job.description) {
      toast.error("Job description is missing. Cannot generate AI Insight.");
      return;
    }

    setLoadingInsight(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/ai/insight",
        { description: job.description },
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

  const handleApply = () => {
    setShowModal(true);
  };

  const confirmApply = async (useExisting = false) => {
    setApplying(true);

    try {
      const formData = new FormData();
      formData.append("job_id", job.id);

      if (!useExisting) {
        if (!selectedFile) {
          alert("Please select a file first.");
          setApplying(false);
          return;
        }
        formData.append("file", selectedFile);
      }

      // Debugging: Check what is in FormData
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await axios.post("http://localhost:8000/api/job-applications", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Application submitted successfully!");
      setShowModal(false);

      if (onApply) {
        onApply(job.id);
      }
    } catch (err) {
      console.error("Application error:", err);
      toast.error("Could not apply to the job.");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    setSavingJob(true);
    try {
      await axios.post(
        `http://localhost:8000/api/job-saves`,
        { job_id: job.id },
        { withCredentials: true }
      );
      toast.success("Job saved!");

      if (onSave) {
        onSave(job.id);
      }
    } catch (err) {
      console.error("Save error:", err);
       if (err.response?.status === 400 && err.response?.data?.detail === "Job already saved.") {
      toast.error("You already saved this job.");
    } else {
      toast.error("Could not save the job.");
    }
    } finally {
      setSavingJob(false);
    }
  };

  return (
    <>
      <article className="relative overflow-hidden rounded-2xl shadow bg-[url('/post-bg-invert.svg')] bg-cover text-slate-800">
        {/* Delete Button */}
        {job.canDelete && (
          <button
            onClick={() => job.onDelete(job.id)}
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
            <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-700">
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

        {/* Job Details */}
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

        {/* Buttons (Students Only) */}
        {me?.role === "student" && (
          <div className="flex flex-col gap-3 px-5 pb-6">
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-center text-white shadow transition hover:brightness-90 active:scale-[0.98]"
              >
                Apply
              </button>

              <button
                onClick={handleToggleSave}
                disabled={savingJob}
                className="flex-1 rounded-xl border-2 border-emerald-600 px-4 py-2 text-center text-emerald-600 transition hover:bg-emerald-50 active:scale-[0.98]"
              >
                {savingJob ? (saved ? "Unsaving…" : "Saving…") : (saved ? "Unsave" : "Save")}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 relative">
              <button
                className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-800"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>

              <h2 className="text-lg font-semibold">Submit Application</h2>

              {me?.student_profile?.cv_url ? (
                <div className="space-y-4">
                  <button
                    onClick={() => confirmApply(true)}
                    className="w-full rounded bg-emerald-500 text-white py-2 hover:bg-emerald-600"
                  >
                    Use My Existing CV
                  </button>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-600">Or upload a new CV:</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        console.log("Selected file:", e.target.files[0]);
                        setSelectedFile(e.target.files[0]);
                      }}
                    />
                    <button
                      onClick={() => confirmApply(false)}
                      className="w-full rounded border border-emerald-500 text-emerald-500 py-2 hover:bg-emerald-50"
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
                    onChange={(e) => {
                      console.log("Selected file:", e.target.files[0]);
                      setSelectedFile(e.target.files[0]);
                    }}
                  />
                  <button
                    onClick={() => confirmApply(false)}
                    className="w-full rounded bg-emerald-500 text-white py-2 hover:bg-emerald-600"
                  >
                    Upload and Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </article>
      
      {/* AI Insight Popup Modal */}
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
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
