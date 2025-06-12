import React from "react";
import logo2 from "../assets/logo2.svg";

const LoadingSpinner = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={logo2}
        alt="Loading..."
        className="w-16 h-16 animate-spin"
        style={{ animationDuration: '1.5s' }}
      />
    </div>
  );
};

export default LoadingSpinner;