import React, { useEffect, useState } from "react";
import image7 from "./../assets/homepage7.webp";
import vector1 from "./../assets/Vector1.webp";
import vector2 from "./../assets/Vector2.webp";
import vector3 from "./../assets/Vector3.webp";
import icon4 from "../assets/icon4.webp";
import image10 from "../assets/homepage10.webp";
import blue from "../assets/bluelight.svg";
import InstagramSection from "../Component/InstagramSection";
import { fetchProducts } from "../utils/api";
import Product from '../Component/Subcategorycomponent/Product'
import Section from '../Component/Subcategorycomponent/Section.jsx';
import logo2 from "../assets/logo2.svg";

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

  return (
    <div className="px-4 md:px-10 py-10">
      <div className="bg-[#32333B] w-full lg:h-[455px] h-auto lg:px-20 md:px-12 px-6 rounded-2xl p-6 flex flex-col lg:flex-row  gap-10 relative overflow-hidden ">
        {/* Left: Text Section */}
        <div className="flex-1 md:w-1/2 w-full lg:text-left">
          <h2 className="md:text-[33.12px] text-[20px] text-[#FFFFFF] font-semibold">
            Rasberry Pie
          </h2>
          <h1 className="lg:text-[83.69px] text-[40px]  font-bold leading-20 text-[#FFFFFF] ">
            Case BB-3
          </h1>
          <p className="text-[#999999] text-[16.99px] lg:pt-12 pt-6">
            BE THE FIRST TO OWN
          </p>
          <p className="text-[23px] text-[#FFFFFF] mt-2">From </p>
          <div className="flex  gap-10 items-center leading-3  ">
            <span className="  text-[39.75px] text-[#FFFFFF] ">₹399</span>
            <button className="mt-4 bg-[#F7941D] hover:bg-orange-600 text-[#000000] py-4 px-6 rounded-full text-[12px] lg:text-[19.54px] font-medium">
              Discover Now
            </button>
          </div>
          {/* Icons */}
          <div className="flex flex-col md:flex-row gap-6 pt-6  ">
            <div className="flex items-center gap-2 font-[outfit]">
              <img src={vector1} className="text-xl text-[#FFFFFF]" />
              <span className="text-[#FFFFFF] text-[14.42px]">
                Transparent
                <br />
                Customer service
              </span>
            </div>
            <div className="flex items-center gap-2 font-[outfit] ">
              <img src={vector2} className="text-xl text-[#FFFFFF]" />
              <span className="text-[#FFFFFF] text-[14.42px]">
                Shipping <br /> Free,fast and reliable in India
              </span>
            </div>
            <div className="flex items-center gap-2 font-[outfit]">
              <img src={vector3} className="text-xl text-[#FFFFFF]" />
              <span className="text-[#FFFFFF] text-[14.42px]">
                Secure
                <br />
                Certified marketplace
              </span>
            </div>
          </div>
        </div>

        {/* Right: Image Section */}
        <div className="absolute right-10 -bottom-12 hidden lg:block">
          <div className="relative lg:w-[450px] md:w-[350px] w-[150px]">
            <img
              src={image7}
              className="rotate-180 transform scale-x-[-1] object-contain rounded-2xl"
            />
            <img 
              src={blue} 
              className="absolute -top-20 -left-44 w-full h-[450px]" 
            />
          </div>
        </div>
      </div>

     

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <img 
            src={logo2} 
            alt="Loading..." 
            className="w-16 h-16 animate-spin"
            style={{ animationDuration: '1.5s' }}
          />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
        <Product/>
          <Section/>
          {/* <Section2 products={products} /> */}
          {/* <Section3 />
          <Section1 products={products} />
          <Section5 />
          <InstagramSection/>
          {/* <Testimonials/> */}
          {/* <Customers/> */}
          {/* <Marquee/>  */}
        </>
      )}
    </div>
  );
};

export default ProductSlider ;
