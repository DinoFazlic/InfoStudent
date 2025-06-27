"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getMe } from "@/utils/api/auth";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaBuilding, FaUser, FaCoins, FaEdit, FaTrashAlt, FaBookmark, FaRegBookmark, FaEnvelope, FaLightbulb, FaSpinner } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { saveInternship, unsaveInternship } from "@/utils/api/internships";

export default function InternshipCard({ item, onApply, onSaveToggle, onDelete, onEdit }) {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(item.saved || false);
  const [applied, setApplied] = useState(item.applied || false);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [appliedLocal, setAppliedLocal] = useState(applied);
  const [aiInsight, setAiInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        setMe(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (item.application_deadline) {
      const deadline = new Date(item.application_deadline);
      const now = new Date();
      setHidden(deadline < now);
    }
  }, [item.application_deadline]);

  if (hidden) return null;

  const isEmployer = item.author_role === 'employer' && item.company_name;
  const authorName = isEmployer
    ? item.company_name
    : `${item.author_first_name || ''} ${item.author_last_name || ''}`.trim();  const avatarUrl = item.author_avatar_url || null;
  const profileLink = item.author_id ? `/profile/${item.author_id}` : '#';

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const duration = item.start_date && item.end_date
    ? `${formatDate(item.start_date)} - ${formatDate(item.end_date)}`
    : "Not specified";

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    if (!me) {
      router.push("/login");
      return;
    }

    setIsSaving(true);
    try {
      if (saved) {
        await unsaveInternship(item.id);
        setSaved(false);
        onSaveToggle && onSaveToggle(item.id, false);
      } else {
        await saveInternship(item.id);
        setSaved(true);
        onSaveToggle && onSaveToggle(item.id, true);
      }
    } catch (error) {
      console.error("Error saving internship:", error);
      toast.error("Failed to save internship");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/internships/${item.id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(item.id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item.id);
    }
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (!me) {
      router.push("/login");
      return;
    }
    if (appliedLocal) return;
    setAppliedLocal(true);
  };

  const handleMessage = () => {
    if (item.author_id) {
      router.push(`/chat/${item.author_id}`);
    } else {
      toast.error("Cannot message, no user found.");
    }
  };

  const fetchInsight = async () => {
    if (!item.description) {
      toast.error("Internship description is missing. Cannot generate AI Insight.");
      return;
    }
    setLoadingInsight(true);
    try {
      const response = await axios.post("http://localhost:8000/ai/insight", { description: item.description }, { withCredentials: true });
      setAiInsight(response.data.insight);
      setShowInsightModal(true);
    } catch (err) {
      console.error("AI Insight error:", err);
      toast.error("Could not fetch AI Insight.");
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <>
      <article className="relative overflow-hidden rounded-2xl shadow-lg bg-[url('/backgrounds/post-bg4.svg')] bg-cover text-slate-800 flex flex-col justify-between">
        {me && (me.id === item.author_id || me.role === "admin") && (
          <div className="absolute top-3 right-7 translate-x-[-10px] flex gap-2 z-10">
            <button
              onClick={handleEditClick}
              className="text-lg font-bold text-blue-600 hover:text-blue-800"
              title="Edit Internship"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-lg font-bold text-red-600 hover:text-red-800"
              title="Delete Internship"
            >
              <FaTrashAlt />
            </button>
          </div>
        )}

        {me && me.role === "student" && (
          <div className="absolute right-3 top-3 flex gap-2 z-10">
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className="text-lg font-bold text-yellow-500 hover:text-yellow-700"
              title={saved ? "Unsave Internship" : "Save Internship"}
            >
              {saved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
            <button
              onClick={fetchInsight}
              disabled={loadingInsight}
              className="text-lg font-bold text-purple-500 hover:text-purple-700"
              title={loadingInsight ? "Generating Insight..." : "AI Insight"}
            >
              {loadingInsight ? <FaSpinner className="animate-spin" /> : <FaLightbulb />}
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
                    <span className="text-xs text-slate-500">{item.author_email}</span>
                    <time className="text-sm text-slate-500">
                        Posted: {formatDate(item.posted_at)}
                    </time>
                </div>
            </header>

            <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                <div className="space-y-3 text-sm">
                    {item.location && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.stipend != null && (
                       <div className="flex items-center gap-3 text-gray-700">
                        <FaCoins className="text-amber-500" />
                        <span className="font-medium">Stipend: {item.stipend} KM</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>Application Deadline: <strong>{formatDate(item.application_deadline)}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaClock className="text-gray-400" />
                      <span>Duration: <strong>{duration}</strong></span>
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
                              onClick={handleApplyClick}
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
                ) /*: me.role === "employer" && me.id === item.author_id ? (
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
        </div>
      </article>

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 relative">
            <button onClick={() => setShowApplyModal(false)} className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
            <h2 className="text-xl font-semibold">Apply for Internship</h2>
            <p><strong>{item.title}</strong></p>
            {me?.student_profile?.cv_url ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Do you want to use your existing CV or upload a new one?</p>
                <button onClick={() => confirmApply(true)} className="w-full rounded bg-indigo-600 text-white py-2 hover:bg-indigo-500">Use Existing CV</button>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setSelectedFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                <button onClick={() => confirmApply(false)} disabled={!selectedFile} className="w-full rounded border border-indigo-600 text-indigo-600 py-2 hover:bg-indigo-50 disabled:opacity-50">Upload New CV and Apply</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-gray-600">You don't have a saved CV. Please upload one here:</p>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setSelectedFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                <button onClick={() => confirmApply(false)} disabled={!selectedFile} className="w-full rounded bg-indigo-600 text-white py-2 hover:bg-indigo-500 disabled:opacity-50">Upload CV and Apply</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showInsightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-4 relative">
            <button onClick={() => setShowInsightModal(false)} className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
            <h2 className="text-xl font-semibold text-center text-indigo-600">
              AI Insight for {item.title}
            </h2>
            <div className="prose max-w-none max-h-96 overflow-y-auto whitespace-pre-wrap text-sm">
              {aiInsight}
            </div>
          </div>
        </div>
      )}
    </>
  );
}