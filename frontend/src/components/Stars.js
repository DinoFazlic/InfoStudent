import React from "react";

function Stars({ rating }) {
  const fullStars = Math.round(rating);
  const stars = Array.from({ length: 5 }, (_, i) => {
    return i < fullStars ? "★" : "☆";
  });

  return (
    <span className="text-yellow-400 text-[1.3rem]">
      {stars.join("")}
    </span>
  );
}

export default Stars;
