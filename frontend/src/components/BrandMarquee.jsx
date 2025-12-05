"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Title from "./Title";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const BrandMarquee = () => {
  const { backendUrl } = useContext(ShopContext);
  const [brands, setBrands] = useState([]);

  // Dragging & Scrolling States
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/brand/list`);
        if (response.data.success) {
          setBrands(response.data.brands);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, [backendUrl]);

  // Auto Scroll Logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let animationFrameId;

    const autoScroll = () => {
      if (scrollContainer && !isDragging && !isHovered) { 
        scrollContainer.scrollLeft += 1;

        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, isHovered, brands]);

  // Mouse Down (Start Drag)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  // Stop Drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  // Mouse Move 
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (brands.length === 0) return null;

  const infiniteBrands = [...brands, ...brands];

  return (
    <div className="mt-16">
      <div className="text-center py-8 text-3xl md:text-4xl">
        <Title text1={"POPULAR"} text2={"BRANDS"} />
      </div>

      <div className="relative w-full overflow-hidden bg-background mb-16">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex items-center space-x-8 overflow-x-hidden whitespace-nowrap py-4 px-4 cursor-grab ${
            isDragging ? "cursor-grabbing" : ""
          }`}
          style={{ scrollBehavior: "auto" }} 
        >
          {infiniteBrands.map((brand, index) => (
            <Link
              to={`/collection?brand=${brand.name}`}
              key={index}
              className="inline-block flex-shrink-0 group select-none"
              draggable="false"
            >
              <div className="w-28 md:w-44 flex flex-col justify-center items-center transition-transform duration-300 group-hover:scale-110">
                <img
                  alt={brand.name}
                  className="h-20 w-auto object-contain group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100 pointer-events-none"
                  src={brand.image}
                />
                <p className="mt-2 text-sm font-medium text-gray-500 group-hover:text-black">
                  {brand.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandMarquee;