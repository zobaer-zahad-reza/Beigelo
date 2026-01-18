import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProduct";
// import OptimizedProductImage from "../components/OptimizedProductImage";
import Spinner from "../components/Spinner";
import { Helmet, HelmetProvider } from "react-helmet-async";
import slugify from "slugify";
import { FaWhatsapp } from "react-icons/fa";

const Product = () => {
  const { productSlug } = useParams();
  const { products, currency, addToCart, buyNow } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");

  const yourWhatsAppNumber = "8801630071818";

  // Zoom State
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center",
    transform: "scale(1)",
  });

  useEffect(() => {
    const currentProduct = products.find((item) => {
      const itemSlug = slugify(item.name, { lower: true, strict: true });
      return itemSlug === productSlug;
    });

    if (currentProduct) {
      setProductData(currentProduct);
      setImage(currentProduct.image[0]);

      const pPrice = Number(currentProduct.price);
      const pOffer = Number(currentProduct.offerPrice);
      const finalPrice = pOffer > 0 && pOffer < pPrice ? pOffer : pPrice;

      // Google Analytics Data Layer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_item",
        content_name: currentProduct.name,
        content_ids: [currentProduct._id],
        content_category: currentProduct.category,
        value: finalPrice,
        currency: "BDT",
      });
    }
  }, [productSlug, products, currency]);

  // Zoom Handle Logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.5)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center",
      transform: "scale(1)",
    });
  };

  // WhatsApp Button Handler
  const handleWhatsAppRequest = () => {
    if (!productData) return;
    const message = `Hi, I am interested in "${productData.name}" but it is currently Sold Out. Can you please let me know if it becomes available?`;
    const url = `https://wa.me/${yourWhatsAppNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  if (!productData) {
    return <Spinner />;
  }

  // Sold Out Check
  const isSoldOut = productData.quantity === 0;

  // Price & Discount Logic
  const numPrice = Number(productData.price);
  const numOfferPrice = Number(productData.offerPrice);
  const hasDiscount = numOfferPrice > 0 && numOfferPrice < numPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((numPrice - numOfferPrice) / numPrice) * 100)
    : 0;

  // Schema for SEO
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
      price: hasDiscount ? numOfferPrice : numPrice,
      availability: isSoldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
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
          <meta
            property="product:price:amount"
            content={hasDiscount ? numOfferPrice : numPrice}
          />
          <meta property="product:price:currency" content="BDT" />
          <script type="application/ld+json">
            {JSON.stringify(productSchema)}
          </script>
        </Helmet>

        {/* Product Data */}
        <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
          
          {/* --- Product Images Section --- */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            
           
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
              {productData.image.map((itemUrl, index) => (
                <div
                  key={index}
                  onClick={() => setImage(itemUrl)}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border border-transparent hover:border-gray-300 rounded-md aspect-square overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={itemUrl}
                    alt={productData.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* --- Main Image View (Big Image) --- */}
            <div className="w-full sm:w-[65%]">
              <div
                className="w-full h-auto rounded-lg overflow-hidden relative cursor-zoom-in bg-white border border-gray-100"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* SOLD OUT BADGE */}
                {isSoldOut && (
                  <div className="absolute top-4 left-4 z-20 bg-red-600 text-white px-4 py-1.5 rounded font-bold shadow-lg text-sm uppercase tracking-widest">
                    Sold Out
                  </div>
                )}

                {/* DISCOUNT BADGE */}
                {!isSoldOut && hasDiscount && (
                  <div className="absolute top-4 right-4 z-0 bg-green-500 text-white px-3 py-1 rounded-full font-bold shadow-md text-sm">
                    {discountPercentage}% OFF
                  </div>
                )}

                {image ? (
                  <div
                    className="w-full h-auto flex items-center justify-center transition-transform duration-100 ease-out"
                    style={zoomStyle}
                  >
                    <img
                      src={image}
                      alt={productData.name}
                      className="w-full h-auto sm:object-contain pointer-events-none"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image Available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="flex-1">
            <h1 className="font-medium text-3xl">{productData.name}</h1>

            {productData.brand && (
              <h2 className="text-lg text-gray-700 font-semibold mt-2">
                Brand:{" "}
                <Link to={`${productData.brand}`}>{productData.brand}</Link>
              </h2>
            )}

            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center gap-4">
                {/* Main Price */}
                <p
                  className={`text-3xl font-bold ${
                    isSoldOut ? "text-gray-400 line-through" : "text-black"
                  }`}
                >
                  {currency}
                  {hasDiscount ? numOfferPrice.toLocaleString() : numPrice.toLocaleString()}
                </p>

                {/* Old Price */}
                {hasDiscount && !isSoldOut && (
                  <div className="flex items-center gap-2">
                    <p className="text-xl text-gray-400 line-through font-medium">
                      {currency}
                      {numPrice.toLocaleString()}
                    </p>
                    <span className="bg-pink-100 text-pink-600 px-2 py-1 text-xs font-bold rounded">
                      SAVE {discountPercentage}%
                    </span>
                  </div>
                )}

                {isSoldOut && (
                  <span className="text-xl font-bold text-red-600">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* --- Buttons --- */}
            <div className="flex flex-col gap-3 mt-6 max-w-xs">
              <button
                onClick={() => addToCart(productData._id)}
                disabled={isSoldOut}
                className={`w-full border py-3 text-sm font-medium transition-colors ${
                  isSoldOut
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-black border-black active:bg-gray-200 hover:bg-gray-100"
                }`}
              >
                {isSoldOut ? "OUT OF STOCK" : "ADD TO CART"}
              </button>

              <button
                onClick={() => buyNow(productData._id)}
                disabled={isSoldOut}
                className={`w-full py-3 text-sm font-medium transition-colors ${
                  isSoldOut
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white active:bg-gray-700 hover:bg-gray-800"
                }`}
              >
                {isSoldOut ? "UNAVAILABLE" : "BUY NOW"}
              </button>

              {isSoldOut && (
                <button
                  onClick={handleWhatsAppRequest}
                  className="w-full bg-green-600 text-white border border-green-600 py-3 text-sm font-medium active:bg-green-700 hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-2 rounded-sm shadow-sm"
                >
                  <FaWhatsapp size={24} />
                  Request Restock via WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-20">
          <div className="flex">
            <b className="border px-5 py-3 text-sm bg-gray-50">Description</b>
          </div>

          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div
                className="mt-4 text-gray-600 md:w-4/5"
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />
            </div>
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