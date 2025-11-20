import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // useParams এখানে যুক্ত করা হয়েছে
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { TbFaceIdError } from "react-icons/tb";

const Collection = () => {
  // 1. URL থেকে প্যারামিটার গুলো ধরছি
  const { categorySlug, subCategorySlug } = useParams();

  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  // 2. URL প্যারামিটার অনুযায়ী অটোমেটিক ক্যাটাগরি/সাব-ক্যাটাগরি সেট করার লজিক
  useEffect(() => {
    if (categorySlug) {
      // URL এর "watch" কে "Watch" এ কনভার্ট করে স্টেটে সেট করা হচ্ছে
      const formattedCategory =
        categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
      setCategory([formattedCategory]);
    } else {
      // যদি URL এ কিছু না থাকে, ক্যাটাগরি রিসেট হবে (অপশনাল)
      setCategory([]);
    }

    if (subCategorySlug) {
      // URL এর "man" কে "Man" এ কনভার্ট করে স্টেটে সেট করা হচ্ছে
      const formattedSubCategory =
        subCategorySlug.charAt(0).toUpperCase() + subCategorySlug.slice(1);
      setSubCategory([formattedSubCategory]);
    } else {
      setSubCategory([]);
    }
  }, [categorySlug, subCategorySlug]);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  // 3. মেইন ফিল্টারিং লজিক (আপনার আগের কোডই আছে)
  useEffect(() => {
    let processedProducts = [...products];

    if (showSearch && search) {
      processedProducts = processedProducts.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      processedProducts = processedProducts.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      processedProducts = processedProducts.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    switch (sortType) {
      case "low-high":
        processedProducts.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        processedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilterProducts(processedProducts);
  }, [category, subCategory, search, showSearch, products, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Watch"}
                onChange={toggleCategory}
                checked={category.includes("Watch")} // এই লাইনটি নতুন: চেক মার্ক দেখানোর জন্য
              />{" "}
              Watch
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Cap"}
                onChange={toggleCategory}
                checked={category.includes("Cap")}
              />{" "}
              Cap
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Perfume"}
                onChange={toggleCategory}
                checked={category.includes("Perfume")}
              />{" "}
              Perfume
            </p>
          </div>
        </div>

        {/* Sub-Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Man"}
                onChange={toggleSubCategory}
                checked={subCategory.includes("Man")} // এই লাইনটি নতুন
              />{" "}
              Man
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Women"}
                onChange={toggleSubCategory}
                checked={subCategory.includes("Women")}
              />{" "}
              Women
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Kids"}
                onChange={toggleSubCategory}
                checked={subCategory.includes("Kids")}
              />{" "}
              Kids
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort By: Relavent</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
                categoryName={item.category}
                subCategory={item.subCategory}
                // productSlug পাস করা হচ্ছে যাতে ProductItem লিংকে ব্যবহার করতে পারে
                productSlug={item.name.toLowerCase().split(" ").join("-")}
              />
            ))}
          </div>
        ) : (
          <div className="text-center min-h-screen my-auto">
            <h1 className="text-black font-bold text-3xl">Not Found</h1>
            <h3 className="text-gray-500 font-semibold text-xl mt-4">
              If you need this product you can{" "}
              <Link
                to={"/contact"}
                className="border-b-2 hover:text-black hover:border-black"
              >
                contact us
              </Link>
              . We can try to help you.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
