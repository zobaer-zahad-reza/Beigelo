import React from "react";
// react-icons ইমপোর্ট করা হলো (আগের আইকনগুলোর বদলে এগুলো ব্যবহার করা সহজ ও মডার্ন)
import {
  RiExchangeDollarLine,
  RiCustomerService2Line,
  RiSecurePaymentLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import { TbTruckReturn } from "react-icons/tb";

const OurPolicy = () => {
  const policies = [
    {
      icon: <RiExchangeDollarLine size={30} />,
      title: "Easy Exchange",
      desc: "Hassle-free exchange. Not satisfied? Swap it instantly.",
    },
    {
      icon: <TbTruckReturn size={30} />,
      title: "7 Days Return",
      desc: "Shop confidently with our 7-day free return policy.",
    },
    {
      icon: <RiCustomerService2Line size={30} />,
      title: "24/7 Support",
      desc: "We are here for you. Contact our expert team anytime.",
    },
    {
      icon: <RiSecurePaymentLine size={30} />,
      title: "Secure Payment",
      desc: "We ensure 100% secure payment with SSL encryption.",
    },
    {
      icon: <RiShieldCheckLine size={30} />,
      title: "100% Original",
      desc: "Authentic products guaranteed. We never compromise on quality.",
    },
  ];

  return (
    <section className="bg-white py-24 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-10">
        {/* Section Header (Optional: এটা সেকশনটিকে আরও আকর্ষণীয় করবে) */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Shop With Beigelo?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Experience seamless shopping with our customer-first policies
            designed for your peace of mind.
          </p>
        </div>

        {/* Policy Grid/Flex */}
        <div className="flex flex-wrap justify-center gap-8">
          {policies.map((item, index) => (
            <div
              key={index}
              className="group w-full sm:w-[45%] lg:w-[30%] xl:w-[18%] border border-gray-100 bg-gray-50 hover:bg-white p-8 rounded-xl hover:shadow-xl transition-all duration-500 cursor-pointer text-center"
            >
              <div className="w-14 h-14 bg-white group-hover:bg-black rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm transition-colors duration-300 text-black group-hover:text-white">
                {/* Icon renders here */}
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
