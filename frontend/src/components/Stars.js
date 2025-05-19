import React from "react";
import styles from '@/styles/Profile.module.css';

function Stars({ rating }) {
  const fullStars = Math.round(rating);
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) {
      return "★";
    } else {
      return "☆";
    }
  });

  return <span className={styles.stars}>{stars.join("")}</span>;
}

export default Stars;
