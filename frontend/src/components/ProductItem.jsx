import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import OptimizedProductImage from "./OptimizedProductImage";
import slugify from "slugify";

// --- Helper Function: Safely extract ID ---
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    // Standard Cloudinary Regex (looks for /upload/v1234/filename)
    const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

const ProductItem = ({
  id,
  image,
  name,
  brand,
  price,
  offerPrice,
  categoryName,
  subCategory,
  quantity,
}) => {
  const { currency } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);

  const isSoldOut = quantity === 0;

  const numPrice = Number(price);
  const numOfferPrice = Number(offerPrice);

  const hasDiscount = numOfferPrice > 0 && numOfferPrice < numPrice;

  const discountPercentage = hasDiscount
    ? Math.round(((numPrice - numOfferPrice) / numPrice) * 100)
    : 0;

  // --- IMAGE LOGIC (FIXED) ---
  // 1. Check if image array exists
  const hasImage = Array.isArray(image) && image.length > 0;

  // 2. Get Raw URLs
  const primaryImageUrl = hasImage ? image[0] : null;
  const secondaryImageUrl = hasImage && image.length > 1 ? image[1] : null;

  // 3. Try to extract Public IDs (Cloudinary Optimization)
  const publicId1 = getPublicIdFromUrl(primaryImageUrl);
  const publicId2 = getPublicIdFromUrl(secondaryImageUrl);

  // 4. Determine what to show based on Hover
  const showSecondary = isHovered && secondaryImageUrl;

  // Decide which ID and URL is currently active
  const activePublicId = showSecondary ? publicId2 : publicId1;
  const activeImageUrl = showSecondary ? secondaryImageUrl : primaryImageUrl;

  const imageClassName = `transition-all duration-500 ease-in-out object-cover ${
    isHovered && !isSoldOut ? "scale-110" : "scale-100"
  } `;

  // Slugs for URL
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

  return (
    <Link
      className={`text-gray-700 cursor-pointer block `}
      to={productUrl}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden relative rounded-sm">
        {/* --- SOLD OUT BADGE --- */}
        {isSoldOut && (
          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
            Sold Out
          </div>
        )}

        {/* --- DISCOUNT BADGE --- */}
        {!isSoldOut && hasDiscount && (
          <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
            -{discountPercentage}% OFF
          </div>
        )}

        {/* --- SMART IMAGE RENDERING --- */}
        {activePublicId ? (
          // Plan A: Jodi ID thikmoto extract kora jay, Optimized Image use koro
          <OptimizedProductImage
            className={imageClassName}
            publicId={activePublicId}
            width={390}
            height={450}
            name={name}
          />
        ) : activeImageUrl ? (
          // Plan B: Jodi ID na pawa jay, Database er raw Link use koro (Fallback)
          <img
            src={activeImageUrl}
            alt={name}
            className={imageClassName}
            width={390}
            height={450}
            loading="lazy"
            style={{ width: "100%", height: "auto", aspectRatio: "390/450" }}
          />
        ) : (
          // Plan C: Jodi Image e na thake
          <div
            className="bg-gray-200 flex items-center justify-center text-gray-400"
            style={{ width: "100%", aspectRatio: "390/450" }}
            aria-label={name}
          >
            No Image
          </div>
        )}
      </div>

      <div className="pt-3 px-1 flex flex-col gap-0.5">
        {brand && <p className="text-sm text-gray-500">{brand}</p>}
        <p className="pt-0.5 pr-2 pb-0 text-base text-wrap font-medium text-gray-800 truncate line-clamp-2">
          {name}
        </p>

        {/* --- Price Section --- */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {/* Main Price */}
            <p
              className={`text-base font-bold ${
                isSoldOut ? "text-gray-400 line-through" : "text-black"
              }`}
            >
              {currency} {hasDiscount ? numOfferPrice : numPrice}
            </p>

            {/* Old Price */}
            {hasDiscount && !isSoldOut && (
              <p className="text-xs text-gray-400 line-through">
                {currency} {numPrice}
              </p>
            )}
          </div>

          {isSoldOut && (
            <span className="text-xs text-red-500 font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
