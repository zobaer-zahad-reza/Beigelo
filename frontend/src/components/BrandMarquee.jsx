"use client";

import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import { Link } from "react-router-dom";
import Title from "./Title";

const imageArr = [
  {
    imgLink: "https://i.ibb.co.com/4gS6VQsv/download.jpg",
    name: "Frank_Muller",
  },
  {
    imgLink:
      "https://i.ibb.co.com/zVK5c6JF/tissot-logo-png-seeklogo-298018.png",
    name: "Tissot",
  },
  {
    imgLink: "https://i.ibb.co.com/zhCKKWQJ/download.png",
    name: "Omega",
  },
  {
    imgLink: "https://i.ibb.co.com/ym00jkYp/download.png",
    name: "Tag-Heuer",
  },
  {
    imgLink: "https://i.ibb.co.com/1fLDccqK/images.png",
    name: "Fossil",
  },
  {
    imgLink: "https://i.ibb.co.com/VpqyrQVP/download.png",
    name: "Rolex",
  },
];

const BrandMarquee = () => (
  <div className="mt-16">
    <div className="text-center py-8 text-3xl md:text-4xl">
      <Title text1={"POPULAR"} text2={"BRANDS"} />
    </div>
    <div className="flex size-full items-center justify-center bg-background  mb-16">
      <Marquee>
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent>
          {imageArr.map((image, index) => (
            <Link to={image.name}>
              <MarqueeItem
                className="w-28 md:w-44 flex flex-col justify-center align-middle "
                key={index}
              >
                <img
                  alt={`Placeholder ${index}`}
                  className="overflow-hidden rounded-full"
                  src={`${image.imgLink}`}
                />
              </MarqueeItem>
            </Link>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  </div>
);

export default BrandMarquee;
