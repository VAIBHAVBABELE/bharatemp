import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import img1 from './../../assets/homepage1.png';
import img2 from './../../assets/homepage2.png'
const images = [
  img1, img2, img1, img2, img1, img2
];

export default function InstagramCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(4);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleSlides(1);
      } else if (window.innerWidth < 1024) {
        setVisibleSlides(3);
      } else {
        setVisibleSlides(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Calculate the slides to display with looping
  const getDisplayedImages = () => {
    let displayed = [];
    for (let i = 0; i < visibleSlides; i++) {
      const index = (currentIndex + i) % images.length;
      displayed.push(images[index]);
    }
    return displayed;
  };

  const displayedImages = getDisplayedImages();

  return (
    <div className="w-full px-4 py-12 bg-white">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold">Our Instagram Page</h2>
        <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto mt-2">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam
        </p>
      </div>

      <div className="relative mt-10 flex items-center">
        <button 
          onClick={handlePrev} 
          className="absolute left-0 z-10 bg-white p-2 rounded-full  border border-gray-300 hover:bg-gray-100"
        >
          <FaArrowLeft />
        </button>

        <div
          ref={sliderRef}
          className="flex overflow-hidden w-full gap-8 justify-center"
        >
          {displayedImages.map((src, idx) => (
            <div 
              key={`${currentIndex}-${idx}`} 
              className="min-w-[250px] md:min-w-[280px] lg:min-w-[300px] bg-gray-200 rounded-xl shadow-md h-[250px] animate-fadeIn"
            >
              {/* You should add your image here */}
              <img 
                src={src} 
                alt={`Instagram ${idx}`} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          ))}
        </div>

        <button 
          onClick={handleNext} 
          className="absolute right-0 z-10 bg-white p-2 rounded-full shadow border border-gray-300 hover:bg-gray-100"
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-start mt-10 gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              i === currentIndex ? 'bg-blue-800' : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}