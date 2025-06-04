import React from "react";
import Stars from "@/components/Stars";
import ReviewCard from "@/components/ReviewCard";

function EmployerReviewsSection({ reviewsReceived, averageScore }) {
  return (
    <div className="bg-gray-100 ring-1 p-[35px] md:p-[45px] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[800px] w-full">
      <h2 className="text-[1.8rem] font-bold text-gray-800 mb-[25px] text-center">
        Reviews
      </h2>
      <div className="text-center mb-5 text-[1.3rem] text-slate-800 flex justify-center items-center gap-2">
        {averageScore}/5 <Stars rating={averageScore} />
      </div>
      <div className="flex flex-col items-center w-full">
        {reviewsReceived.length > 0 ? (
          reviewsReceived.map((review, index) => (
            <ReviewCard
              key={index}
              name={review.reviewer_name || "Anonymous"}
              comment={review.review_text}
              rating={review.rating}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No reviews received yet.</p>
        )}
      </div>
    </div>
  );
}

export default EmployerReviewsSection;
