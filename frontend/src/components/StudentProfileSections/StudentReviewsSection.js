import React from "react";
import Stars from "../Stars";
import ReviewCard from "../ReviewCard";
import styles from '@/styles/Profile.module.css';

function StudentReviewsSection({ reviewsReceived, averageScore }) {
  return (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>Your Rating</h2>
      <div className={styles.averageScoreDisplay}>{averageScore}/5 <Stars rating={averageScore} /></div>
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
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default StudentReviewsSection;