import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from "lucide-react";
 
const images = new Array(12).fill(null).map((_, i) => ({
    id: i,
    url: `https://via.placeholder.com/200x250?text=Post+${i + 1}`,
}));
 
function InstagramSection() {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const totalPages = Math.ceil(images.length / itemsPerPage);
 
    // Responsive items per page logic
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setItemsPerPage(1); // sm: 1 column
            } else if (width < 1024) {
                setItemsPerPage(2); // md: 2 columns
            } else {
                setItemsPerPage(4); // lg+: 4 columns
            }
        };
 
        window.addEventListener('resize', handleResize);
        handleResize(); // initial run
        return () => window.removeEventListener('resize', handleResize);
    }, []);
 
    // Reset page if total pages change
    useEffect(() => {
        const newTotalPages = Math.ceil(images.length / itemsPerPage);
        setCurrentPage(prev => (prev >= newTotalPages ? newTotalPages - 1 : prev));
    }, [itemsPerPage]);
 
    const handlePrev = () => {
        setCurrentPage(prev => (prev > 0 ? prev - 1 : prev));
    };
 
    const handleNext = () => {
        setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : prev));
    };
 
    const currentItems = images.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );
 
    return (
        <div className='w-full h-auto min-h-screen py-5 lg:py-20'>
            <h1 className='text-2xl font-bold text-[#3e3e3e] text-center md:text-3xl lg:text-4xl'>
                Our Instagram Page
            </h1>
            <p className='text-center text-xs mt-2 sm:text-base md:px-10 lg:px-20 xl:px-52 2xl:px-60 font-semibold text-[#8c8c8c]'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam at eligendi labore voluptatibus! Molestiae, a delectus aliquid aut nostrum commodi.
            </p>
 
            <div className="relative mt-5 lg:mt-10">
                {/* Left Arrow */}
                <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow hover:bg-gray-100"
                    onClick={handlePrev}
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
 
                {/* Carousel Grid */}
                <div className="px-5 sm:px-10 lg:px-14">
                    <div
                        className={`grid gap-4 transition-all duration-300
                            ${itemsPerPage === 1 ? "grid-cols-1" :
                                itemsPerPage === 2 ? "grid-cols-2" :
                                    "grid-cols-4"}
                        `}
                    >
                        {currentItems.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-lg overflow-hidden shadow-md bg-gray-100"
                            >
                                <img
                                    src={item.url}
                                    alt={`Instagram ${item.id}`}
                                    className="w-full h-80 lg:h-[450px] object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
 
                {/* Right Arrow */}
                <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow hover:bg-gray-100"
                    onClick={handleNext}
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
 
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4 lg:px-14 lg:justify-start lg:mt-6">
                {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-3 h-3 rounded-full transition-all duration-300
                ${idx === currentPage
                                ? "bg-[#0a2463] ring-2 ring-[#0a2463] outline-1 outline-white"
                                : "bg-[#0a2463]"
                            }`}
                        onClick={() => setCurrentPage(idx)}
                    />
                ))}
            </div>
 
        </div>
    );
}
 
export default InstagramSection;