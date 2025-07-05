import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Section1 from "./../Component/HomeComponent/Section1";
import Section2 from "./../Component/HomeComponent/Section2";
import Section3 from "./../Component/HomeComponent/Section3";
import Section4 from "./../Component/HomeComponent/Section4";
import image7 from "./../assets/homepage12.webp";
import vector1 from "./../assets/Vector1.webp";
import vector2 from "./../assets/Vector2.webp";
import image1 from "./../assets/homepage9.webp";
import image2 from "./../assets/homepage8.webp";
import vector3 from "./../assets/Vector3.webp";
import Section5 from "./../Component/HomeComponent/Section5";
import image8 from "../assets/homepage8.webp";
import image9 from "../assets/homepage9.webp";
import icon4 from "../assets/icon4.webp";
import image10 from "../assets/homepage10.webp";
import blue from "../assets/green.webp";
import top1 from '../assets/generator.webp'
import battery from '../assets/battery.gif'
import drone from "../assets/drone.gif"
import sensor from "../assets/sensor.gif"
import motors from "../assets/motors.gif"
import board from "../assets/board.gif"
import printer from "../assets/printer.gif"
import secure from "../assets/secure.gif";
import cargo from "../assets/cargo.gif";
import shield from "../assets/shield.gif";
import wallet from "../assets/wallet.gif";
import support from "../assets/support.gif";
import VideoSection from "../Component/VideoSection";
import { fetchProducts } from "../utils/api";
import Customers from '../Component/B2bComponent/Customers.jsx'
import Marquee from "../Component/HomeComponent/Marquee.jsx";
import ShimmerUI from "../utils/ShimmerUI.jsx"
const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch products from the backend
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    getProducts();
  }, []);

  // Expose scroll function for footer
  useEffect(() => {
    window.scrollToReviews = () => {
      if (reviewsRef.current) {
        reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    return () => { delete window.scrollToReviews; };
  }, []);

  const cardData = [
    {
      image: board,
      title: 'Development Board',
      version: 'Arduino, ESP32, RPi',
      category: 'Development Board'
    },
    {
      image: sensor,
      title: 'Sensors',
      version: 'Temperature, Pressure, Motion',
      category: 'Sensors'
    },
    {
      image: motors,
      title: 'Motors and Drivers',
      version: 'DC, Stepper, Servo',
      category: 'Motors and Drivers'
    },
    {
      image: battery,
      title: 'Battery',
      version: 'LiPo, Li-ion, NiMH',
      category: 'Battery'
    },
    {
      image: printer,
      title: '3D Printer',
      version: 'Parts & Accessories',
      category: '3D Printer'
    },
    {
      image: drone,
      title: 'Drone Parts',
      version: 'ESC, Flight Controllers, Props',
      category: 'Drone Parts'
    }
  ];
  const features = [
    {
      img: cargo,
      title: '100% Original Products',
      subtitle: 'Shop worry-free with 100% original products.',
    },
    {
      img: secure,
      title: 'Secure Payment',
      subtitle: 'Secure and seamless payments, every time.',
    },
    {
      img: support,
      title: '24×7 Technical support available',
      subtitle: 'We are always here – round-the-clock technical assistance.'
    },
  ];

  return (
    <div className="overflow-hidden">
      <div className="px-4 md:px-10 pt-6">
        {/* top section */}
        <div className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {cardData.map((card, index) => (
              <Link
                to={`/allproducts?category=${encodeURIComponent(card.category)}`}
                key={index}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Spinning gradient border */}
                  {/* <div 
                    className="absolute inset-[-8px] bg-gradient-to-r from-[#1E3473] via-[#F7941D] to-[#1E3473]"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'moveGradient 2s linear infinite'
                    }}
                  /> */}
                  
                  {/* Main content */}
                  <div className="relative m-[2px] bg-[#fff] border-1 border-[#E0E0E0]  rounded-2xl px-3 flex flex-col md:flex-row items-center justify-between transition-all duration-300">
                    <div>
                      <h2 className="text-sm mt-4 lg:mt-0 lg:text-lg font-semibold text-blue-900 group-hover:text-[#F7941D] transition-colors duration-300">
                        {card.title}
                      </h2>
                    </div>
                    <div className="flex items-center justify-center w-20 h-20 ">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                  </div>

                  {/* Add the keyframes style */}
                  {/* <style jsx>{`
                    @keyframes moveGradient {
                      0% {
                        background-position: 0% 0%;
                      }
                      100% {
                        background-position: 200% 0%;
                      }
                    }
                  `}</style> */}
                </div>
              </Link>
            ))}
          </div>
        </div>


        <div className="bg-[#000127] w-full xl:h-[500px] h-auto lg:px-20 md:px-12 px-4 rounded-2xl py-10 flex flex-col lg:flex-row gap-8 relative overflow-hidden">
          {/* Left: Text Section */}
          <div className=" lg:w-1/2 w-full lg:text-left flex flex-col justify-center">
            <h2 className="md:text-[32px] text-[20px] text-[#FFFFFF] font-semibold mb-2">
              Rasberry Pie
            </h2>
            <h1 className="lg:text-[72px] text-[36px] font-bold leading-tight text-[#FFFFFF] mb-2">
              Model 5
            </h1>
            <p className="text-[#999999] text-[16px] lg:pt-8 pt-4 mb-1">
              BE THE FIRST TO OWN
            </p>
            <p className="text-[20px] text-[#FFFFFF] mt-1 mb-2">From</p>
            <div className="flex gap-6 items-center mb-6">
              <span className="text-[36px] text-[#FFFFFF] font-bold">₹399</span>
              <Link
                to="/product"
                className="bg-[#1e3473] hover:bg-orange-600 text-white py-3 px-6 rounded-full text-[14px] lg:text-[18px] font-medium transition-colors duration-200"
              >
                Discover Now
              </Link>
            </div>
            {/* Icons */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              <div className="flex items-center gap-3 font-[outfit]">
                <img src={vector1} className="w-8 h-8" alt="100% Original" />
                <div>
                  <h3 className="text-[#FFFFFF] text-[14px] font-semibold">100% Original Products</h3>
                  <p className="text-[#FFFFFF] text-[11px] leading-tight">
                    Shop worry-free with 100% original products
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 font-[outfit]">
                <img src={vector2} className="w-8 h-8" alt="Secure Payment" />
                <div>
                  <h3 className="text-[#FFFFFF] text-[14px] font-semibold">Secure Payment</h3>
                  <p className="text-[#FFFFFF] text-[11px] leading-tight">
                    Secure and seamless payments, every time
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 font-[outfit]">
                <img src={vector3} className="w-8 h-8" alt="24x7 Support" />
                <div>
                  <h3 className="text-[#FFFFFF] text-[14px] font-semibold">24×7 Technical support</h3>
                  <p className="text-[#FFFFFF] text-[11px] leading-tight">
                    We're always here – round-the-clock technical assistance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image Section */}
          <div className="absolute right-0 bottom-0 hidden lg:flex h-full items-end">
            <div className="relative lg:w-[680px] w-[320px] h-full flex items-end">
              <img
                src={image7}
                className="object-contain rounded-2xl relative z-40 w-full h-auto"
                alt="Raspberry Pi Model 5"
              />
              <img
                src={blue}
                className="absolute top-0 right-60 w-full h-[800px] z-10"
                alt=""
              />
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10  py-8 ">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-4  py-2 rounded-2xl  border-1 border-[#E0E0E0] shadow-sm"
            >
              <img src={feature.img} className="  p-2 w-20 h-20 rounded-lg"

              />
              <div>
                <h3 className="text-sm font-bold text-blue-900">{feature.title}</h3>
                <p className="text-sm text-orange-500">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>


        {loading ? (
          <div className="py-10">
            <ShimmerUI />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <>
            <Section3 />
            <div className="pt-10">
              <Section1 products={products} />
            </div>
            <VideoSection />
            <Section5 />
            <Section2 products={products} />
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
