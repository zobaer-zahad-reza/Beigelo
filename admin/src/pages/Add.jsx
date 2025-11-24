import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import DescriptionEditor from "../components/DescriptionEditor";

const Add = ({ token, backendUrl }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [image5, setImage5] = useState(false);
  const [image6, setImage6] = useState(false);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [discount, setDiscount] = useState(0);

  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("Watch");
  const [subCategory, setSubCategory] = useState("Man");
  const [watchGrade, setWatchGrade] = useState("Original");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [showSize, setShowSize] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const regularPrice = parseFloat(price);
    const discountedPrice = parseFloat(offerPrice);

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
  }, [price, offerPrice]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("description", description);
      formData.append("price", price);

      if (offerPrice) {
        formData.append("offerPrice", offerPrice);
      }

      formData.append("quantity", quantity);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      if (category === "Watch") {
        formData.append("watchGrade", watchGrade);
      }

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      image5 && formData.append("image5", image5);
      image6 && formData.append("image6", image6);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setDescription("");
        setBrand("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setImage5(false);
        setImage6(false);
        setPrice("");
        setOfferPrice("");
        setQuantity("");
        setName("");
        setWatchGrade("Original");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-0.2">Upload Image</p>
        <div className="flex gap-2 flex-wrap">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
          <label htmlFor="image5">
            <img
              className="w-20"
              src={!image5 ? assets.upload_area : URL.createObjectURL(image5)}
              alt=""
            />
            <input
              onChange={(e) => setImage5(e.target.files[0])}
              type="file"
              id="image5"
              hidden
            />
          </label>
          <label htmlFor="image6">
            <img
              className="w-20"
              src={!image6 ? assets.upload_area : URL.createObjectURL(image6)}
              alt=""
            />
            <input
              onChange={(e) => setImage6(e.target.files[0])}
              type="file"
              id="image6"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-0.5">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[400px] px-3 py-2"
          type="text"
          placeholder="Type Here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-0.5">Brand Name</p>
        <input
          onChange={(e) => setBrand(e.target.value)}
          value={brand}
          className="w-full max-w-[400px] px-3 py-2"
          type="text"
          placeholder="e.g. Rolex, Casio, etc."
        />
      </div>

      <div className="w-full max-w-[500px]">
        <p className="mb-0.5">Product Description</p>
        <DescriptionEditor 
            value={description} 
            onChange={setDescription} 
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 flex-wrap pt-4 sm:pt-0">
        <div>
          <p className="mb-0.5">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Watch">Watch</option>
            <option value="Cap">Cap</option>
            <option value="Perfume">Perfume</option>
          </select>
        </div>

        <div>
          <p className="mb-0.5">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Man">Man</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {category === "Watch" && (
          <div>
            <p className="mb-0.5">Watch Grade</p>
            <select
              onChange={(e) => setWatchGrade(e.target.value)}
              value={watchGrade}
              className="w-full px-3 py-2"
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

        <div>
          <p className="mb-0.5">Regular Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            required
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="৳ 2500"
          />
        </div>

        <div className="relative">
          <p className="mb-0.5">Offer Price</p>
          <input
            onChange={(e) => setOfferPrice(e.target.value)}
            value={offerPrice}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="৳ 2000"
          />
          {discount > 0 && (
            <span className="absolute -top-3 -right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        <div>
          <p className="mb-0.5">Quantity</p>
          <input
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            className="w-full px-3 py-2 sm:w-[100px]"
            type="number"
            placeholder="10"
            required
          />
        </div>
      </div>

      <div className="flex space-x-4 mt-2">
        <h4>Have product Size?</h4>
        <input
          type="checkbox"
          onClick={() => setShowSize(!showSize)}
          className="toggle toggle-success"
        />
      </div>

      <div className={`${showSize ? "block" : "hidden"}`}>
        <p className="mb-0.5">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-0.5">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-3 mt-0.5 rounded-lg bg-black text-white disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isLoading ? "Uploading..." : "Upload Product"}
      </button>
    </form>
  );
};

export default Add;