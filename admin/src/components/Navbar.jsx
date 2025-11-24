import React from "react";
import { Link } from "react-router-dom";
// import { assets } from "../assets/assets";
import NavLogo from "../assets/NavLogo.png";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <div className="w-[max(10%,80px)]">
        <Link to="/">
          <img className="w-40" src={NavLogo} alt="Logo" />
        </Link>
      </div>
      <button
        onClick={() => setToken("")}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
