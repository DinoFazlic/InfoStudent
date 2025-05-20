import React from "react";
import ReviewCard from "../ReviewCard";
import styles from '@/styles/Profile.module.css';

function StudentReviewsGivenSection({ reviewsGiven }) {
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
          <p>You haven't left any reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default StudentReviewsGivenSection;