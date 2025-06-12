import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Section1 from "./../Component/HomeComponent/Section1";
import Section2 from "./../Component/HomeComponent/Section2";
import Section3 from "./../Component/HomeComponent/Section3";
import Section4 from "./../Component/HomeComponent/Section4";
import image7 from "./../assets/homepage12.png";
import vector1 from "./../assets/Vector1.png";
import vector2 from "./../assets/Vector2.png";
import image1 from "./../assets/homepage9.png";
import image2 from "./../assets/homepage8.png";
import vector3 from "./../assets/Vector3.png";
import Section5 from "./../Component/HomeComponent/Section5";
import image8 from "../assets/homepage8.png";
import image9 from "../assets/homepage9.png";
import icon4 from "../assets/icon4.png";
import image10 from "../assets/homepage10.png";
import blue from "../assets/green.png";
import top1 from '../assets/generator.png'
import top2 from '../assets/top1.png'
import cart1 from '../assets/Cart4.png';
import cart2 from '../assets/cart5.png';
import cart3 from '../assets/cart6.png';
// import InstagramCarousel from "../Component/HomeComponent/Instagram";
import InstagramSection from "../Component/InstagramSection";
// import Testimonials from "../Component/Testimonials";
import { fetchProducts } from "../utils/api";
import Customers from '../Component/B2bComponent/Customers.jsx'
import Marquee from "../Component/HomeComponent/Marquee.jsx";
import LoadingSpinner from "../utils/LoadingSpinner.jsx"
const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const cardData = [
    {
      image: top1,
      title: 'Development Board',
      version: 'Arduino, ESP32, RPi',
      category: 'Development Board'
    },
    {
      image: top2,
      title: 'Sensors',
      version: 'Temperature, Pressure, Motion',
      category: 'Sensors'
    },
    {
      image: top2,
      title: 'Motors and Drivers',
      version: 'DC, Stepper, Servo',
      category: 'Motors and Drivers'
    },
    {
      image: top2,
      title: 'Battery',
      version: 'LiPo, Li-ion, NiMH',
      category: 'Battery'
    },
    {
      image: top2,
      title: '3D Printer',
      version: 'Parts & Accessories',
      category: '3D Printer'
    },
    {
      image: top2,
      title: 'Drone Parts',
      version: 'ESC, Flight Controllers, Props',
      category: 'Drone Parts'
    }
  ];
  const features = [
    {
      img: cart1,
      title: '100% Original Products',
      subtitle: 'Shop worry-free with 100% original products.',
    },
    {
      img: cart2,
      title: 'Secure Payment',
      subtitle: 'Secure and seamless payments, every time.',
    },
    {
      img: cart3,
      title: '24×7 Technical support available',
      subtitle: 'We’re always here – round-the-clock technical assistance.',
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
                  <div 
                    className="absolute inset-[-8px] bg-gradient-to-r from-[#1E3473] via-[#F7941D] to-[#1E3473]"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'moveGradient 2s linear infinite'
                    }}
                  />
                  
                  {/* Main content */}
                  <div className="relative m-[2px] bg-[#F5F5F5] rounded-2xl px-3 flex flex-col md:flex-row items-center justify-between transition-all duration-300">
                    <div>
                      <h2 className="text-sm mt-4 lg:mt-0 lg:text-lg font-semibold text-blue-900 group-hover:text-[#F7941D] transition-colors duration-300">
                        {card.title}
                      </h2>
                    </div>
                    <div>
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-20 h-20 object-cover mb-2"
                      />
                    </div>
                  </div>

                  {/* Add the keyframes style */}
                  <style jsx>{`
                    @keyframes moveGradient {
                      0% {
                        background-position: 0% 0%;
                      }
                      100% {
                        background-position: 200% 0%;
                      }
                    }
                  `}</style>
                </div>
              </Link>
            ))}
          </div>
        </div>


        <div className="bg-[#000127] w-full xl:h-[750px] h-auto lg:px-20 md:px-12 px-6 rounded-2xl p-6 flex flex-col lg:flex-row  gap-10 relative overflow-hidden ">
          {/* Left: Text Section */}
          <div className="flex-1 md:w-1/2 w-full lg:text-left  pt-50">
            <h2 className="md:text-[33.12px] text-[20px] text-[#FFFFFF] font-semibold">
              Rasberry Pie
            </h2>
            <h1 className="lg:text-[83.69px] text-[40px]  font-bold leading-20 text-[#FFFFFF] ">
              Model 5
            </h1>
            <p className="text-[#999999] text-[16.99px] lg:pt-12 pt-6">
              BE THE FIRST TO OWN
            </p>
            <p className="text-[23px] text-[#FFFFFF] mt-2">From </p>
            <div className="flex  gap-10 items-center leading-3  ">
              <span className="  text-[39.75px] text-[#FFFFFF] ">₹399</span>
              <Link to ="/product" className="mt-4 bg-[#1e3473] hover:bg-orange-600 text-white py-4 px-6 rounded-full text-[12px] lg:text-[19.54px] font-medium">
                Discover Now
              </Link>
            </div>
            {/* Icons */}
            <div className=" w-full flex flex-col xl:flex-row   gap-6 pt-6  ">
              <div className="flex items-center gap-2 font-[outfit]">
                <img src={vector1} className="text-xl text-[#FFFFFF]" />
                <div>
                  <h3 className="text-[#FFFFFF] text-[14.42px] font-semibold">100% Original Products</h3>
                  <p className="text-[#FFFFFF] text-[11px]">Shop worry-free with 100% original products</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-[outfit] ">
                <img src={vector2} className="text-xl text-[#FFFFFF]" />
                <div>
                  <h3 className="text-[#FFFFFF] text-[14.42px] font-semibold">Secure Payment</h3>
                  <p className="text-[#FFFFFF] text-[11px]">Secure and seamless payments, every time</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-[outfit]">
                <img src={vector3} className="text-xl text-[#FFFFFF]" />
                <div>
                  <h3 className="text-[#FFFFFF] text-[14.42px] font-semibold">24×7 Technical support</h3>
                  <p className="text-[#FFFFFF] text-[11px]">We're always here – round-the-clock technical assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image Section */}
          <div className="absolute right-0 bottom-0 hidden lg:block">
            <div className="  relative lg:w-[550px] md:w-[350px] w-[150px]  ">
              <img
                src={image7}
                className=" object-contain rounded-2xl relative z-40"
              />
              <img
                src={blue}
                className="absolute -top-48 -left-44 w-full h-[480px] z-10 "
              />
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10  py-6 ">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-4  py-2 rounded-2xl bg-[#F5F5F5] border-1 border-[#E0E0E0] shadow-sm"
            >
              <img src={feature.img} className="  p-2 rounded-lg"

              />
              <div>
                <h3 className="text-sm font-bold text-blue-900">{feature.title}</h3>
                <p className="text-sm text-orange-500">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>


        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="">
              <LoadingSpinner/>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <>
          <Section3 />
           <Section1 products={products} />
          <InstagramSection />
           <Section5 />
           
            <Section2 products={products} />
{/*             
            <Section1 products={products} /> */}
           
            
            {/* <Testimonials/> */}
            <Customers />

          </>
        )}

      </div>
      <Marquee />
    </div>
  );
};

export default ProductSlider;
