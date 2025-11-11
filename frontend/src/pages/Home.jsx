import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import SearchBar from "../components/SearchBar";
import BrandMarquee from "../components/BrandMarquee";

const Home = () => {
  return (
    <div>
      <Hero />
      <h1 className="mt-20 text-4xl font-bold">Popular Brands</h1>
      <BrandMarquee />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
