import React from "react";

function ReviewCard({ name, rating, comment }) {
  return (
    <div className="w-[90%] max-w-[500px] bg-gray-50 rounded-xl p-4 mb-4 shadow-[0_4px_12px_rgba(50,90,140,0.07)]">
      <div className="flex justify-between mb-2">
        <span className="font-semibold text-blue-500">{name}</span>
        <span className="font-bold text-blue-500">{rating}/5</span>
      </div>
      <textarea
        className="w-full bg-transparent border-none text-gray-700 text-base resize-none"
        value={comment}
        disabled
        rows={2}
      />
    </div>
  );
}

export default ReviewCard;
