import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegEdit, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import DescriptionEditor from "../components/DescriptionEditor";
import { MdDelete } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi"; // Alert Icon added

const List = ({ token, backendUrl, currency }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Modal States ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New State for Delete Modal
  const [productToDelete, setProductToDelete] = useState(null); // ID to delete

  // Discount calculation state
  const [discount, setDiscount] = useState(0);
  const [showSize, setShowSize] = useState(false);

  const [editingProduct, setEditingProduct] = useState({
    id: "",
    name: "",
    brand: "",
    description: "",
    category: "Watch",
    subCategory: "Man",
    watchGrade: "Original",
    price: "",
    offerPrice: "",
    quantity: "",
    sizes: [],
    bestseller: false,
    image: [],
    newImages: {},
  });

  useEffect(() => {
    const regularPrice = parseFloat(editingProduct.price);
    const discountedPrice = parseFloat(editingProduct.offerPrice);

    if (
      regularPrice > 0 &&
      discountedPrice > 0 &&
      regularPrice > discountedPrice
    ) {
      const discountValue =
        ((regularPrice - discountedPrice) / regularPrice) * 100;
      setDiscount(Math.round(discountValue));
    } else {
      setDiscount(0);
    }
  }, [editingProduct.price, editingProduct.offerPrice]);

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

  // --- Handle Delete Click (Opens Modal) ---
  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  // --- Confirm Delete (Actual Logic) ---
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id: productToDelete },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setShowDeleteModal(false); // Close Modal
        setProductToDelete(null); // Reset ID
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove product."
      );
    }
  };

  const updateQuantity = async (productId, currentQuantity, action) => {
    let newQuantity =
      action === "increment" ? currentQuantity + 1 : currentQuantity - 1;

    if (newQuantity < 0) {
      newQuantity = 0;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/update-quantity`,
        { id: productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Quantity updated");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity.");
    }
  };

  const handleEditClick = (item) => {
    setEditingProduct({
      id: item._id,
      name: item.name,
      brand: item.brand || "",
      description: item.description,
      category: item.category,
      subCategory: item.subCategory,
      watchGrade: item.watchGrade || "Original",
      price: item.price,
      offerPrice: item.offerPrice || "",
      quantity: item.quantity,
      sizes: item.sizes || [],
      bestseller: item.bestseller,
      image: item.image || [],
      newImages: {},
    });
    setShowSize(item.sizes && item.sizes.length > 0);
    setShowEditModal(true);
  };

  // Handle Text/Select/Checkbox Changes
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Description Editor
  const handleDescriptionChange = (value) => {
    setEditingProduct((prev) => ({
      ...prev,
      description: value,
    }));
  };

  // Handle Size Selection
  const handleSizeChange = (size) => {
    setEditingProduct((prev) => {
      const currentSizes = prev.sizes;
      if (currentSizes.includes(size)) {
        return { ...prev, sizes: currentSizes.filter((s) => s !== size) };
      } else {
        return { ...prev, sizes: [...currentSizes, size] };
      }
    });
  };

  // Handle Image Uploads
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setEditingProduct((prev) => ({
        ...prev,
        newImages: {
          ...prev.newImages,
          [index]: file,
        },
      }));
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", editingProduct.id);
      formData.append("name", editingProduct.name);
      formData.append("brand", editingProduct.brand);
      formData.append("description", editingProduct.description);
      formData.append("category", editingProduct.category);
      formData.append("subCategory", editingProduct.subCategory);
      formData.append("price", editingProduct.price);
      formData.append("offerPrice", editingProduct.offerPrice);
      formData.append("quantity", editingProduct.quantity);
      formData.append("bestseller", editingProduct.bestseller);
      formData.append("sizes", JSON.stringify(editingProduct.sizes));

      if (editingProduct.category === "Watch") {
        formData.append("watchGrade", editingProduct.watchGrade);
      }
      const imageIndexes = Object.keys(editingProduct.newImages);
      formData.append("imageIndexes", JSON.stringify(imageIndexes));
      imageIndexes.forEach((index) => {
        formData.append("image", editingProduct.newImages[index]);
      });

      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        setShowEditModal(false);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

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

      {/* Search Bar */}
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
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-3 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Quantity</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}
        {filteredList.map((item, index) => (
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

            <div className="flex items-center justify-center gap-2 text-black text-lg">
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

            {/* Edit and Delete */}
            <div className="flex items-center justify-center gap-4">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEditClick(item)}
                title="Edit"
              >
                <FaRegEdit size={24} />
              </button>
              
              {/* ---------- CHANGE HERE: Changed onClick to handleDeleteClick ---------- */}
              <p
                onClick={() => handleDeleteClick(item._id)}
                className="cursor-pointer text-lg text-red-600 hover:text-red-800 font-bold"
                title="Delete"
              >
                <MdDelete size={24} />
              </p>
              {/* ----------------------------------------------------------------------- */}

            </div>
          </div>
        ))}
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 md:w-96 text-center transform transition-all scale-100">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FiAlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              Delete Product?
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
            </div>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL (No Changes) --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-scroll scrollbar-hide">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Edit Product
            </h2>

            <form
              onSubmit={submitEdit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* ... (Rest of your form code remains exactly same) ... */}
              <div className="col-span-2">
                <p className="text-sm font-bold mb-2">
                  Product Images (Click to Change / Add)
                </p>
                <div className="flex gap-2 flex-wrap items-center">
                  {editingProduct.image.map((img, index) => (
                    <label
                      key={index}
                      htmlFor={`image-upload-${index}`}
                      className="cursor-pointer relative group"
                    >
                      <img
                        src={
                          editingProduct.newImages[index]
                            ? URL.createObjectURL(
                                editingProduct.newImages[index]
                              )
                            : img
                        }
                        alt={`Product ${index + 1}`}
                        className="w-20 h-20 object-cover border rounded hover:opacity-75 transition-opacity"
                      />
                      <input
                        type="file"
                        id={`image-upload-${index}`}
                        hidden
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 rounded transition-opacity">
                        <FaRegEdit className="text-white text-lg" />
                      </div>
                    </label>
                  ))}

                  {editingProduct.image.length < 6 && (
                    <label
                      htmlFor={`image-upload-new`}
                      className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      title="Add New Image"
                    >
                      {editingProduct.newImages[editingProduct.image.length] ? (
                        <img
                          src={URL.createObjectURL(
                            editingProduct.newImages[
                              editingProduct.image.length
                            ]
                          )}
                          className="w-full h-full object-cover rounded"
                          alt="New"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <FaPlus size={20} />
                          <span className="text-xs mt-1">Add</span>
                        </div>
                      )}

                      <input
                        type="file"
                        id={`image-upload-new`}
                        hidden
                        onChange={(e) =>
                          handleImageUpload(e, editingProduct.image.length)
                        }
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-bold mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-bold mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brand"
                  value={editingProduct.brand}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="e.g. Rolex, Casio"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold mb-1">
                  Description
                </label>
                <DescriptionEditor
                  value={editingProduct.description}
                  onChange={handleDescriptionChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Category</label>
                <select
                  name="category"
                  value={editingProduct.category}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="Watch">Watch</option>
                  <option value="Cap">Cap</option>
                  <option value="Perfume">Perfume</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Sub Category
                </label>
                <select
                  name="subCategory"
                  value={editingProduct.subCategory}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="Man">Man</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              {editingProduct.category === "Watch" && (
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">
                    Watch Grade
                  </label>
                  <select
                    name="watchGrade"
                    value={editingProduct.watchGrade}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="Original">Original</option>
                    <option value="Master Grade">Master Grade</option>
                    <option value="Euro Grade">Euro Grade</option>
                    <option value="1:1 Grade">1:1 Grade</option>
                    <option value="AAA Grade">AAA Grade</option>
                    <option value="AAA+ Grade">AAA+ Grade</option>
                    <option value="AA Grade">AA Grade</option>
                    <option value="A Grade">A Grade</option>
                    <option value="Swiss Grade">Swiss Grade</option>
                  </select>
                </div>
              )}

              <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Regular Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold mb-1">
                    Offer Price
                  </label>
                  <input
                    type="number"
                    name="offerPrice"
                    value={editingProduct.offerPrice}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded"
                  />
                  {discount > 0 && (
                    <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={editingProduct.quantity}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              </div>

              <div className="col-span-2 border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="font-bold text-sm">Has Sizes?</label>
                  <input
                    type="checkbox"
                    checked={showSize}
                    onChange={() => setShowSize(!showSize)}
                    className="toggle toggle-success"
                  />
                </div>

                {showSize && (
                  <div className="flex gap-3">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <div key={size} onClick={() => handleSizeChange(size)}>
                        <p
                          className={`${
                            editingProduct.sizes.includes(size)
                              ? "bg-pink-100 border-pink-300 border"
                              : "bg-slate-200"
                          } px-3 py-1 cursor-pointer rounded text-sm`}
                        >
                          {size}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-2 flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="bestseller"
                  checked={editingProduct.bestseller}
                  onChange={handleEditChange}
                  id="bestseller"
                  className="w-4 h-4"
                />
                <label
                  htmlFor="bestseller"
                  className="text-sm font-bold cursor-pointer"
                >
                  Add to Bestseller
                </label>
              </div>

              <div className="col-span-2 flex justify-end gap-2 mt-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 font-medium flex items-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default List;