import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const UserProfile = () => {
  const { name, setName, email, setEmail, avatar, setAvatar } =
    useContext(ShopContext);

  // Mock user data
  const [user, setUser] = useState({
    // name: "Rahim Ahmed",
    // email: "rahim.ahmed@email.com",
    // phone: "+880 1712-345678",
    // joinDate: "Jan 15, 2022",
    // membership: "Gold Member",
    // points: 1250,
    name,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",

    email,
  });

  // Mock order history
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

  // Mock addresses
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

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleSave = () => {
    setUser({ ...editedUser });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen ">
      {/* Profile Header */}
      <div className="bg-[#faf0e6] p-6 text-black rounded-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full  shadow-lg -z-10"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-black mt-1">Member since {user.joinDate}</p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-white px-3 py-1 rounded-full text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {user.membership}
                </span>
                <span className="bg-[#d9b99b] px-3 py-1 rounded-full text-sm">
                  {user.points} points
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Account Info */}
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
                    className="text-orange-800 hover:text-orange-800 font-medium text-sm"
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
                    >
                      Save
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      value={editedUser.phone}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{user.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Wallet & Coupons */}
            {/* <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4">My Wallet</h2>
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="text-xl font-bold text-orange-600">৳ 1,250</span>
                </div>
              </div>
              <button className="w-full py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-300 text-sm font-medium">
                Add Money
              </button>
            </div> */}

            {/* Password Reset */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Security</h2>
              <button className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300 flex items-center justify-center text-sm">
                <svg
                  className="w-4 h-4 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Change Password
              </button>
            </div>
          </div>

          {/* Right Column - Orders & Addresses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order History */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Order History
                </h2>
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
                        <div className="flex items-center">
                          <span className="font-medium">{order.id}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-gray-500 text-sm">
                            {order.date}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-gray-500 text-sm">
                            {order.items} items
                          </span>
                        </div>
                        <div className="mt-2 flex items-center">
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
                <button className="text-orange-600 hover:text-orange-800 font-medium flex items-center text-sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New
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
                      {address.street}
                      <br />
                      {address.area}, {address.city}
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

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Payment Methods
                </h2>
                <button className="text-orange-600 hover:text-orange-800 font-medium flex items-center text-sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">bKash</h3>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      Default
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 text-sm">+880 1712-345678</p>
                  <div className="mt-3 flex space-x-2">
                    <button className="text-sm text-orange-600 hover:text-orange-800">
                      Edit
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Remove
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">Visa Card</h3>
                  </div>
                  <p className="text-gray-600 mt-1 text-sm">
                    **** **** **** 4242
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
