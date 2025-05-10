import React, { useEffect } from "react";
import Section1 from "./../Component/HomeComponent/Section1";
import Section2 from "./../Component/HomeComponent/Section2";
import Section3 from "./../Component/HomeComponent/Section3";
import Section4 from "./../Component/HomeComponent/Section4";
import image7 from "./../assets/homepage7.png";
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
import blue from "../assets/bluelight.svg";
import InstagramCarousel from "../Component/HomeComponent/Instagram";
const ProductSlider = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
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

      {/* Bottom Categories */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-between items-center ">
        <div className="flex-1 bg-[#E0E0E0] shadow-md rounded-xl p-4 flex items-center  gap-6 justify-between w-full relative">
          <div className="text-sm h-[76px] ">
            <span className="text-[#555555]">
              CATCH BIG <span className="text-[#1E3473]">DEALS</span>ON
            </span>
            <br />
            <span className="font-semibold text-[#555555]"> Drone Parts</span>
          </div>

          <img
            src={image9}
            className="w-[220px] md:h-[160px] lg:h-[190px] h-[120px] object-contain absolute md:right-6 -right-3 md:-top-14 -top-8"
          />
          <img src={icon4} className=" right w-8 h-5" />
        </div>

        <div className="flex-1 bg-[#E0E0E0] shadow-md rounded-xl p-4 flex items-center  gap-6 justify-between w-full relative">
          <div className="text-sm h-[76px] ">
            <span className="text-[#555555]">
              CATCH BIG <span className="text-[#1E3473]">DEALS</span>ON
            </span>
            <br />
            <span className="font-semibold text-[#555555]"> Drone Parts</span>
          </div>

          <img
            src={image8}
            className="w-[210px] lg:h-[180px] h-[120px] object-contain absolute md:right-6 right-4 lg:-top-12 -top-4"
          />
          <img src={icon4} className=" right w-8 h-5" />
        </div>

        <div className="flex-1 bg-[#E0E0E0] shadow-md rounded-xl p-4 flex items-center  gap-6 justify-between w-full relative">
          <div className="text-sm h-[76px] ">
            <span className="text-[#555555]">
              CATCH BIG <span className="text-[#1E3473]">DEALS</span>ON
            </span>
            <br />
            <span className="font-semibold text-[#555555]"> Drone Parts</span>
          </div>

          <img
            src={image10}
                className="w-[210px] lg:h-[150px] h-[120px] object-contain absolute md:right-6 right-4 lg:-top-10 -top-4"
          />
          <img src={icon4} className=" right w-8 h-5" />
        </div>
      </div>

      <Section1 />
      <Section2 />
      <Section3 />
      <Section1 />
      <Section5 />
      <InstagramCarousel/>
    </div>
  );
};

export default ProductSlider;
