import React from "react";
import styles from "@/styles/Profile.module.css";
import ReviewCard from "@/components/ReviewCard";

function EmployerReviewsGivenSection({ reviewsGiven }) {
  return (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>My Reviews History</h2>
      <div className={styles.reviewsList}>
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
          <p>No reviews written yet.</p>
        )}
      </div>
    </div>
  );
}

export default EmployerReviewsGivenSection;
