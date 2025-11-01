import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const List = ({ token, backendUrl, currency }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error("Failed to fetch product list.");
    }
  };

  const removeProduct = async (id) => {
    // ... আপনার removeProduct কোড এখানে অপরিবর্তিত আছে ...
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error(error.response?.data?.message || "Failed to remove product.");
    }
  };

  // <-- ১. কোয়ান্টিটি আপডেট করার জন্য নতুন ফাংশন -->
  const updateQuantity = async (productId, currentQuantity, action) => {
    // ইউজারের অ্যাকশন অনুযায়ী নতুন কোয়ান্টিটি হিসাব করি
    let newQuantity =
      action === "increment" ? currentQuantity + 1 : currentQuantity - 1;

    // কোয়ান্টিটি যেন ০ এর নিচে না যায়
    if (newQuantity < 0) {
      newQuantity = 0;
    }

    try {
      // এই নতুন API এন্ডপয়েন্টটি আপনাকে ব্যাকএন্ডে তৈরি করতে হবে
      const response = await axios.post(
        `${backendUrl}/api/product/update-quantity`,
        { id: productId, quantity: newQuantity }, // ডেটাবেসে পাঠানোর জন্য আইডি এবং নতুন কোয়ান্টিটি
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Quantity updated");
        await fetchList(); // সফলভাবে আপডেট হলে লিস্টটি রি-ফেচ (refresh) করি
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // ফিল্টার লজিকে Quantity যোগ করা হয়েছে
  const filteredList = list.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const quantityString = item.quantity ? item.quantity.toString() : "";

    return (
      item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.category.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.price.toString().includes(lowerCaseSearchTerm) ||
      quantityString.includes(lowerCaseSearchTerm)
    );
  });

  return (
    <>
      <p className="mb-2">ALL Products List</p>

      {/*-------Search Bar-------*/}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, category, price, or quantity..."
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        {/*-------List Table Title----*/}
        {/* <-- ২. টেবিলের হেডার ৫ কলাম থেকে ৬ কলাম করা হয়েছে --> */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-3 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Quantity</b> {/* <-- নতুন কলাম হেডার */}
          <b className="text-center">Action</b>
        </div>

        {/*-------Product List-------*/}
        {filteredList.map((item, index) => (
          // <-- ৩. টেবিলের রো ৫ কলাম থেকে ৬ কলাম করা হয়েছে -->
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12 rounded" src={item.image[0]} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>

            {/* <-- ৪. নতুন কোয়ান্টিটি কলাম (+/- বাটন সহ) --> */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item._id, item.quantity, "decrement")
                }
                className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 rounded font-bold"
              >
                -
              </button>
              <p>{item.quantity}</p>
              <button
                onClick={() =>
                  updateQuantity(item._id, item.quantity, "increment")
                }
                className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 rounded font-bold"
              >
                +
              </button>
            </div>

            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-lg text-red-600 hover:text-red-800 font-bold"
            >
              X
            </p>
          </div>
        ))}

        {filteredList.length === 0 && searchTerm.length > 0 && (
          <p className="text-center text-gray-500 py-4">
            No products found matching "{searchTerm}"
          </p>
        )}
      </div>
    </>
  );
};

export default List;
