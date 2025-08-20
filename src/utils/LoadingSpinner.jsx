import React, { useState, useEffect } from "react";
import logo2 from "../assets/logo2.svg";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.png";
import logo5 from "../assets/logo5.png";
import logo6 from "../assets/logo6.png";

const images = [logo2, logo3, logo4, logo5, logo6];

const LoadingSpinner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 600); // change every 600ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md z-[1000]">
      <div className="relative w-24 h-24">
        <img
          src={images[currentIndex]}
          alt="loading"
          className="w-20 h-20 transition-opacity duration-500 ease-in-out"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
