import React from "react";
import  Section2  from './Section2';
import Section3 from './Section3'
import Customers from './Customers'
import { Link } from "react-router-dom";
const OnlinePresenceSection = () => {
  return (
    <div className=" w-full ">
    <div className="flex flex-col md:flex-row  px-6 py-10  md:px-16  gap-10">
      {/* Left Text Content */}
      <div className="  w-full px-4">
        <h2 className="text-3xl md:text-4xl  lg:text-[57px] font-bold text-[#1E3473] mb-6">
          Our Online presence
        </h2>
        <div className=" md:w-[80%] w-full">
        <p className="text-[#656565] text-[21px] mb-3  ">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
          Velit officia consequat duis enim velit mollit.
        </p>
        <p className="text-[#656565] text-[21px] mb-3">
          Exercitation veniam consequat sunt nostrud amet.
        </p>
        <p className="text-[#656565] text-[21px] mb-6">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
          Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
        </p>
       </div>
        <Link to ="/product" className="bg-[#1a1a4b] hover:bg-[#0f0f3a] text-white font-semibold px-8 py-3 rounded-full">
          Discover Now
        </Link>
    
      </div>

      {/* Right Image/Video Placeholder */}
      <div className=" md:w-1/2 w-full ">
      <div className="   lg:w-[600px] lg:h-[400px] md:w-[350px] md:h-[200px]  bg-[#000127] rounded-4xl shadow-lg"></div>
    </div>
    </div>
   <Section2/>
   <div className="px-6 py-10  md:px-16">
   <Section3/>

   </div>
   <div className="px-6 py-10  md:px-16">
   <Customers/>
   </div>
    </div>
  );
};

export default OnlinePresenceSection;
