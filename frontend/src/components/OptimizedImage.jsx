import React from 'react';

const OptimizedProductImage = ({ publicId, width, height, name }) => {
  const cloudName = 'dkontqr8p';
  
  // Best transformation string for e-commerce
  const transformations = `w_${width},h_${height},c_fill,f_auto,q_auto`;

  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;

  return <img src={imageUrl} alt={name || "Product Image"} style={{width: '100%', height: 'auto'}} />;
};

export default OptimizedProductImage;