"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PostApplicantsModal({ postId, type, onClose }) {
  const [applicants, setApplicants] = useState([]);

    useEffect(() => {
    if (!postId) return;
        fetch(`http://localhost:8000/api/${type}-applications/by-post/${postId}`, {
        credentials: "include",
    })
        .then((res) => res.json())
        .then((data) => {
        if (Array.isArray(data)) {
            setApplicants(data);
        } else {
            console.error("Unexpected response format:", data);
            setApplicants([]); // fallback na prazan niz
        }
        })
        .catch((err) => {
        console.error("Fetch applicants failed", err);
        setApplicants([]); // fallback i na grešku
        });
    }, [postId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/applications/${type}/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Applicants</h2>

        {applicants.length === 0 ? (
          <p className="text-gray-600 text-center">No applicants found.</p>
        ) : (
          <ul className="space-y-3">
            {applicants.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between p-3 rounded border"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                        a.student?.profile_photo_url
                        ? `http://localhost:8000${a.student.profile_photo_url}`
                        : "/default-avatar.png" // preuzmi iz Next.js `public/`
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                    />
                  <span>{a.student?.first_name} {a.student?.last_name}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <button className="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded">
                    Message
                  </button>
                  <select
                    value={a.status}
                    onChange={(e) => handleStatusChange(a.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
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
  );
}
