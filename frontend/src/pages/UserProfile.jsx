// src/pages/UserProfile.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

export default function UserProfile() {
  const {
    token,
    name,
    setName,
    email,
    setEmail,
    avatar,
    setAvatar,
    setToken,
    getCartCount,
    getUserCart,
    cartItems,
    totalCount,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  // Hooks at top
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [saving, setSaving] = useState(false);

  const [orders] = useState([
    {
      id: "DLZ7829",
      date: "May 12, 2023",
      total: "৳ 5,499",
      status: "Delivered",
      items: 3,
    },
    {
      id: "DLZ6543",
      date: "April 28, 2023",
      total: "৳ 2,850",
      status: "Delivered",
      items: 2,
    },
    {
      id: "DLZ5210",
      date: "April 15, 2023",
      total: "৳ 8,200",
      status: "Cancelled",
      items: 1,
    },
    {
      id: "DLZ4876",
      date: "March 30, 2023",
      total: "৳ 1,750",
      status: "Delivered",
      items: 4,
    },
  ]);

  const [addresses] = useState([
    {
      id: 1,
      name: "Home",
      street: "123/1 Dhanmondi",
      city: "Dhaka",
      area: "Dhanmondi",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      street: "456 Gulshan Avenue",
      city: "Dhaka",
      area: "Gulshan",
      isDefault: false,
    },
  ]);

  // Fetch user profile
  useEffect(() => {
    // Get token from state or localStorage
    const savedToken = token || localStorage.getItem("token");

    if (!savedToken) {
      console.log("No token, redirecting to login");
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/user/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedToken}`,
          },
        });
        const data = await res.json();

        if (!data.success || !data.user) {
          console.log("Token invalid or user not found", data);
          navigate("/login");
        } else {
          setUser(data.user);
          setEditedUser({ ...data.user });
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setAvatar(
            data.user.avatar ||
              "data:image/png;base64,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"
          );
          getUserCart(savedToken);
          setToken(savedToken); // update state with token
        }
      } catch (err) {
        console.error("Fetch error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token, getUserCart, setName, setEmail, setAvatar, setToken]);

  // Save updated profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://localhost:4000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...editedUser });
        setName(editedUser.name || "");
        setEmail(editedUser.email || "");
        setAvatar(editedUser.avatar || "");
        toast.success("Profile updated!");
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-lg">Loading your profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg">No user data found.</div>
      </div>
    );
  }

  // Calculate total cart items
  const totalCartItems = Object.values(cartItems).reduce(
    (acc, item) => acc + Object.values(item).reduce((sum, qty) => sum + qty, 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-[#faf0e6] p-6 text-black rounded-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <img
              src={avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full shadow-lg"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-black mt-1">
              Member since {user.joinDate || "N/A"}
            </p>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="bg-white px-3 py-1 rounded-full text-sm flex items-center">
                Membership: {user.membership || "Standard"}
              </span>
              <span className="bg-[#d9b99b] px-3 py-1 rounded-full text-sm">
                {user.points || 0} points
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                Cart Items: {getCartCount() || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Details */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Account Details
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-orange-800 hover:text-orange-600 font-medium text-sm"
                >
                  Edit
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-orange-600 hover:text-orange-800 font-medium text-sm"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-800">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-800">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.phone || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-800">{user.phone || "N/A"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Orders */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Order History</h2>
              <a
                href="#"
                className="text-orange-600 hover:text-orange-800 font-medium text-sm"
              >
                View All
              </a>
            </div>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{order.id}</span>
                        <span className="text-gray-500 text-sm">
                          {order.date}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {order.items} items
                        </span>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">
                        {order.total}
                      </div>
                      <button className="mt-2 text-orange-600 hover:text-orange-800 text-sm">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Saved Addresses
              </h2>
              <button className="text-orange-600 hover:text-orange-800 font-medium text-sm flex items-center">
                + Add New
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">
                      {address.name}
                    </h3>
                    {address.isDefault && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1 text-sm">
                    {address.street}, {address.area}, {address.city}
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <button className="text-sm text-orange-600 hover:text-orange-800">
                      Edit
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
