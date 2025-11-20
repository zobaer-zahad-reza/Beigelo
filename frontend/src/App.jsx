import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Navigate ইমপোর্ট করুন
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/ScrollToTop";
import Spinner from "./components/Spinner";
import SocialSideNav from "./components/SocialSideNav";

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

            {/* 1. Collection Page (All Products) */}
            <Route path="/collection" element={<Collection />} />

            {/* 2. Product Root (Redirects to Collection) */}
            <Route
              path="/product"
              element={<Navigate to="/collection" replace />}
            />

            {/* 3. Category Page (e.g. /product/watch) */}
            <Route path="/product/:categorySlug" element={<Collection />} />

            {/* 4. Sub-Category Page (e.g. /product/watch/man) */}
            <Route
              path="/product/:categorySlug/:subCategorySlug"
              element={<Collection />}
            />

            {/* 5. Single Product Details Page (Full Link) */}
            <Route
              path="/product/:categorySlug/:subCategorySlug/:productSlug/:productId"
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
