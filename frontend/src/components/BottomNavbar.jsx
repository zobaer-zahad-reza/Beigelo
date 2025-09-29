import { useContext, useState } from "react";
import {
  FaHome,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaCircle,
} from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

export default function BottomNavbar() {
  const [activeTab, setActiveTab] = useState("home");

  const { token } = useContext(ShopContext);

  const navItems = [
    { id: "", icon: <FaHome />, label: "Home" },
    { id: "dontknow", icon: <FaSearch />, label: "Search" },
    { id: "collection", icon: <IoStorefrontSharp size={30} />, label: "Shop" },
    {
      id: `${token ? "cart" : "login"}`,
      icon: <FaShoppingCart />,
      label: "Cart",
    },
    {
      id: `${token ? "userprofile" : "login"}`,
      icon: <FaUser />,
      label: "Profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#000000] text-white shadow-lg">
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => (
          <Link key={item.label} to={`/${item.id}`}>
            <button
              key={item.label}
              className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors ${
                activeTab === item.label ? "text-[#FBECD3]" : "text-gray-400"
              }`}
              onClick={() => setActiveTab(item.label)}
            >
              <div className="text-xl">{item.icon}</div>
              {/* {item.label && <span className="text-xs mt-1">{item.label}</span>} */}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
