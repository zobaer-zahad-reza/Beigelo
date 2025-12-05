import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import slugify from "slugify";

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


  const primaryImageUrl = Array.isArray(image) && image.length > 0 ? image[0] : null;
  const secondaryImageUrl = Array.isArray(image) && image.length > 1 ? image[1] : null;

  const activeImageUrl = isHovered && secondaryImageUrl ? secondaryImageUrl : primaryImageUrl;

  const imageClassName = `transition-all duration-500 ease-in-out object-cover ${
    isHovered && !isSoldOut ? "scale-110" : "scale-100"
  } `;
// slug for url
  const categorySlug = slugify(categoryName || "item", { lower: true, strict: true });
  const subCategorySlug = slugify(subCategory || "subcategory", { lower: true, strict: true });
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
        {/*SOLD OUT BADGE */}
        {isSoldOut && (
          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
            Sold Out
          </div>
        )}

        {/* DISCOUNT BADGE */}
        {!isSoldOut && hasDiscount && (
          <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
            -{discountPercentage}% OFF
          </div>
        )}

        {/* IMAGE RENDERING */}
        {activeImageUrl ? (
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
          // if there is no image
          <div
            className="bg-gray-200 flex items-center justify-center text-gray-400"
            style={{ width: "100%", aspectRatio: "390/450" }}
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

        {/* Price Section */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <p
              className={`text-base font-bold ${
                isSoldOut ? "text-gray-400 line-through" : "text-black"
              }`}
            >
              {currency} {hasDiscount ? numOfferPrice : numPrice}
            </p>

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