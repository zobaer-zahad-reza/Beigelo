import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProduct from "../components/RelatedProduct";
import OptimizedImage from "../components/OptimizedImage";


// <<< ধাপ ২: URL থেকে publicId বের করার জন্য একটি হেল্পার ফাংশন
const getPublicIdFromUrl = (url) => {
  // URL থেকে publicId বের করার জন্য এই অংশটুকু যথেষ্ট
  const parts = url.split("/");
  const publicIdWithFormat = parts[parts.length - 1];
  const publicId = publicIdWithFormat.split(".")[0];
  return publicId;
};

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null); // 초기값을 null로 변경
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentProduct = products.find((item) => item._id === productId);
    if (currentProduct) {
      setProductData(currentProduct);
      setImage(currentProduct.image[0]); // এখানে সম্পূর্ণ URL সেট হবে
    }
  }, [productId, products]);

  // productData লোড না হওয়া পর্যন্ত কিছু রেন্ডার না করা ভালো
  if (!productData) {
    return <div>Loading...</div>; // অথবা একটি স্পিনার দেখাতে পারেন
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((itemUrl, index) => (

              <div
                key={index}
                onClick={() => setImage(itemUrl)}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              >
                <OptimizedImage
                  publicId={getPublicIdFromUrl(itemUrl)}
                  name={productData.name}
                  width={390}
                  height={450}
                />
              </div>
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            {image && (
              <OptimizedImage
                publicId={getPublicIdFromUrl(image)}
                name={productData.name}
                width={800} 
                height={900}
              />
            )}
          </div>
        </div>
        {/* Product Information */}
        <div className="flex-1">
          <h1 className="font-medium text-3xl">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">{122}</p>
          </div>
          <p className="mt-3 text-2xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-3 text-gray-400 md:w-4/5">
            {productData.description}
          </p>

          <div className="space-x-4">
            <button
              onClick={() => addToCart(productData._id)}
              className="bg-black text-white px-8 py-3 mt-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white px-8 py-3 mt-3 text-sm active:bg-gray-700"
            >
              BUY NOW
            </button>
          </div>
          <div className="text-sm text-gray-600 mt-6 flex flex-col gap-1">
            <p>100% original Product</p>
            <p>cash on delivery is available on this product</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>
      {/* Description and Review Section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews(122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only
            five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.{" "}
          </p>
          <p>
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem
          </p>
        </div>
      </div>
      {/* Description and Review Section */}

      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;