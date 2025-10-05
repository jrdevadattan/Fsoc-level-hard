"use client";

import { useState, useEffect } from "react";
import FeedbackManager from "../utils/FeedbackManager";

const StarRating = ({ questionId, userId, onRatingSubmit, initialRating = 0, readonly = false, size = "md" }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (questionId && userId && !readonly) {
      const existingRating = FeedbackManager.getUserRating(questionId, userId);
      if (existingRating) {
        setRating(existingRating);
        setHasRated(true);
      } else {
        setRating(0);
        setHasRated(false);
      }
    }
  }, [questionId, userId, readonly]);

  const handleRatingClick = (value) => {
    if (readonly) return;
    
    // Allow changing rating even if already rated
    setRating(value);
    FeedbackManager.addRating(questionId, userId, value);
    setHasRated(true);
    setShowThankYou(true);
    
    if (onRatingSubmit) onRatingSubmit(value);

    setTimeout(() => setShowThankYou(false), 2000);
  };

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const starSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => !readonly && setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className={`transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} focus:outline-none`}
            disabled={readonly}
            type="button"
          >
            <svg
              className={`${starSize} ${
                star <= (hoveredRating || rating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              } transition-colors`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      
      {showThankYou && !readonly && (
        <p className="text-sm text-green-600 font-medium animate-fadeInUp">
          {hasRated && rating > 0 ? "Rating updated! ✓" : "Thank you for rating! ✓"}
        </p>
      )}
      
      {hasRated && !showThankYou && !readonly && rating > 0 && (
        <p className="text-xs text-gray-500">
          You rated this {rating} star{rating > 1 ? "s" : ""} • Click to change
        </p>
      )}
    </div>
  );
};

export default StarRating;