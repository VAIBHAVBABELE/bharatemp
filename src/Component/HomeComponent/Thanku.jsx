import React from "react";
import thanku from '../../assets/thanku.png'
const OrderSuccess = () => {
  return (
    <div className="flex items-center justify-center h-[510px] bg-white px-4">
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-52 h-52 flex items-center justify-center">
            {/* Replace this with your actual SVG or image */}
          <img src={thanku}/>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-xl md:text-[30px] font-semibold text-[#383838]">
          Your Order is successfully Placed
        </h1>

        {/* Subtext */}
        <p className="text-[#383838] mt-2 text-sm sm:text-[24px]">
          Your product will be delivered in 3–5 working days
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
