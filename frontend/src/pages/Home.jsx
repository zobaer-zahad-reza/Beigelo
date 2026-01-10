import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import SearchBar from "../components/SearchBar";
import BrandMarquee from "../components/BrandMarquee";
import Title from "../components/Title";
import PromoBanner from "../components/PromoBanner";

const Home = () => {
  return (
    <div>
      <Hero />
      <BrandMarquee />
      <LatestCollection />
      <PromoBanner />
      <BestSeller />
      <OurPolicy />
      {/* <NewsletterBox /> */}
    </div>
  );
};

export default Home;
