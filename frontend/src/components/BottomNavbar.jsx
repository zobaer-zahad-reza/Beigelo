import { useState } from "react";
import {
  FaHome,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaCircle,
} from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function BottomNavbar() {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "", icon: <FaHome />, label: "Home" },
    { id: "search", icon: <FaSearch />, label: "Search" },
    { id: "collection", icon: <IoStorefrontSharp size={30} />, label: "Shope" },
    { id: "cart", icon: <FaShoppingCart />, label: "Cart" },
    { id: "profile", icon: <FaUser />, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#faf0e6] text-white shadow-lg">
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => (
          <Link key={item.id} to={`/${item.id}`}>
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "text-[#d9b99b]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="text-xl">{item.icon}</div>
              {item.label && <span className="text-xs mt-1">{item.label}</span>}
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
