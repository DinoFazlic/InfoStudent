"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserProfilePopup from "@/components/UserProfileCard";

export default function PostApplicantsModal({ postId, type, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null); // NEW

  useEffect(() => {
    if (!postId) return;

    const endpointMap = {
      jobs: "job",
      internships: "internship",
    };

    const endpointType = endpointMap[type] || type;

    fetch(`http://localhost:8000/api/${endpointType}-applications/by-post/${postId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setApplicants(data);
        } else {
          console.error("Unexpected response format:", data);
          setApplicants([]);
        }
      })
      .catch((err) => {
        console.error("Fetch applicants failed", err);
        setApplicants([]);
      })
      .finally(() => setLoading(false));
  }, [postId, type]);

  const handleStatusChange = async (applicationId, newStatus) => {
    const statusUrlMap = {
      jobs: "job",
      internships: "internship",
    };

    const statusType = statusUrlMap[type] || type;

    try {
      const res = await fetch(
        `http://localhost:8000/api/applications/${statusType}/${applicationId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error();

      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, status: newStatus } : a
        )
      );

      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg border border-gray-200 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-700"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Applicants
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : applicants.length === 0 ? (
            <p className="text-gray-500 text-center">No applicants found.</p>
          ) : (
            <ul className="space-y-4">
              {applicants.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedUserId(a.student?.id)}>
                      <img
                        src={
                          a.student?.profile_photo_url
                            ? `http://localhost:8000${a.student.profile_photo_url}`
                            : "/default-avatar.png"
                        }
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover border border-gray-300 hover:ring-2 hover:ring-blue-500 transition"
                      />
                    </button>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {a.student?.first_name} {a.student?.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                      onClick={() =>
                        (window.location.href = `/chat/${a.student?.id}`)
                      }
                    >
                      Message
                    </button>
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedUserId && (
        <UserProfilePopup
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}
