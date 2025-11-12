"use client";

import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import { Link } from "react-router-dom";

const imageArr = [
  {
    imgLink: "https://i.ibb.co.com/hxb67wSz/Frank-Muller.jpg",
    name: "Frank_Muller",
  },
  {
    imgLink: "https://i.ibb.co.com/0RvwqCCD/Tissot-Fina.jpg",
    name: "Tissot",
  },
];

const BrandMarquee = () => (
  <div className="flex size-full items-center justify-center bg-background mt-16 mb-16">
    <Marquee>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />
      <MarqueeContent>
        {imageArr.map((image, index) => (
          <Link to={image.name}>
            <MarqueeItem
              className="w-20 md:w-44 flex flex-col justify-center align-middle "
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
);

export default BrandMarquee;
