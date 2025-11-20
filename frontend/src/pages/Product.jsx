import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProduct";
import OptimizedProductImage from "../components/OptimizedProductImage";
import Spinner from "../components/Spinner";
import ProdRating from "../components/ProdRating";
import { Helmet, HelmetProvider } from "react-helmet-async";
import slugify from "slugify";

const getPublicIdFromUrl = (url) => {
  if (!url) return "";
  const parts = url.split("/");
  const publicIdWithFormat = parts[parts.length - 1];
  const publicId = publicIdWithFormat.split(".")[0];
  return publicId;
};

const Product = () => {
  const { productSlug } = useParams();
  const { products, currency, addToCart, buyNow } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentProduct = products.find((item) => {
      const itemSlug = slugify(item.name, { lower: true, strict: true });
      return itemSlug === productSlug;
    });

    if (currentProduct) {
      setProductData(currentProduct);
      setImage(currentProduct.image[0]);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_item",
        content_name: currentProduct.name,
        content_ids: [currentProduct._id],
        content_category: currentProduct.category,
        value: currentProduct.price,
        currency: "BDT",
      });
    }
  }, [productSlug, products, currency]);

  if (!productData) {
    return <Spinner />;
  }

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: productData.name,
    image: productData.image,
    description: productData.description,
    brand: {
      "@type": "Brand",
      name: productData.brand || "Beigelo",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: productData.price,
      availability: "https://schema.org/InStock",
      url: window.location.href,
    },
  };

  return (
    <HelmetProvider>
      <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
        <Helmet>
          <title>{`${productData.name} | Beigelo`}</title>
          <meta
            name="description"
            content={productData.description.substring(0, 160)}
          />
          <meta property="og:title" content={productData.name} />
          <meta
            property="og:description"
            content={productData.description.substring(0, 100)}
          />
          <meta property="og:image" content={productData.image[0]} />
          <meta property="og:type" content="product" />
          <meta property="product:price:amount" content={productData.price} />
          <meta property="product:price:currency" content="BDT" />
          <script type="application/ld+json">
            {JSON.stringify(productSchema)}
          </script>
        </Helmet>

        {/* Product Data */}
        <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
          {/* --- Product Images --- */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
              {productData.image.map((itemUrl, index) => (
                <div
                  key={index}
                  onClick={() => setImage(itemUrl)}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border border-transparent hover:border-gray-300 rounded-md aspect-square overflow-hidden flex items-center justify-center"
                >
                  <OptimizedProductImage
                    publicId={getPublicIdFromUrl(itemUrl)}
                    name={productData.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="w-full sm:w-[75%]">
              <div className="w-full h-[300px] sm:h-[650px] rounded-lg overflow-hidden flex items-center justify-center relative">
                {image && (
                  <OptimizedProductImage
                    publicId={getPublicIdFromUrl(image)}
                    name={productData.name}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="flex-1">
            <h1 className="font-medium text-3xl">{productData.name}</h1>

            {productData.brand && (
              <h2 className="text-lg text-gray-700 font-semibold mt-1">
                {productData.brand}
              </h2>
            )}

            <div className="flex items-center gap-1 mt-2">
              <ProdRating />
              <p className="pl-2 text-sm text-gray-500">({138} reviews)</p>
            </div>

            <p className="mt-4 text-3xl font-bold text-black">
              {currency}
              {productData.price}
            </p>

            <p className="mt-4 text-gray-600 md:w-4/5">
              {productData.description}
            </p>

            {/* --- Button Section--- */}
            <div className="flex flex-col gap-3 mt-6 max-w-xs">
              <button
                onClick={() => addToCart(productData._id)}
                className="w-full bg-white text-black border border-black py-3 text-sm font-medium active:bg-gray-200 hover:bg-gray-100 transition-colors"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => buyNow(productData._id)}
                className="w-full bg-black text-white py-3 text-sm font-medium active:bg-gray-700 hover:bg-gray-800 transition-colors"
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* Description and Review Section */}
        <div className="mt-20">
          <div className="flex">
            <b className="border px-5 py-3 text-sm bg-gray-50">Description</b>
          </div>

          {/* --- Description Box --- */}
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span>🛡️</span>
              <span>
                Experience the assurance of 100% original and authentic
                products, crafted to meet the highest standards of quality.
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span>🚚</span>
              <span>
                Enjoy the convenience of Cash on Delivery, giving you full
                confidence in every purchase.
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span>↩️</span>
              <span>
                We value your satisfaction above all — that’s why we offer a
                simple 7-day return and exchange policy, ensuring a smooth and
                worry-free shopping experience.
              </span>
            </p>
            <p className="mt-2 font-medium text-gray-700">
              Shop smart. Shop genuine. Shop with trust and comfort.
            </p>
          </div>
        </div>

        <RelatedProduct
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </HelmetProvider>
  );
};

export default Product;
