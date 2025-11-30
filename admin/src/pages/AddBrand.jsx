import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const AddBrand = ({ token, backendUrl }) => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      const response = await axios.post(
        `${backendUrl}/api/brand/add`, // আপনার ব্যাকএন্ডে এই রাউটটি থাকতে হবে
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setImage(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Add New Brand</h2>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
        {/* --- Brand Logo Upload --- */}
        <div className="flex flex-col gap-2">
          <p className="font-medium text-gray-700">Upload Brand Logo</p>
          <label htmlFor="image" className="cursor-pointer w-32">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
              {!image ? (
                <div className="text-center p-4">
                  <img
                    src={assets.upload_area}
                    alt="upload"
                    className="w-8 h-8 mx-auto mb-2 opacity-50"
                  />
                  <span className="text-xs text-gray-500">Click to upload</span>
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full h-full object-contain p-2"
                />
              )}
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
              required
            />
          </label>
        </div>

        {/* --- Brand Name Input --- */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Brand Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-black transition-colors"
            type="text"
            placeholder="e.g. Rolex, Omega, Fossil"
            required
          />
        </div>

        {/* --- Submit Button --- */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 text-white font-medium rounded shadow-md transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Adding Brand..." : "ADD BRAND"}
        </button>
      </form>
    </div>
  );
};

export default AddBrand;
