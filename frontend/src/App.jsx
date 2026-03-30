import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/ScrollToTop";
import Spinner from "./components/Spinner";
import SocialSideNav from "./components/SocialSideNav";
import axios from "axios";

// Lazy loading
const Home = lazy(() => import("./pages/Home"));
const Collection = lazy(() => import("./pages/Collection"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const Orders = lazy(() => import("./pages/Orders"));
const Verify = lazy(() => import("./pages/Verify"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

const App = () => {
  useEffect(() => {
    const trackUser = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);

        const trackingData = {
          utm_source: queryParams.get("utm_source"),
          utm_medium: queryParams.get("utm_medium"),
          utm_campaign: queryParams.get("utm_campaign"),
          page: window.location.pathname,
          referrer: document.referrer,
        };

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!sessionStorage.getItem("visited")) {
          if (!backendUrl) {
            console.warn("Backend URL is missing in .env file");
            return;
          }

          await axios.post(`${backendUrl}/api/visitors/track`, trackingData);
          sessionStorage.setItem("visited", "true");
        }
      } catch (error) {
        console.error("Tracking Error", error);
      }
    };

    trackUser();
  }, []);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <ScrollToTop />
      <Navbar />
      <SearchBar />
      <div className="min-h-[60vh]">
        <SocialSideNav />
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route
              path="/product"
              element={<Navigate to="/collection" replace />}
            />
            <Route path="/product/:categorySlug" element={<Collection />} />
            <Route
              path="/product/:categorySlug/:subCategorySlug"
              element={<Collection />}
            />
            <Route
              path="/product/:categorySlug/:subCategorySlug/:productSlug"
              element={<Product />}
            />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

export default App;
