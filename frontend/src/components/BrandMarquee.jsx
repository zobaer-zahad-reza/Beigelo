"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import { Link } from "react-router-dom";
import Title from "./Title";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const BrandMarquee = () => {
  const { backendUrl } = useContext(ShopContext);
  const [brands, setBrands] = useState([]);

  // --- Fetch Brands from Database ---
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

  if (brands.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="text-center py-8 text-3xl md:text-4xl">
        <Title text1={"POPULAR"} text2={"BRANDS"} />
      </div>

      <div className="flex size-full items-center justify-center bg-background mb-16">
        <Marquee pauseOnHover={true} className="[--duration:40s]">
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />

          <MarqueeContent>
            {brands.map((brand, index) => (
              <Link
                to={`/collection?brand=${brand.name}`}
                key={index}
                className="mx-4 md:mx-8 group"
              >
                <MarqueeItem className="w-28 md:w-44 flex flex-col justify-center items-center cursor-pointer transition-transform duration-300 hover:scale-110">
                  <img
                    alt={brand.name}
                    className="h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100"
                    src={brand.image}
                  />

                  <p className="mt-2 text-sm font-medium text-gray-500 group-hover:text-black">
                    {brand.name}
                  </p>
                </MarqueeItem>
              </Link>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>
    </div>
  );
};

export default BrandMarquee;
