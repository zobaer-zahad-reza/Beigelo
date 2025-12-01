import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

const BrandList = ({ token, backendUrl }) => {
  const [list, setList] = useState([]);

  //Fetch All Brands
  const fetchBrandList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/brand/list`);
      if (response.data.success) {
        setList(response.data.brands.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Remove Brand
  const removeBrand = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/brand/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchBrandList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (backendUrl) {
      fetchBrandList();
    }
  }, [backendUrl]);

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-xl font-bold text-gray-700">All Brands List</h3>

      <div className="flex flex-col gap-2">
        {/* Table Head*/}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr] items-center py-3 px-4 border bg-gray-100 text-sm font-bold text-gray-600 rounded-t">
          <span>Logo</span>
          <span>Brand Name</span>
          <span className="text-center">Action</span>
        </div>

        {/* brand Items Loop*/}
        {list.length === 0 ? (
          <p className="text-center text-gray-500 py-4 border rounded">
            No brands found.
          </p>
        ) : (
          list.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_3fr_1fr] items-center gap-2 py-3 px-4 border text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {/* Logo */}
              <img
                className="w-12 h-12 object-contain border rounded p-1"
                src={item.image}
                alt=""
              />

              {/* Name */}
              <p className="font-medium">{item.name}</p>

              {/* Delete Action */}
              <div className="flex justify-center">
                <p
                  onClick={() => removeBrand(item._id)}
                  className="cursor-pointer text-red-500 hover:text-red-700 text-lg"
                >
                  <FaTrashAlt />
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrandList;
