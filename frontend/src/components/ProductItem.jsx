import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import OptimizedProductImage from "./OptimizedProductImage";
import slugify from "slugify";

// Helper function for Cloudinary ID
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const ProductItem = ({
  id,
  image,
  name,
  brand,
  price,
  categoryName,
  subCategory,
  rating = 4,
  reviews = 45,
}) => {
  const { currency } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);

  const publicId1 = getPublicIdFromUrl(image[0]);
  const publicId2 = image[1] ? getPublicIdFromUrl(image[1]) : null;
  const publicIdToShow = isHovered && publicId2 ? publicId2 : publicId1;

  const imageClassName = `transition-all duration-500 ease-in-out ${
    isHovered ? "scale-110" : "scale-100"
  }`;

  const categorySlug = slugify(categoryName || "item", {
    lower: true,
    strict: true,
  });
  const subCategorySlug = slugify(subCategory || "subcategory", {
    lower: true,
    strict: true,
  });
  const productSlug = slugify(name || "product", { lower: true, strict: true });

  const productUrl = `/product/${categorySlug}/${subCategorySlug}/${productSlug}`;

  // Star Rendering Logic
  const renderStars = (ratingValue) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-3.5 h-3.5 ${
          index < Math.round(ratingValue) ? "text-orange-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <Link
      className="text-gray-700 cursor-pointer block group" // group class add kora holo better hover control er jonno
      to={productUrl}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-sm">
        {" "}
        {/* Optional: rounded corner */}
        {publicIdToShow ? (
          <OptimizedProductImage
            className={imageClassName}
            publicId={publicIdToShow}
            width={390}
            height={450}
            name={name}
          />
        ) : (
          <div
            className="bg-gray-200"
            style={{ width: 390, height: 450 }}
            aria-label={name}
          />
        )}
      </div>

      <div className="pt-3 px-1 flex flex-col gap-1">
        {brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {brand}
          </p>
        )}

        <p className="text-sm font-medium text-gray-800 truncate line-clamp-1">
          {name}
        </p>

        {/* --- Rating Section Start --- */}
        <div className="flex items-center gap-1">
          <div className="flex">{renderStars(rating)}</div>
          {reviews > 0 && <p className="text-xs text-gray-500">({reviews})</p>}
        </div>
        {/* --- Rating Section End --- */}

        <p className="text-base font-bold text-black mt-1">
          {currency} {price}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
