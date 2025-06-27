import React, { useState } from "react";
import ReviewCard from "../ReviewCard";
import { toast } from "react-hot-toast";

function StudentReviewsGivenSection({ reviewsGiven, setReviewsGiven }) {
  const [editingReview, setEditingReview] = useState(null); 
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(5);

  const handleDeleteReview = async (reviewId) => {

    try {
      const res = await fetch(`http://localhost:8000/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setReviewsGiven((prev) => prev.filter((r) => r.id !== reviewId));
        toast.success("Review deleted.");
      } else {
        toast.error("Failed to delete review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting review.");
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:8000/reviews/${editingReview.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: editedComment,
          rating: editedRating,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setReviewsGiven((prev) =>
          prev.map((r) =>
            r.id === editingReview.id
              ? { ...r, comment: editedComment, rating: editedRating }
              : r
          )
        );
        toast.success("Review updated!");
        setEditingReview(null);
      } else {
        toast.error("Failed to update review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating review.");
    }
  };

  return (
    <div className="bg-gray-100 ring-1 p-[35px] md:p-[45px] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[800px] w-full">
      <h2 className="text-[1.8rem] font-bold text-gray-800 mb-[25px] text-center">
        My Reviews History
      </h2>
      <div className="flex flex-col items-center w-full">
        {reviewsGiven.length > 0 ? (
          reviewsGiven.map((review, index) => (
            <ReviewCard
              key={index}
              name={review.reviewee_name || "Unknown"}
              comment={review.comment}
              rating={review.rating}
              avatarUrl={review.avatar_url}
              reviewerId={review.reviewee_id}
              onDelete={() => handleDeleteReview(review.id)}
              onEdit={() => handleEditClick(review)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">You haven't left any reviews yet.</p>
        )}
      </div>

      {editingReview && (
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Edit Review</h3>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4 resize-none"
              rows={4}
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-700">Rating:</label>
              <input
                type="number"
                min={1}
                max={5}
                value={editedRating}
                onChange={(e) => setEditedRating(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 w-20 text-center"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingReview(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentReviewsGivenSection;
