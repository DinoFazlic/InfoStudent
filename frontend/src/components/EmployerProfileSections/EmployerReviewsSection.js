import React from "react";
import styles from "@/styles/Profile.module.css";
import Stars from "@/components/Stars";
import ReviewCard from "@/components/ReviewCard";

function EmployerReviewsSection({ reviewsReceived, averageScore }) {
  return (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>Reviews</h2>
      <div className={styles.averageScoreDisplay}>
        {averageScore}/5 <Stars rating={averageScore} />
      </div>
      <div className={styles.reviewsList}>
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
          <p>No reviews received yet.</p>
        )}
      </div>
    </div>
  );
}

export default EmployerReviewsSection;
