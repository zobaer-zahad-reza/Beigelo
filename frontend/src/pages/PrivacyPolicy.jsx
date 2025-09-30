import React from "react";
import {
  ShieldCheck,
  DatabaseZap,
  Cog,
  Share2,
  Cookie,
  UserCheck,
  Baby,
  RefreshCw,
  TicketPercent,
  Phone,
  MapPin,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const policySections = [
    {
      icon: <DatabaseZap size={32} className="text-[#D6A77A]" />,
      title: "1. Information We Collect",
      content:
        "When you visit or make a purchase from Beigelo, we may collect personal information including your name, phone number, email, billing/shipping address, and payment information necessary to process your order. We may also collect browsing data like IP address and cookies to improve your experience.",
    },
    {
      icon: <Cog size={32} className="text-[#D6A77A]" />,
      title: "2. How We Use Your Information",
      content:
        "We use your information to process and deliver orders, provide customer service, communicate updates and promotions, and improve website security and performance.",
    },
    {
      icon: <Share2 size={32} className="text-[#D6A77A]" />,
      title: "3. Sharing of Information",
      content:
        "We do not sell your personal information. We may share it with trusted service providers for delivery, payment processing, or IT support, and with legal authorities if required.",
    },
    {
      icon: <ShieldCheck size={32} className="text-[#D6A77A]" />,
      title: "4. Data Security",
      content:
        "We use SSL encryption, firewalls, and other technologies to protect your information. No online transmission is completely secure, but we strive to safeguard your data.",
    },
    {
      icon: <Cookie size={32} className="text-[#D6A77A]" />,
      title: "5. Cookies",
      content:
        "Cookies enhance your shopping experience. You may disable them in your browser, but some site features may not function properly.",
    },
    {
      icon: <UserCheck size={32} className="text-[#D6A77A]" />,
      title: "6. Your Rights",
      content:
        "You can access, update, or request deletion of your personal data and opt-out of marketing communications anytime.",
    },
    {
      icon: <Baby size={32} className="text-[#D6A77A]" />,
      title: "7. Children’s Privacy",
      content:
        "Beigelo does not knowingly collect information from children under 13. Contact us if you believe a child has shared data.",
    },
    {
      icon: <RefreshCw size={32} className="text-[#D6A77A]" />,
      title: "8. Updates to Privacy Policy",
      content:
        "We may update this policy periodically. Any changes will be posted here with the updated effective date.",
    },
    {
      icon: <TicketPercent size={32} className="text-[#D6A77A]" />,
      title: "9. Future Discounts",
      content:
        "In the future, if we offer discounts or special promotions, we will notify you accordingly.",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Privacy & Policy
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            Last Updated: September 30, 2025
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="space-y-10">
            {policySections.map((section, index) => (
              <div
                key={index}
                className="flex items-start gap-4 sm:gap-6 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Contact Us Section */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                10. Contact Us
              </h2>
              <p className="text-center text-gray-600 mb-8">
                If you have questions about this policy or your data, contact
                us:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Phone size={24} className="text-[#D6A77A] mb-2" />
                  <a
                    href="tel:01625239776"
                    className="font-semibold text-gray-800 hover:text-[#D6A77A] transition-colors"
                  >
                    01625239776
                  </a>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin size={24} className="text-[#D6A77A] mb-2" />
                  <p className="font-semibold text-gray-800">
                    Jatrabari, Kalam Mension, Dhaka-1203
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Mail size={24} className="text-[#D6A77A] mb-2" />
                  <a
                    href="mailto:beigelobd@gmail.com"
                    className="font-semibold text-gray-800 hover:text-[#D6A77A] transition-colors"
                  >
                    beigelobd@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            {/* Using the Link component as you specified, without any z-index */}
            <Link
              to={"/"}
              className="inline-flex items-center gap-2 bg-[#D6A77A] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#b58959] transition-all duration-300 transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6A77A]"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
