import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { MdOutlineAnalytics, MdPersonSearch } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";

const Sidebar = () => {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div className="w-[18%] min-h-screen border-r-2 bg-white">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">

      {/*Dashboard*/}
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-3 rounded-l"
          to="/dashboard"
        >
          <MdOutlineAnalytics size={28} />
          <p className="hidden md:block">Dashboard</p>
        </NavLink>


         {/*Fraud Check*/}
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-3 rounded-l"
          to="/fraudCheck"
        >
          <MdPersonSearch  size={28} />
          <p className="hidden md:block">Fraud Check</p>
        </NavLink>


        <div
          onClick={() => setShowAddMenu(!showAddMenu)}
          className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-3 rounded-l cursor-pointer hover:bg-gray-50 transition-colors ${
            showAddMenu ? "bg-gray-100 border-gray-400" : ""
          }`}
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="" />
          <div className="hidden md:flex justify-between items-center w-full">
            <p>Add Items</p>
            <span className="text-[10px] text-gray-500 ml-2">
              {showAddMenu ? "▲" : "▼"}
            </span>
          </div>
        </div>

        {showAddMenu && (
          <div className="flex flex-col gap-2 ml-2 md:ml-4 border-l-2 border-gray-100 pl-2 animate-fadeIn">
            {/* Add Product */}
            <NavLink
              to="/add"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded ${
                  isActive ? "bg-gray-100 text-black font-medium" : ""
                }`
              }
            >
              <p className="hidden md:block">Add Product</p>
            </NavLink>

            {/* Add Category */}
            <NavLink
              to="/add-category"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded ${
                  isActive ? "bg-gray-100 text-black font-medium" : ""
                }`
              }
            >
              <p className="hidden md:block">Add Category</p>
            </NavLink>

            {/* Add Brand */}
            <NavLink
              to="/add-brand"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded ${
                  isActive ? "bg-gray-100 text-black font-medium" : ""
                }`
              }
            >
              <p className="hidden md:block">Add Brand</p>
            </NavLink>
          </div>
        )}

        {/*LIST ITEMS*/}
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-3 rounded-l"
          to="/list"
        >
          <FaClipboardList size={26} />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        {/* ORDERS */}
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-3 rounded-l"
          to="/orders"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Orders</p>
        </NavLink>

        {/* visitor */}
        <NavLink
        className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-3 rounded-l"
         to="/visitor-tracking">Visitor Tracking</NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
