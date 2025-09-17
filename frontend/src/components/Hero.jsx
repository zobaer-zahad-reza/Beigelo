import React from "react";
import HeroVid0 from "../assets/HeroVid4.mp4";

function Hero() {
  return (
    <div className="w-full md:h-[70vh]">
      <video
        className="w-full h-full object-cover rounded-lg"
        src={HeroVid0}
        autoPlay
        loop
        muted
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default Hero;
