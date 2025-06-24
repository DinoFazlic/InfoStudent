"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { getMe } from "@/utils/api/auth";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { FaEdit, FaTrashAlt, FaEnvelope, FaMapMarkerAlt, FaCoins, FaCalendarAlt, FaBuilding, FaUser, FaBookmark, FaRegBookmark, FaLightbulb } from 'react-icons/fa';

export default function JobCard({ job, onApply, onSaveToggle, onDelete, onEdit }) {
  const router = useRouter();
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
  const [appliedLocal, setAppliedLocal] = useState(job.applied || false);

  useEffect(() => {
    async function fetchUser() {
      const user = await getMe().catch(() => null);
      setMe(user);
    
      console.log("me.id:", user?.id, typeof user?.id);
    console.log("job.author_id:", job?.author_id, typeof job?.author_id);
    }
    fetchUser();
  }, []);

  if (hidden) return null;

  const isEmployer = job.author_role === 'employer' && job.company_name;
  const authorName =
    job.company_name?.trim()
      ? job.company_name
      : job.authorName || `${job.first_name ?? ""} ${job.last_name ?? ""}`.trim() || "Unknown";
  const avatarUrl = job.authorAvatarUrl ?? null;
  const createdIso = job.createdAt ?? null;
  const profileLink = job.author_id ? `/profile/${job.author_id}` : '#';

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!me) {
      router.push("/login");
      return;
    }

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

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(job.id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(job.id);
    }
  };

  const handleApply = (e) => {
    e.stopPropagation();
    if (!me) {
      router.push("/login");
      return;
    }
    if (appliedLocal) return;
    setAppliedLocal(true);
    if (onApply) onApply(job.id);
  };

  const handleMessage = () => {
    if (job.author_id) {
      router.push(`/chat/${job.author_id}`);
    } else {
      toast.error("Cannot message, no user found.");
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

  return (
    <>
      <article className="relative overflow-hidden rounded-2xl shadow-lg bg-[url('/backgrounds/post-bg4.svg')] bg-cover text-slate-800 flex flex-col justify-between">
        {me && (me.id === job.author_id || me.role === "admin") && (
          <div className="absolute top-3 right-7 translate-x-[-10px] flex gap-2 z-10">
            <button
              onClick={handleEditClick}
              className="text-lg font-bold text-blue-600 hover:text-blue-800"
              title="Edit Job"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-lg font-bold text-red-600 hover:text-red-800"
              title="Delete Job"
            >
              <FaTrashAlt />
            </button>
          </div>
        )}

        {me && me.role === "student" && (
          <div className="absolute right-3 top-3 flex gap-2 z-10">
            <button
              onClick={handleToggleSave}
              disabled={savingJob}
              className="text-lg font-bold text-yellow-500 hover:text-yellow-700"
              title={saved ? "Unsave Job" : "Save Job"}
            >
              {saved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
            <button
              disabled
              className="text-lg font-bold text-gray-400 cursor-not-allowed"
              title="AI Insight (disabled)"
            >
              <FaLightbulb />
            </button>
          </div>
        )}

        <div>
          <header className="flex items-center gap-3 p-5 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
            <Link href={profileLink}>
              <div className="cursor-pointer">
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
                    {isEmployer ? <FaBuilding /> : <FaUser />}
    </div>
  )}
              </div>
            </Link>
  <div className="flex flex-col">
              <Link href={profileLink}>
                <span className="font-semibold text-gray-800 hover:text-amber-600 cursor-pointer">{authorName}</span>
              </Link>
              <span className="text-xs text-slate-500">{job.author_email}</span>
              <time className="text-sm text-slate-500">
                Posted: {formatDate(createdIso)}
    </time>
  </div>
</header>

          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{job.description}</p>

            <div className="space-y-3 text-sm">
              {job.location && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{job.location}</span>
                </div>
              )}
            {job.price != null && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCoins className="text-amber-500" />
                  <span className="font-medium">Rate: {job.price} KM/h</span>
                </div>
              )}
              {job.deadline && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>Application Deadline: <strong>{formatDate(job.deadline)}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-white/70 backdrop-blur-sm">
            {!me ? (
                <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                    Log in or Register for More
                </button>
            ) : me.role === "student" ? (
                <div className="flex gap-3">
                    {appliedLocal ? (
                      <button
                        disabled
                        className="flex-1 bg-gray-300 text-gray-600 py-2 px-4 rounded-lg cursor-default flex items-center justify-center gap-2"
                      >
                        Applied
                      </button>
                    ) : (
                      <button
                        onClick={handleApply}
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        Apply Now
                      </button>
                    )}
                    <button
                        onClick={handleMessage}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <FaEnvelope className="text-lg" />
                        Send Message
                    </button>
                </div>
            ) /*: me.role === "employer" && me.id === job.author_id ? (
                <div className="flex gap-3">
                    <button
                        onClick={handleEditClick}
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <FaEdit className="text-lg" />
                        Edit
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <FaTrashAlt className="text-lg" />
                        Delete
                    </button>
                </div>
            ) */: null}
        </div>
      </article>

        {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 relative">
            <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
            <h2 className="text-xl font-semibold">Apply for Job</h2>
            <p><strong>{job.title}</strong></p>
              {me?.student_profile?.cv_url ? (
                <div className="space-y-4">
                <p className="text-sm text-gray-600">Do you want to use your existing CV or upload a new one?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => confirmApply(true)}
                    disabled={applying}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60"
                  >
                    Use Existing CV
                  </button>
                    <button
                    onClick={() => setUploadNewCV(true)}
                    className="flex-1 rounded-lg border-2 border-indigo-600 px-4 py-2 text-indigo-600 font-semibold transition hover:bg-indigo-50 active:scale-[0.98]"
                    >
                    Upload New CV
                    </button>
                  </div>
                </div>
              ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Please upload your CV to apply for this job.</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full"
                  />
                  <button
                    onClick={() => confirmApply(false)}
                  disabled={applying || !selectedFile}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60"
                  >
                  {applying ? "Applying..." : "Submit Application"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      {showInsightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-4 relative">
            <button onClick={() => setShowInsightModal(false)} className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
            <h2 className="text-xl font-semibold">AI Insight</h2>
            <div className="prose max-w-none">
              <p>{aiInsight}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
