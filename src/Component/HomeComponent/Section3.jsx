import React from "react";
import image7 from "../../assets/homepage7.webp";
import image8 from "../../assets/homepage8.webp";
import image9 from "../../assets/homepage9.webp";
import { Link } from "react-router-dom";

const PromoSection = () => {
  return (
    <div className="w-full py-2 flex flex-col lg:flex-row gap-2">
      {/* Left Main Banner */}
      <div className="lg:w-1/2 w-full relative">
        <div className="bg-[#1e293b] rounded-2xl text-white flex justify-between p-6 h-auto md:h-[390px] overflow-hidden">
          <div className="md:w-1/2 w-full">
            <p className="text-[23.13px] mb-2">Rasberry Pie</p>
            <h2 className="lg:text-[58.45px] md:text-[30px] text-2xl font-bold leading-tight mb-2">
              Case BB-3
            </h2>
            <Link
              to="/product"
              className="bg-[#F7941D] text-[#000000] px-3 py-2 my-2 rounded-full font-semibold inline-block"
            >
              Discover Now
            </Link>
            <p className="text-[12.49px] text-gray-300 py-2">
              BE THE FIRST TO OWN
            </p>
            <p className="text-[17px] font-medium">From</p>
            <p className="text-[30px] font-medium">₹399</p>
          </div>

         <div className="w-full md:w-1/2 relative flex justify-center md:block">
  <img
    src={image7}
    alt="Case BB-3"
    className="transform rotate-180 scale-x-[-1] object-contain md:absolute md:bottom-0 md:right-0 md:w-[400px] w-[220px] mx-auto md:mx-0"
    style={{
      position: 'absolute',
      right: 0,
      bottom: 0,
      marginRight: 0,
    }}
  />
</div>

        </div>
      </div>

      {/* Right Grid Section */}
      <div className="lg:w-1/2 w-full">
        {/* Always 2 columns */}
        <div
          className="grid grid-cols-2 gap-4 w-full"
          style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          {[
            { title: "3d Printer", color: "#f7941d", image: image8, dark: false },
            { title: "Drone BB-3", color: "#1E3473", image: image9, dark: true },
            { title: "Drone BB-3", color: "#1E3473", image: image9, dark: true },
            { title: "3d Printer", color: "#f7941d", image: image8, dark: false },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-[#F6F6F6] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between relative transition-all min-h-[250px] md:min-h-auto"
            >
              {/* --- Desktop layout (unchanged) --- */}
              <div className="hidden md:flex items-center justify-between w-full">
                <div>
                  <p className="text-sm text-[#f7941d] mb-1">Parts</p>
                  <p
                    className={`font-bold text-[34.83px] ${
                      card.dark ? "text-[#1E3473]" : "text-blue-900"
                    }`}
                  >
                    {card.title}
                  </p>
                  <Link
                    to="/product"
                    className={`${
                      card.dark
                        ? "bg-[#1E3473] text-white"
                        : "bg-[#f7941d] text-white"
                    } px-3 py-2 text-sm rounded-full inline-block mt-2`}
                  >
                    Discover Now
                  </Link>
                </div>
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-40 h-auto object-contain"
                />
              </div>

              {/* --- Mobile layout (equal height, image center, button below) --- */}
            <div className="flex flex-col justify-between items-start w-full h-full md:hidden p-1">
              {/* Text Section - Compact */}
              <div className="mb-1">
                <p className="text-xs text-[#f7941d] mb-0.5">Parts</p>
                <p
                  className={`font-bold text-lg leading-tight ${
                    card.dark ? "text-[#1E3473]" : "text-blue-900"
                  }`}
                >
                  {card.title}
                </p>
              </div>

              {/* Image - Centered with proper height */}
              <div className="flex-1 flex flex-col justify-center items-center w-full my-0">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-20 h-20 object-contain"
                />
              </div>

              {/* Button - Compact */}
              <div className="mt-2 w-full flex justify-start">
                <Link
                  to="/product"
                  className={`${
                    card.dark
                      ? "bg-[#1E3473] text-white"
                      : "bg-[#f7941d] text-white"
                  } px-3 py-1.5 text-xs rounded-full inline-block hover:opacity-90 transition-opacity`}
                >
                  Discover Now
                </Link>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoSection;
