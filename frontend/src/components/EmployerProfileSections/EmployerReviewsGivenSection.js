import React from "react";
import ReviewCard from "@/components/ReviewCard";

function EmployerReviewsGivenSection({ reviewsGiven }) {
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
              comment={review.review_text}
              rating={review.rating}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No reviews written yet.</p>
        )}
      </div>
    </div>
  );
}

export default EmployerReviewsGivenSection;
