import React from "react";
import { Link } from "react-router-dom";
import NavLogo from "../assets/NavLogo.webp";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" text-gray-700 mt-24 border-t border-gray-200">
      {/* Main Footer Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Description */}
          <div className="flex flex-col items-start">
            <Link to="/">
              <img className="w-44 mb-5" src={NavLogo} alt="Beigelo Logo" />
            </Link>
            <p className="text-sm leading-7 text-gray-600 mb-6 text-justify">
              Welcome to Beigelo, your ultimate destination for premium watches
              and timeless accessories. We are dedicated to providing
              authenticity, luxury, and style in every piece we curate. From
              classic designs to modern aesthetics, our collection is crafted to
              elevate your everyday look. Experience the art of elegance with
              us.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-6 text-sm">
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link
                  to="/"
                  className="hover:text-black hover:underline transition-colors"
                >
                  Home Page
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-black hover:underline transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/collection"
                  className="hover:text-black hover:underline transition-colors"
                >
                  Our Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery"
                  className="hover:text-black hover:underline transition-colors"
                >
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-black hover:underline transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-6 text-sm">
              Customer Support
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-black hover:underline transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-black hover:underline transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-black hover:underline transition-colors"
                >
                  Return & Exchange
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-black hover:underline transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li className="text-gray-500 pt-2">Questions? Call us 24/7</li>
            </ul>
          </div>

          {/* Newsletter & Socials */}
          <div>
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-6 text-sm">
              Stay Connected
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-6">
              Subscribe to our newsletter to get early access to new collections
              and special discounts.
            </p>

            {/* Newsletter Input */}
            <div className="flex flex-col gap-3 mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
              />
              <button className="w-full bg-black text-white text-xs font-bold px-4 py-3 uppercase tracking-widest hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/people/Beigelo/61581115972209/"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="https://www.instagram.com/beigelo_/"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all duration-300"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all duration-300"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://wa.me/8801608068403"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
          <p>Copyright © {currentYear} Beigelo. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="tel:+8801608068403" className="hover:text-black">
              Hotline: +880 1608-068403
            </a>
            <span className="hidden md:block">|</span>
            <a href="mailto:beigelobd@gmail.com" className="hover:text-black">
              beigelobd@gmail.com
            </a>
          </div>
          <p>
            Designed by{" "}
            <a
              href="https://startedge.net/"
              target="_blank"
              rel="noreferrer"
              className="text-black font-bold hover:underline"
            >
              StartEdge
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
