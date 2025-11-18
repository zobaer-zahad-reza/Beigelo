import React from "react";

const OptimizedProductImage = ({ publicId, name, className }) => {
  const cloudName = "dkontqr8p";

  // Cloudinary optimization
  const transformations = `f_auto,q_auto`;

  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;

  return (
    <img
      src={imageUrl}
      alt={name || "Product Image"}
      className={className}
      loading="lazy"
    />
  );
};

export default OptimizedProductImage;
