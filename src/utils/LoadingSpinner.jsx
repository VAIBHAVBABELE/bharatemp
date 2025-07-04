import React from "react";
import logo2 from "../assets/logo2.svg";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md bg-opacity-100 z-[1000]">
      <img 
        src={logo2} 
        alt="Loading..." 
        className="w-20 h-20 animate-spin"
        style={{ animationDuration: '1.5s' }}
      />
    </div>
  );
};

export default LoadingSpinner;