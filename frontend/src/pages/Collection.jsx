import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import axios from "axios";
import { TbFaceIdError } from "react-icons/tb";
import { IoClose } from "react-icons/io5"; // Close icon for mobile drawer
import { FaFilter } from "react-icons/fa"; // Filter icon

const Collection = () => {
  const { categorySlug, subCategorySlug } = useParams();
  const location = useLocation();

  const { products, search, showSearch, backendUrl } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);

  // Filter States
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [brandCategory, setBrandCategory] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/brand/list`);
        if (response.data.success) {
          setBrands(response.data.brands);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBrands();
  }, [backendUrl]);

  useEffect(() => {
    if (categorySlug) {
      const formattedCategory =
        categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
      setCategory([formattedCategory]);
    } else {
      setCategory([]);
    }

    if (subCategorySlug) {
      const formattedSubCategory =
        subCategorySlug.charAt(0).toUpperCase() + subCategorySlug.slice(1);
      setSubCategory([formattedSubCategory]);
    } else {
      setSubCategory([]);
    }

    const searchParams = new URLSearchParams(location.search);
    const brandQuery = searchParams.get("brand");
    if (brandQuery) {
      setBrandCategory([brandQuery]);
    } else {
      setBrandCategory([]);
    }
  }, [categorySlug, subCategorySlug, location.search]);

  // Toggle Functions
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

  const toggleBrand = (e) => {
    if (brandCategory.includes(e.target.value)) {
      setBrandCategory((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    } else {
      setBrandCategory((prev) => [...prev, e.target.value]);
    }
  };

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

    if (brandCategory.length > 0) {
      processedProducts = processedProducts.filter((item) =>
        brandCategory.includes(item.brand)
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
  }, [category, subCategory, brandCategory, search, showSearch, products, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t relative">
      
      {/* --- Filter Sidebar (Mobile Overlay + Desktop Static) --- */}
      {/* Mobile Background Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 sm:hidden transition-opacity duration-300 ${showFilter ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setShowFilter(false)}
      ></div>

      {/* Filter Content Container */}
      <div className={`
          min-w-60 bg-white 
          fixed sm:static top-0 right-0 bottom-0 z-50 h-full sm:h-auto w-[80%] sm:w-auto shadow-2xl sm:shadow-none p-5 sm:p-0 overflow-y-auto sm:overflow-visible
          transition-transform duration-300 ease-in-out transform
          ${showFilter ? 'translate-x-0' : 'translate-x-full sm:translate-x-0'}
      `}>
        {/* Mobile Header (Close Button) */}
        <div className="flex justify-between items-center mb-6 sm:hidden">
            <span className="text-xl font-medium">Filters</span>
            <IoClose onClick={() => setShowFilter(false)} className="text-2xl cursor-pointer" />
        </div>

        <p className="hidden sm:block my-2 text-xl flex items-center gap-2 font-medium">
          FILTERS
        </p>

        {/* Category Filter */}
        <div className="border border-gray-300 pl-5 py-3 mt-6">
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {['Watch', 'Cap', 'Perfume'].map((cat) => (
               <label key={cat} className="flex gap-2 items-center cursor-pointer hover:text-black transition-colors">
                <input
                  className="w-3 h-3 accent-black"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Sub-Category Filter */}
        <div className="border border-gray-300 pl-5 py-3 my-5">
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {['Man', 'Women', 'Kids'].map((sub) => (
              <label key={sub} className="flex gap-2 items-center cursor-pointer hover:text-black transition-colors">
                <input
                  className="w-3 h-3 accent-black"
                  type="checkbox"
                  value={sub}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(sub)}
                />
                {sub}
              </label>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="border border-gray-300 pl-5 py-3 my-5">
          <p className="mb-3 text-sm font-medium">BRANDS</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700 max-h-60 overflow-y-auto custom-scrollbar">
            {brands.length > 0 ? (
              brands.map((brand, index) => (
                <label key={index} className="flex gap-2 items-center cursor-pointer hover:text-black transition-colors">
                  <input
                    className="w-3 h-3 accent-black"
                    type="checkbox"
                    value={brand.name}
                    onChange={toggleBrand}
                    checked={brandCategory.includes(brand.name)}
                  />
                  {brand.name}
                </label>
              ))
            ) : (
              <p className="text-xs text-gray-400">Loading brands...</p>
            )}
          </div>
        </div>
        
        {/* Mobile Apply Button (Optional visual helper) */}
        <button 
            onClick={() => setShowFilter(false)}
            className="w-full bg-black text-white py-3 mt-4 text-sm font-medium uppercase sm:hidden active:bg-gray-800"
        >
            Apply Filters
        </button>
      </div>

      {/* Right Side (Products & Header) */}
      <div className="flex-1">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between text-base sm:text-2xl mb-4 gap-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          
          {/* Mobile Toolbar (Filter Trigger & Sort) */}
          <div className="flex justify-between gap-4 items-center w-full sm:w-auto">
             {/* Mobile Filter Button */}
             <button 
                onClick={() => setShowFilter(true)} 
                className="sm:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-50 transition-colors"
             >
                <FaFilter className="text-gray-500" /> Filters
             </button>

             {/* Sort Dropdown */}
             <select
                onChange={(e) => setSortType(e.target.value)}
                className="border-2 border-gray-300 text-sm px-2 py-2 rounded outline-none cursor-pointer flex-1 sm:flex-none"
              >
                <option value="relavent">Sort By: Relavent</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
          </div>
        </div>

        {/* Products Grid */}
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
                quantity={item.quantity}
                offerPrice={item.offerPrice}
              />
            ))}
          </div>
        ) : (
          <div className="text-center min-h-[50vh] flex flex-col items-center justify-center">
            <div className="text-6xl text-gray-200 mb-4">
              <TbFaceIdError />
            </div>
            <h1 className="text-black font-bold text-3xl">Not Found</h1>
            <h3 className="text-gray-500 font-semibold text-base sm:text-xl mt-4 px-4">
              We couldn't find what you're looking for.{" "}
              <Link
                to={"/contact"}
                className="border-b-2 text-black border-black hover:text-gray-600"
              >
                Contact us
              </Link>
              {" "}if you need help.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;