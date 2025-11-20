import React, { useContext, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import LocationMap from "../components/LocationMap";
import { ShopContext } from "../context/ShopContext";
import Swal from "sweetalert2";

const Contact = () => {
  const { backendUrl } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // The old 'status' state is no longer needed
  // const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Sending your message...",
      text: "Please wait.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`${backendUrl}/api/send-email-contactpage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: result.message,
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Could not connect to the server. Please try again later.",
      });
    }
  };

  return (
    <div>
      <div className="text-center text-4xl pt-10">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="bg-white font-sans text-gray-800 py-12 md:py-16">
        <div className="">
          {/* ... Page Header ... */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about our
              products, pricing, or anything else, our team is ready to answer
              all your questions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-black mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold py-3 px-8 rounded-md hover:bg-gray-800 transition-colors duration-300 ease-in-out uppercase text-sm tracking-wider"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            <div className="flex flex-col justify-center items-start gap-10">
              <div className="w-full">
                <img
                  className="w-full rounded-lg shadow-md object-cover h-64"
                  src={assets.contact_img}
                  alt="Beigelo Storefront"
                />
              </div>
              <div className="flex flex-col justify-center items-start gap-6">
                <h3 className="font-semibold text-xl text-black">Our Store</h3>
                <p className="text-gray-600 leading-relaxed">
                  325-A, 3rd Floor, South Jatrabari, Kalam Mansion
                  <br />
                  Dhaka-1204, Bangladesh.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Tel:{" "}
                  <a
                    href="tel:+8801608068403"
                    className="hover:text-black hover:underline transition-all"
                  >
                    +880 1608-068403
                  </a>
                  <br />
                  Email:{" "}
                  <a
                    href="mailto:beigelobd@gmail.com"
                    className="hover:text-black hover:underline transition-all"
                  >
                    beigelobd@gmail.com
                  </a>
                </p>
              </div>
              <div className="flex flex-col justify-center items-start gap-4 border-t pt-8 w-full">
                <h3 className="font-semibold text-xl text-black">
                  Careers At Beigelo
                </h3>
                <p className="text-gray-600">
                  Interested in joining our innovative team? Learn more about
                  our company culture and open positions.
                </p>
              </div>
            </div>
          </div>

          <LocationMap />
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
