import React, { useContext } from "react";
import { FaHome, FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

export default function BottomNavbar() {
  const { token, getCartCount, setShowSearch } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Active path checking
  const isActive = (path) => location.pathname === path;

  const handleSearchClick = () => {
    setShowSearch(true);
    navigate("/collection");
    window.scrollTo(0, 0);
  };

  const navItemClass = (active) => `
    relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-in-out
    ${
      active
        ? "bg-black text-white shadow-lg scale-110 -translate-y-1"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
    }
  `;

  return (
    <nav className="fixed bottom-4 left-4 right-4 h-16 bg-white/80 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl z-50 md:hidden flex justify-between items-center px-6">
      {/* Home */}
      <Link to="/">
        <div className={navItemClass(isActive("/"))}>
          <FaHome className="text-lg" size={24} />
        </div>
      </Link>

      {/* Search */}
      <button onClick={handleSearchClick}>
        <div
          className={navItemClass(isActive("/collection") && location.search)}
        >
          <FaSearch className="text-lg" size={24} />
        </div>
      </button>

      {/* Shop  */}
      <Link to="/collection">
        <div
          className={`${navItemClass(isActive("/collection") && !location.search)}`}
        >
          <IoStorefrontSharp className="text-xl" size={24} />
        </div>
      </Link>

      {/* Cart */}
      <Link to="/cart" className="relative">
        <div className={navItemClass(isActive("/cart"))}>
          <FaShoppingCart className="text-lg" />

          {/* Animated Badge */}
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[9px] font-bold items-center justify-center border border-white">
                {getCartCount()}
              </span>
            </span>
          )}
        </div>
      </Link>

      {/* Profile */}
      <Link to={token ? "/userprofile" : "/login"}>
        <div
          className={navItemClass(
            isActive("/userprofile") || isActive("/login"),
          )}
        >
          <FaUser className="text-lg" size={24} />
        </div>
      </Link>
    </nav>
  );
}
