import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Section1 from "./../Component/HomeComponent/Section1";
import Section2 from "./../Component/HomeComponent/Section2";
import Section3 from "./../Component/HomeComponent/Section3";
import image7 from "./../assets/homepage12.webp";
import vector1 from "./../assets/Vector1.webp";
import vector2 from "./../assets/Vector2.webp";
import vector3 from "./../assets/Vector3.webp";
import Section5 from "./../Component/HomeComponent/Section5";
import blue from "../assets/green.webp";
import battery from "../assets/battery.gif";
import drone from "../assets/drone.gif";
import sensor from "../assets/sensor.gif";
import motors from "../assets/motors.gif";
import board from "../assets/board.gif";
import printer from "../assets/printer.gif";
import secure from "../assets/secure.gif";
import cargo from "../assets/cargo.gif";
import support from "../assets/support.gif";
import VideoSection from "../Component/VideoSection";
import { useProducts } from "../context/ProductContext";
import Customers from "../Component/B2bComponent/Customers.jsx";
import Marquee from "../Component/HomeComponent/Marquee.jsx";
import ShimmerUI from "../utils/ShimmerUI.jsx";
import BlogsSection from "../sections/BlogsSection.jsx";

const ProductSlider = () => {
  const { products, loading } = useProducts();
  const [error, setError] = useState(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!loading && products.length === 0) {
      setError("Failed to fetch products. Please try again later.");
    }
  }, [loading, products]);

  useEffect(() => {
    window.scrollToReviews = () => {
      if (reviewsRef.current) {
        reviewsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };
    return () => {
      delete window.scrollToReviews;
    };
  }, []);

  const cardData = [
    { image: board, title: "Development Board", category: "Development Board" },
    { image: sensor, title: "Sensors", category: "Sensors" },
    { image: motors, title: "Motors and Drivers", category: "Motors and Drivers" },
    { image: battery, title: "Battery", category: "Battery" },
    { image: printer, title: "3D Printer", category: "3D Printer" },
    { image: drone, title: "Drone Parts", category: "Drone Parts" },
  ];

  const features = [
    {
      img: cargo,
      title: "100% Original Products",
      subtitle: "Shop worry-free with 100% original products.",
    },
    {
      img: secure,
      title: "Secure Payment",
      subtitle: "Secure and seamless payments, every time.",
    },
    {
      img: support,
      title: "24×7 Technical support available",
      subtitle: "We are always here – round-the-clock technical assistance.",
    },
  ];

  return (
    <div className="overflow-hidden">
      <div className="px-2 sm:px-4 md:px-6 lg:px-10 pt-4 sm:pt-6">
        {/* ====================== TOP CATEGORIES SECTION ====================== */}
        <div className="py-2 sm:py-4">
          <div
            className="
              category-grid-container
              grid 
              grid-cols-3 
              sm:grid-cols-3 
              md:grid-cols-4 
              lg:grid-cols-6 
              gap-3 
              sm:gap-4 
              md:gap-5 
              justify-items-center
            "
          >
            {cardData.map((card, index) => (
              <Link
                to={`/allproducts?category=${encodeURIComponent(card.category)}`}
                key={index}
                className="group w-full max-w-[120px]"
              >
                <div
                  className="
                    relative overflow-hidden rounded-xl sm:rounded-2xl bg-white 
                    border border-gray-200 p-2 sm:p-3 
                    flex flex-col items-center justify-center 
                    transition-all duration-300 hover:shadow-md hover:border-[#F7941D]
                    aspect-square
                  "
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-2">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xs sm:text-sm lg:text-base font-semibold text-blue-900 group-hover:text-[#F7941D] transition-colors duration-300 leading-tight">
                      {card.title}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ====================== HERO SECTION ====================== */}
<div className="bg-[#000127] w-full rounded-xl sm:rounded-2xl py-4 sm:py-6 lg:py-2 px-4 sm:px-6 lg:px-12 xl:px-20 flex flex-col lg:flex-row gap-4 lg:gap-2 relative overflow-hidden min-h-[320px] sm:min-h-[450px] lg:min-h-[500px]">
  {/* Left: Text Section */}
  <div className="lg:w-1/2 w-full flex flex-col justify-center z-20 relative">
    {/* Raspberry Pi Title + Image (for mobile inline) */}
    <div className="flex items-center justify-between w-full">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[32px] text-white font-semibold mb-1 sm:mb-2">
          Raspberry Pi
        </h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[72px] font-bold leading-tight text-white">
          Model 5
        </h1>
      </div>

      {/* ✅ Mobile Inline Image beside heading */}
      {/* ✅ Mobile Inline Image beside heading */}
<img
  src={image7}
  alt="Raspberry Pi Model 5"
  className="
    block lg:hidden 
    w-[50%] sm:w-[45%] 
    max-w-[200px]
    h-auto object-contain ml-3
    drop-shadow-xl rounded-xl
    transform scale-110 sm:scale-125
    transition-transform duration-500 ease-in-out
    hover:scale-130
  "
/>

    </div>

    {/* Text below */}
    <p className="text-gray-400 text-sm sm:text-base lg:text-lg pt-2 sm:pt-4 lg:pt-8 mb-1">
      BE THE FIRST TO OWN
    </p>
    <p className="text-base sm:text-lg lg:text-xl text-white mt-1 mb-2">
      From
    </p>
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-4 sm:mb-6">
      <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-[36px] text-white font-bold">
        ₹399
      </span>
      <Link
        to="/product"
        className="bg-[#1e3473] hover:bg-orange-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base lg:text-lg font-medium transition-colors duration-200 inline-block"
      >
        Discover Now
      </Link>
    </div>

    {/* Features Grid */}
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-2 pt-4">
      <div className="flex items-center gap-2 sm:gap-3 font-[outfit]">
        <img
          src={vector1}
          className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
          alt="100% Original"
        />
        <div>
          <h3 className="text-white text-xs sm:text-sm lg:text-[14px] font-semibold leading-tight">
            100% Original Products
          </h3>
          <p className="text-white text-xs sm:text-[11px] leading-tight opacity-80">
            Shop worry-free with 100% original products
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 font-[outfit]">
        <img
          src={vector2}
          className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
          alt="Secure Payment"
        />
        <div>
          <h3 className="text-white text-xs sm:text-sm lg:text-[14px] font-semibold leading-tight">
            Secure Payment
          </h3>
          <p className="text-white text-xs sm:text-[11px] leading-tight opacity-80">
            Secure and seamless payments, every time
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 font-[outfit] sm:col-span-2 lg:col-span-1">
        <img
          src={vector3}
          className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
          alt="24x7 Support"
        />
        <div>
          <h3 className="text-white text-xs sm:text-sm lg:text-[14px] font-semibold leading-tight">
            24×7 Technical support
          </h3>
          <p className="text-white text-xs sm:text-[11px] leading-tight opacity-80">
            We're always here – round-the-clock technical assistance
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Right: Image Section (desktop only) */}
  <div className="lg:w-1/2 w-full flex items-center justify-center lg:justify-end relative">
    <div className="hidden lg:flex absolute right-0 bottom-0 h-full items-end">
      <div className="relative w-[500px] xl:w-[680px] h-full flex items-end">
        <img
          src={image7}
          className="object-contain rounded-2xl relative z-40 w-full h-auto"
          alt="Raspberry Pi Model 5"
        />
        <img
          src={blue}
          className="absolute top-0 right-40 xl:right-60 w-full h-[600px] xl:h-[800px] z-10 opacity-80"
          alt=""
        />
      </div>
    </div>
  </div>
</div>


        {/* ====================== FEATURES SECTION ====================== */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 py-2 sm:py-8 relative">
  {features.map((feature, index) => (
    <div
      key={index}
      className="usp-card relative flex flex-col items-center text-center gap-2 sm:gap-3 px-2 sm:px-3 py-3 sm:py-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
    >
      <div className="flex-shrink-0">
        <img
          src={feature.img}
          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 p-1 sm:p-2 rounded-lg"
          alt={feature.title}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs sm:text-sm lg:text-base font-bold text-blue-900 leading-tight mb-1">
          {feature.title}
        </h3>
        <p className="text-xs sm:text-sm text-orange-500 leading-tight">
          {feature.subtitle}
        </p>
      </div>
    </div>
  ))}
</div>

        {/* ====================== REMAINING CONTENT ====================== */}
        {loading ? (
          <div className="py-2">
            <ShimmerUI />
          </div>
        ) : error ? (
          <div className="text-center py-2 text-red-500">{error}</div>
        ) : (
          <>
            <Section3 />
            <div className="pt-2">
              <Section1 products={products} />
            </div>
            <VideoSection />
            <Section5 />
            <Section2 products={products} />
            <BlogsSection />
            <div ref={reviewsRef} id="customer-feedback-section">
              <Customers />
            </div>
          </>
        )}
      </div>
      <Marquee />
    </div>
  );
};

export default ProductSlider;
