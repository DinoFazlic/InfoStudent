import React from "react";
import styles from '@/styles/Profile.module.css';

function ReviewCard({ name, rating, comment }) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <span className={styles.reviewName}>{name}</span>
        <span className={styles.reviewRating}>{rating}/5</span>
      </div>
      <textarea className={styles.reviewText} value={comment} disabled rows={2} />
    </div>
  );
}

export default ReviewCard;