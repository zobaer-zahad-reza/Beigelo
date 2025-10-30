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

const ProductItem = ({ id, image, name, price, categoryName, subCategory }) => {
  const { currency } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);

  const publicId1 = getPublicIdFromUrl(image[0]);
  const publicId2 = getPublicIdFromUrl(image[1]);
  const publicIdToShow = isHovered && publicId2 ? publicId2 : publicId1;
  const imageClassName = `transition-transform duration-300 ease-in-out ${
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
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency} {price}
      </p>
    </Link>
  );
};

export default ProductItem;
