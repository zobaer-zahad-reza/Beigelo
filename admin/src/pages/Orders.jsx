import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token, backendUrl, currency }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch orders.");
      console.error(error);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated!");
      }
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="px-4 sm:px-8 py-8 min-h-screen bg-gray-50">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Order Management
      </h3>

      <div className="flex flex-col gap-6">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm"
            >
              {/* --- Column 1: Items with Images --- */}
              <div className="flex flex-col gap-3">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <img
                    src={assets.parcel_icon}
                    alt=""
                    className="w-5 h-5 opacity-60"
                  />
                  Items Ordered
                </h4>

                <div className="flex flex-col gap-4">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                    >
                      {/* PRODUCT IMAGE ADDED HERE */}
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md border border-gray-200"
                      />

                      <div className="flex flex-col">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
                          <span>Qty: {item.quantity}</span>

                          {item.size === "default"
                            ? null
                            : (
                                <div>
                                  <span>|</span>
                                  <div className="text-sm text-gray-500 border border-gray-300 px-2 py-1 rounded-md">
                                    Size: {item.size.toUpperCase()}
                                  </div>
                                </div>
                              ) || null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- Column 2: Customer Details --- */}
              <div className="border-l border-gray-200 pl-0 md:pl-8 border-t md:border-t-0 pt-4 md:pt-0">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Delivery Address
                </h4>
                <p className="font-medium text-gray-800">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="text-gray-500 mt-1 leading-relaxed">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
                <p className="text-gray-600 mt-2 font-medium flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    Phone:
                  </span>
                  {order.address.phone}
                </p>
              </div>

              {/* --- Column 3: Order Info & Actions --- */}
              <div className="border-l border-gray-200 pl-0 md:pl-8 border-t md:border-t-0 pt-4 md:pt-0 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Order Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-y-2 text-gray-600">
                    <p>Total Items:</p>
                    <p className="font-medium text-gray-800">
                      {order.items.length}
                    </p>

                    <p>Order Date:</p>
                    <p className="font-medium text-gray-800">
                      {new Date(order.date).toLocaleDateString()}
                    </p>

                    <p>Method:</p>
                    <p className="font-medium text-gray-800">
                      {order.paymentMethod}
                    </p>

                    <p>Total Amount:</p>
                    <p className="font-bold text-gray-900 text-lg">
                      {currency} {order.amount}
                    </p>

                    <p>Payment:</p>
                    <div>
                      {order.payment ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Order Status
                  </label>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors hover:border-gray-400"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Order Canceled">Order Canceled</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
