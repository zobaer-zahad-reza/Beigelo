import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import BottomNavbar from "./BottomNavbar";
import useClickOutside from "../Hook/useClickOutside";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, token, setToken, setCartItems } =
    useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function for mobile navigation
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

  // Active styles for desktop NavLink
  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? "#000000" : "#4B5563",
    fontWeight: isActive ? "600" : "500",
    // borderBottom: isActive ? '2px solid black' : 'none',
    borderBottom: isActive ? "2px solid black" : "2px solid transparent",
  });

  return (
    <div className="flex items-center justify-between py-4 font-medium bg-white md:sticky md:top-0 md:z-10 md:bg-opacity-70 md:backdrop-blur-sm">
      <Link to="/">
        <h1 className="text-5xl playfair-display-navlogo">Bagelo</h1>
      </Link>

      {/* Menu Links - Desktop */}
      <ul className="hidden sm:flex items-center gap-5 text-sm text-gray-700 ">
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
      <div className="flex items-center gap-6">
        {location.pathname === "/collection" ? (
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5 cursor-pointer hidden md:flex"
            alt="Search"
          />
        ) : null}

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
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

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
      </div>

      {/* Sidebar for Mobile */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full z-30 overflow-hidden bg-white shadow-xl transition-all duration-300 ${
          visible ? "w-3/4" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer"
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
            className="py-3 pl-6 border-t cursor-pointer hover:bg-gray-100"
          >
            HOME
          </div>
          <div
            onClick={() => handleSideNavbar("/collection")}
            className="py-3 pl-6 border-t cursor-pointer hover:bg-gray-100"
          >
            COLLECTION
          </div>
          <div
            onClick={() => handleSideNavbar("/about")}
            className="py-3 pl-6 border-t cursor-pointer hover:bg-gray-100"
          >
            ABOUT
          </div>
          <div
            onClick={() => handleSideNavbar("/contact")}
            className="py-3 pl-6 border-t border-b cursor-pointer hover:bg-gray-100"
          >
            CONTACT
          </div>
          {token && (
            <div className="flex flex-col text-gray-600">
              <div
                onClick={() => navigate("/userprofile")}
                className="py-3 pl-6 border-t border-b cursor-pointer hover:bg-gray-100"
              >
                My Profile
              </div>
              <div
                onClick={() => (token ? navigate("/orders") : null)}
                className="py-3 pl-6 border-t border-b cursor-pointer hover:bg-gray-100"
              >
                Orders
              </div>
              <div
                onClick={logout}
                className="py-3 pl-6 border-t border-b cursor-pointer hover:bg-gray-100"
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* This renders the BottomNavbar on smaller screens */}
      <div className="block md:hidden">
        <BottomNavbar />
      </div>
      <img
        onClick={() => setVisible(true)}
        src={assets.menu_icon}
        className="w-6 cursor-pointer sm:hidden"
        alt="Menu"
      />
    </div>
  );
};

export default Navbar;
