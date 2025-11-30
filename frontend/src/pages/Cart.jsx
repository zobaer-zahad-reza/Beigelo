import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    user,
    setBuyNowItem,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const handleQuantityChange = (itemId, size, value) => {
    const quantity = Number(value);
    if (quantity < 0) return; // Prevent negative numbers
    updateQuantity(itemId, size, quantity);
  };

  const decrementQty = (id, size, currentQty) => {
    // If quantity is 1, asking to decrement will remove it (or you can stop at 1)
    if (currentQty > 0) {
      handleQuantityChange(id, size, currentQty - 1);
    }
  };

  const incrementQty = (id, size, currentQty) => {
    handleQuantityChange(id, size, currentQty + 1);
  };

  return (
    <div className="border-t pt-14 min-h-[80vh]">
      <div className="text-2xl mb-8 text-center">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {cartData.length === 0 ? (
          <div className="flex justify-center text-center py-20 flex-col items-center opacity-60">
            <img
              src={assets.cart_icon}
              alt="Empty"
              className="w-16 h-16 mb-4 opacity-30"
            />
            <p className="text-xl text-gray-500">
              Your cart is currently empty.
            </p>
            <Link
              to="/collection"
              className="mt-4 text-sm text-black border-b border-black hover:text-gray-600"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {cartData.map((item, index) => {
              const productData = products.find((p) => p._id === item._id);
              if (!productData) return null;

              // Price Logic
              const hasOffer =
                productData.offerPrice &&
                productData.offerPrice > 0 &&
                productData.offerPrice < productData.price;

              const finalPrice = hasOffer
                ? productData.offerPrice
                : productData.price;

              return (
                <div
                  key={index}
                  className="group relative flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item._id}`} className="shrink-0">
                    <img
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-md"
                      src={productData.image[0]}
                      alt={productData.name}
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <Link to={`/product/${item._id}`}>
                        <p className="text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors">
                          {productData.name}
                        </p>
                      </Link>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">
                            {currency}
                            {finalPrice}
                          </p>
                          {hasOffer && (
                            <p className="text-gray-400 line-through text-xs">
                              {currency}
                              {productData.price}
                            </p>
                          )}
                        </div>
                        {item.size === "default"
                          ? null
                          : (
                              <div className="text-sm text-gray-500 border border-gray-300 px-2 py-1 rounded-md">
                                Size: {item.size.toUpperCase()}
                              </div>
                            ) || null}
                      </div>
                    </div>

                    {/* Quantity Controls & Delete */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                      {/* Custom Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            decrementQty(item._id, item.size, item.quantity)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded-l-md disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <input
                          className="w-10 text-center text-sm font-medium bg-transparent outline-none pointer-events-none"
                          type="number"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          onClick={() =>
                            incrementQty(item._id, item.size, item.quantity)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded-r-md"
                        >
                          +
                        </button>
                      </div>

                      {/* Delete Icon */}
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.size, 0)
                        }
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Remove item"
                      >
                        <img
                          src={assets.bin_icon}
                          alt="Remove"
                          className="w-5 h-5 opacity-70 hover:opacity-100"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Checkout Section */}
        {cartData.length > 0 && (
          <div className="flex justify-end mt-12 mb-20">
            <div className="w-full sm:w-[400px] bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <CartTotal />
              <div className="w-full mt-6">
                <button
                  className="w-full bg-black text-white text-sm font-medium py-3 px-8 rounded hover:bg-gray-800 transition-all active:scale-95"
                  onClick={() => {
                    if (!user) {
                      toast.error("Please log in to proceed to checkout.");
                      navigate("/login");
                      return;
                    }
                    setBuyNowItem(null);
                    navigate("/place-order");
                  }}
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
