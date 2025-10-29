import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Player } from "@lordicon/react";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    addToCart,
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
    if (quantity <= 0) {
      updateQuantity(itemId, size, 0);
    } else {
      updateQuantity(itemId, size, quantity);
    }
  };

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3 text-center">
        <Title text1="YOUR" text2="CART" />
      </div>
      <div>
        {cartData.length === 0 && (
          <div className="flex justify-center text-center py-10 flex-col">
            <p className="py-10">Your cart is empty.</p>
            <div className="">
              <lord-icon
                src="https://cdn.lordicon.com/uisoczqi.json"
                trigger="hover"
                stroke="bold"
                style={{ width: "250px", height: "250px" }}
              ></lord-icon>
            </div>
          </div>
        )}
        {cartData.map((item, index) => {
          const productData = products.find((p) => p._id === item._id);
          if (!productData) return null;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <Link to={`/product/${item._id}`}>
                  <img
                    className="w-16 sm:w-20"
                    src={productData.image[0]}
                    alt={productData.name}
                  />
                </Link>
                <div>
                  <p className="text-xl sm:text-lg font-bold">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              <input
                type="number"
                min={0}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item._id, item.size, e.target.value)
                }
              />

              <img
                src={assets.bin_icon}
                alt="Remove"
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                onClick={() => handleQuantityChange(item._id, item.size, 0)}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              className="bg-black text-white text-sm my-8 px-8 py-3"
              onClick={() => {
                if (cartData.length === 0) {
                  toast.error("Your cart is empty. Please add some products.");
                  return;
                }
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
    </div>
  );
};

export default Cart;
