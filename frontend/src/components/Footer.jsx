import React from "react";
// import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <Link to="/">
            <h1 className="text-5xl playfair-display-navlogo">Beigelo</h1>
          </Link>
          <p className="w-full md:w-2/3 text-gray-600 mt-4">
            Crafting timeless accessories for the modern you. At Beigelo, we
            believe that style should be both effortless and enduring.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium md-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <Link to={"/"}>Home</Link>
            <Link to={"about"}>About Us</Link>
            <Link>Delivery</Link>
            <Link to={"/privacy-policy"}>Privacy Policy</Link>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium md-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+880 1608-068403 </li>
            <li>beigelobd@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright © {currentYear}{" "}
          <Link
            target="_blank"
            className="font-semibold"
            to={"https://www.facebook.com/share/19vTyppgNS/ "}
          >
            StartEdge
          </Link>
          . All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
