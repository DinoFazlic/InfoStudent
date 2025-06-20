"use client";

import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import UserProfilePopup from "@/components/UserProfileCard";

function ReviewCard({ name, rating, comment, avatarUrl, reviewerId, onDelete, onEdit }) {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleOpenPopup = () => {
    if (reviewerId) {
      setSelectedUserId(reviewerId);
    }console.log("reviewerId:", reviewerId);
  };

  return (
    <>
      <div className="w-[90%] max-w-[500px] bg-gray-50 rounded-xl p-4 mb-4 shadow-[0_4px_12px_rgba(50,90,140,0.07)]">
        <div className="flex justify-between mb-2 items-center">
          <div className="flex items-center gap-3">
            <button onClick={handleOpenPopup} className="focus:outline-none">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 hover:ring-2 hover:ring-blue-500 transition"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold border border-blue-300 shadow">
                  {name?.[0] || "?"}
                </div>
              )}
            </button>
            <span className="font-semibold text-blue-500">{name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-500">{rating}/5</span>
            {onEdit && (
              <button onClick={onEdit} title="Edit" className="text-blue-500 hover:text-blue-700">
                <FaEdit />
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} title="Delete" className="text-red-500 hover:text-red-700">
                <FaTrashAlt />
              </button>
            )}
          </div>
        </div>
        <p className="text-gray-700 text-sm">{comment}</p>
      </div>

      {/* Profile popup */}
      {selectedUserId && (
        <UserProfilePopup
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}

export default ReviewCard;
