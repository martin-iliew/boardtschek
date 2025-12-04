import React from "react";
import { Rating, RatingButton } from "@/components/ui/rating";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onChange,
  size = "md",
  readonly = false,
}) => {
  const iconSize = size === "sm" ? 16 : size === "md" ? 20 : 24;

  return (
    <Rating
      value={rating}
      onValueChange={onChange}
      readOnly={readonly}
      className="flex gap-1"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <RatingButton key={index} size={iconSize} />
      ))}
    </Rating>
  );
};

