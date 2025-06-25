import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from "lucide-react";

const InstagramSection = () => {
    const reelUrls = [
        "https://www.instagram.com/reel/DJZK3qBTzkk/",
        "https://www.instagram.com/reel/C324AHKN4hx/",
        "https://www.instagram.com/reel/C3pEwyZtYuN/",
        "https://www.instagram.com/reel/DBEXlP_u8LX/",
        "https://www.instagram.com/reel/DJZK3qBTzkk/",
        "https://www.instagram.com/reel/C324AHKN4hx/",
        "https://www.instagram.com/reel/C3pEwyZtYuN/",
        "https://www.instagram.com/reel/DBEXlP_u8LX/",
        "https://www.instagram.com/reel/DJZK3qBTzkk/",
        "https://www.instagram.com/reel/C324AHKN4hx/",
        "https://www.instagram.com/reel/C3pEwyZtYuN/",
        "https://www.instagram.com/reel/DBEXlP_u8LX/"
    ];

    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);

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

    const totalPages = Math.ceil(reelUrls.length / itemsPerPage);

    // Reset page if total pages change
    useEffect(() => {
        if (currentPage >= totalPages) {
            setCurrentPage(Math.max(0, totalPages - 1));
        }
    }, [itemsPerPage, totalPages]);

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
    };

    const currentItems = reelUrls.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    // Load Instagram embed script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Process embeds when items change
    useEffect(() => {
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }, [currentItems]);

    return (
        <div className='w-full h-auto pb-5 lg:pb-20'>
            <h1 className='text-2xl font-bold text-[#3e3e3e] text-center md:text-3xl lg:text-4xl'>
                Our Instagram Reels
            </h1>
            <p className='text-center text-xs mt-2 sm:text-base md:px-10 lg:px-20 xl:px-52 2xl:px-60 font-semibold text-[#8c8c8c]'>
                Check out our latest Instagram content
            </p>

            <div className="relative mt-5 lg:mt-10">
                {/* Left Arrow */}
                <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow hover:bg-gray-100"
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Carousel Grid */}
                <div className="px-5 sm:px-10 lg:px-14">
                    <div className={`grid gap-4 ${itemsPerPage === 1 ? "grid-cols-1" : itemsPerPage === 2 ? "grid-cols-2" : "grid-cols-4"}`}>
                        {currentItems.map((url, index) => (
                            <div key={index} className="instagram-embed-container">
                                <blockquote 
                                    className="instagram-media" 
                                    data-instgrm-permalink={url}
                                    data-instgrm-version="20"
                                    style={{
                                        background: '#FFF', 
                                        border: '0',
                                        borderRadius: '3px',
                                        boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                                        margin: '1px',
                                        maxWidth: '540px',
                                        minWidth: '326px',
                                        padding: '0',
                                        width: '100%',
                                        height: '500px',
                                        objectFit: 'cover',
                                    }}
                                >
                                </blockquote>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow hover:bg-gray-100"
                    onClick={handleNext}
                    disabled={currentPage >= totalPages - 1}
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
                                : "bg-gray-300"
                            }`}
                        onClick={() => setCurrentPage(idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export default InstagramSection;