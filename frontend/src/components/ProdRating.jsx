"use client";

import { Rating, RatingButton } from "@/components/kibo-ui/rating";

const ProdRating = () => (
  <Rating defaultValue={4}>
    {Array.from({ length: 5 }).map((_, index) => (
      <RatingButton className="text-yellow-500" key={index} />
    ))}
  </Rating>
);

export default ProdRating;
