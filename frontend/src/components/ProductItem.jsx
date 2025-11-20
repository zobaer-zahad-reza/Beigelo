import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import OptimizedProductImage from "./OptimizedProductImage";
import slugify from "slugify";

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
}) => {
  const { currency } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);

  const publicId1 = getPublicIdFromUrl(image[0]);
  // চেক করা হচ্ছে দ্বিতীয় ইমেজ আছে কিনা, না থাকলে প্রথমটাই ব্যবহার হবে
  const publicId2 = image[1] ? getPublicIdFromUrl(image[1]) : null;
  const publicIdToShow = isHovered && publicId2 ? publicId2 : publicId1;

  const imageClassName = `transition-all duration-500 ease-in-out ${
    isHovered ? "scale-110" : "scale-100"
  }`;

  // Slugify দিয়ে URL Friendly নাম তৈরি করা
  const categorySlug = slugify(categoryName || "item", {
    lower: true,
    strict: true,
  });
  const subCategorySlug = slugify(subCategory || "subcategory", {
    lower: true,
    strict: true,
  });
  const productSlug = slugify(name || "product", { lower: true, strict: true });

  // ডাইনামিক লিংক তৈরি
  const productUrl = `/product/${categorySlug}/${subCategorySlug}/${productSlug}/${id}`;

  return (
    <Link
      className="text-gray-700 cursor-pointer"
      to={productUrl}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden">
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

      <div className="pt-3 px-1 flex flex-col gap-0.5">
        {brand && <p className="text-sm text-gray-500">{brand}</p>}
        <p className="pt-0.5 pr-2 pb-0 text-base font-medium text-gray-800 ">
          {name}
        </p>
        <p className="text-base font-bold text-black">
          {currency} {price}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
