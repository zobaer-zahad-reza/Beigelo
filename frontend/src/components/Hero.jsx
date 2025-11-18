import React from "react";

function Hero() {
  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden bg-black rounded-md">
      <iframe
        className="absolute top-1/2 left-1/2 w-[177.77vh] min-w-full min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        src="https://www.youtube.com/embed/L1JoUErVauw?autoplay=1&mute=1&loop=1&playlist=L1JoUErVauw&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      <div className="absolute inset-0 bg-transparent"></div>
    </div>
  );
}

export default Hero;