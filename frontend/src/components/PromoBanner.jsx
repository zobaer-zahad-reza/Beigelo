import React from "react";
import { assets } from "../assets/assets"; // আপনার ঘড়ির একটি সুন্দর বড় ছবি এখানে ইমপোর্ট করবেন

const PromoBanner = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-900 text-white my-20 py-16 px-6 md:px-20 items-center justify-between overflow-hidden">
      {/* Text Side */}
      <div className="md:w-1/2 space-y-5 text-center md:text-left z-10">
        <p className="text-gray-400 uppercase tracking-widest text-sm">
          Exclusive Offer
        </p>
        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
          Unlock the <br />{" "}
          <span className="text-[#D4AF37]">Time of Luxury</span>
        </h1>
        <p className="text-gray-300 max-w-md mx-auto md:mx-0">
          Discover our limited edition collection crafted for those who value
          precision and elegance.
        </p>
        <button className="bg-[#D4AF37] text-black px-8 py-3 font-semibold uppercase tracking-wide hover:bg-white transition-all duration-300 mt-5">
          Shop Exclusive
        </button>
      </div>

      {/* Image Side */}
      <div className="md:w-1/2 mt-10 md:mt-0 relative">
        {/* একটি বড় ঘড়ির ছবি এখানে বসবে */}
        <img
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-LabiCnKmQOfAtDalPGKaFcFcvpehfEOkrQ&s"
          } // আপনার যেকোনো একটি হাই-কোয়ালিটি ঘড়ির ছবি
          alt="Luxury Watch"
          className="w-full max-w-md mx-auto hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default PromoBanner;
