import React from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import LocationMap from "../components/LocationMap";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src="https://i.postimg.cc/ZYM3PTg4/about-img-BAJy-TXw9.png"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Beigelo was born from a passion for minimalist design and a desire
            to provide a curated collection of accessories that stand the test
            of time. Our journey began with a simple idea: to offer beautifully
            crafted watches, unique ornaments, and essential caps that bring a
            sense of style and simplicity to your everyday life.
          </p>
          <p>
            Since our inception, we've worked tirelessly to select each piece
            for its quality, craftsmanship, and timeless appeal. From the moment
            you browse our collection to the moment your item arrives, we are
            dedicated to providing a seamless shopping experience focused on
            elegance and ease.{" "}
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission at Beigelo is to empower our customers with a sense of
            confidence and effortless style. We are dedicated to providing a
            seamless shopping experience that exceeds expectations, from
            browsing our collection to the moment your accessories are delivered
            to your door.
          </p>
        </div>
      </div>
      <div className="text-2xl py-4 text-center">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row txt-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            We meticulously select and craft each product to ensure it meets our
            stringent quality standards. Every watch, ornament, and cap is made
            from premium materials and built to last.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            With our user-friendly interface and hassle-free ordering process,
            shopping for your new favorite accessories has never been easier.
            We're dedicated to a smooth experience from start to finish.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Our team of dedicated professionals is here to assist you. Whether
            you have a question about an order or need help choosing the perfect
            piece, ensuring your satisfaction is our top priority.
          </p>
        </div>
      </div>

      <div className="my-4">
        <LocationMap />
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
