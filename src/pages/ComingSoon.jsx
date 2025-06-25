import React from "react";
import logo from "../assets/logo2.svg";
import { useEffect } from "react";

const ComingSoon = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col items-center  min-h-screen bg-white text-[#1e3473] px-4 relative overflow-hidden">
      {/* Background logo with glow effect */}
      <div className="flex items-center mt-20 justify-center">
        <img
          src={logo}
          alt="logo"
          className="w-60 h-60"
        />
      </div>

      {/* Content layer */}
      <div className="text-center z-10">

        <h1 className="mt-10 text-4xl tracking-[0.5em] font-semibold text-[#1e3473]">
          COMING SOON
        </h1>
       
      </div>
    </div>
  );
};

export default ComingSoon;
