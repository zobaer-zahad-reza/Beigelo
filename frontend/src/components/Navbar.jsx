import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import BottomNavbar from "./BottomNavbar";
import useClickOutside from "../Hook/useClickOutside";
import { RxCross2 } from "react-icons/rx";

import NavLogo from "../assets/NavLogo.webp";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { getCartCount, token, setToken, setCartItems, setSearch } =
    useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (setSearch) {
        setSearch(query);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query, setSearch]);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val && location.pathname !== "/collection") {
      navigate("/collection");
    }
  };

  const handleSideNavbar = (path) => {
    navigate(path);
    setVisible(false);
  };

  const logout = () => {
    navigate("/");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const sidebarRef = useClickOutside(() => {
    setVisible(false);
  });

  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? "#000000" : "#4B5563",
    fontWeight: isActive ? "600" : "500",
    borderBottom: isActive ? "2px solid black" : "2px solid transparent",
  });

  return (
    <div className="bg-white md:sticky md:top-0 md:z-50 md:bg-opacity-95 md:backdrop-blur-sm shadow-sm">
      {/* Main Navbar Row */}
      <div className="flex items-center justify-between py-4 font-medium px-4 sm:px-10">
        {/* Logo */}
        <Link to="/">
          <img className="w-32 sm:w-40" src={NavLogo} alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-5 text-sm text-gray-700">
          <NavLink
            to="/"
            style={navLinkStyles}
            className="transition-all duration-200"
          >
            HOME
          </NavLink>
          <NavLink
            to="/collection"
            style={navLinkStyles}
            className="transition-all duration-200"
          >
            COLLECTION
          </NavLink>
          <NavLink
            to="/about"
            style={navLinkStyles}
            className="transition-all duration-200"
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/contact"
            style={navLinkStyles}
            className="transition-all duration-200"
          >
            CONTACT
          </NavLink>
        </ul>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Advanced Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-black focus-within:bg-white transition-all duration-300 w-60">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
              onChange={handleSearchInput}
              value={query}
            />
            <img
              src={assets.search_icon}
              alt="search"
              className="w-4 opacity-60 cursor-pointer"
              onClick={() => navigate("/collection")}
            />
          </div>

          {/* Mobile Search Icon */}
          <img
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            src={assets.search_icon}
            className="w-5 cursor-pointer md:hidden"
            alt="Search"
          />

          {/* Profile Icon */}
          <div className="group relative hidden md:flex">
            <img
              onClick={() => (token ? null : navigate("/login"))}
              className="hidden md:block w-5 cursor-pointer"
              src={assets.profile_icon}
              alt="Profile"
            />
            {token && (
              <div className="group-hover:block hidden absolute right-0 pt-4 z-20">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                  <p
                    onClick={() => navigate("/userprofile")}
                    className="cursor-pointer hover:text-black"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer hover:text-black"
                  >
                    Orders
                  </p>
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="relative hidden md:block">
            <img
              src={assets.cart_icon}
              className="w-5 min-w-5 hidden md:flex"
              alt="Cart"
            />
            {getCartCount() > 0 && (
              <p className="absolute right-[-8px] top-[-8px] w-4 h-4 flex items-center justify-center bg-black text-white rounded-full text-[9px]">
                {getCartCount()}
              </p>
            )}
          </Link>

          {/* Mobile Menu Icon */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-6 cursor-pointer sm:hidden"
            alt="Menu"
          />
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileSearchOpen ? "max-h-16 py-2 px-4 border-b" : "max-h-0"}`}
      >
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none w-full text-sm text-gray-700"
            onChange={handleSearchInput}
            value={query}
            autoFocus={mobileSearchOpen}
          />
          {query ? (
            <RxCross2
              onClick={() => {
                setQuery("");
                setSearch("");
              }}
              className="text-gray-500 cursor-pointer text-lg"
            />
          ) : (
            <img
              src={assets.search_icon}
              className="w-4 opacity-50"
              alt="search"
            />
          )}
        </div>
      </div>

      {/* Sidebar for Mobile Menu */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full z-30 overflow-hidden bg-white shadow-xl transition-all duration-300 ${visible ? "w-3/4" : "w-0"}`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer border-b"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p>Back</p>
          </div>
          <div
            onClick={() => handleSideNavbar("/")}
            className="py-3 pl-6 border-b cursor-pointer hover:bg-gray-50"
          >
            HOME
          </div>
          <div
            onClick={() => handleSideNavbar("/collection")}
            className="py-3 pl-6 border-b cursor-pointer hover:bg-gray-50"
          >
            COLLECTION
          </div>
          <div
            onClick={() => handleSideNavbar("/about")}
            className="py-3 pl-6 border-b cursor-pointer hover:bg-gray-50"
          >
            ABOUT
          </div>
          <div
            onClick={() => handleSideNavbar("/contact")}
            className="py-3 pl-6 border-b cursor-pointer hover:bg-gray-50"
          >
            CONTACT
          </div>
          {token && (
            <div className="flex flex-col text-gray-600">
              <div
                onClick={() => navigate("/userprofile")}
                className="py-3 pl-6 border-b cursor-pointer hover:bg-gray-50"
              >
                My Profile
              </div>
              <div
                onClick={() => (token ? navigate("/orders") : null)}
                className="py-3 pl-6 border-b cursor-pointer hover:bg-gray-50"
              >
                Orders
              </div>
              <div
                onClick={logout}
                className="py-3 pl-6 border-b cursor-pointer hover:bg-gray-50"
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="block md:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Navbar;
