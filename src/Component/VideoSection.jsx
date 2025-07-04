import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import video1 from '../assets/video1.mp4';
import video2 from '../assets/video2.mp4';
import video3 from '../assets/video3.mp4';
import video4 from '../assets/video4.mp4';
import video5 from '../assets/video5.mp4';
import video6 from '../assets/video6.mp4';
import video7 from '../assets/video7.mp4';
import video8 from '../assets/video8.mp4';
import video9 from '../assets/video9.mp4';
import video10 from '../assets/video10.mp4';
import video11 from '../assets/video12.mp4';

const VideoSection = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [playingVideo, setPlayingVideo] = useState(null);
    const videoRefs = useRef({});

    const videos = [
        { src: video1, title: "Product Demo 1" },
        { src: video2, title: "Product Demo 2" },
        { src: video3, title: "Product Demo 3" },
        { src: video4, title: "Product Demo 4" },
        { src: video5, title: "Product Demo 5" },
        { src: video6, title: "Product Demo 6" },
        { src: video7, title: "Product Demo 7" },
        { src: video8, title: "Product Demo 8" },
        { src: video9, title: "Product Demo 9" },
        { src: video10, title: "Product Demo 10" },
        { src: video11, title: "Product Demo 11" },
    ];

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

    const totalPages = Math.ceil(videos.length / itemsPerPage);

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

    const currentItems = videos.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    const handleVideoClick = (index) => {
        if (playingVideo === index) {
            // If clicking the currently playing video, pause it
            videoRefs.current[index].pause();
            setPlayingVideo(null);
        } else {
            // Pause the currently playing video (if any)
            if (playingVideo !== null && videoRefs.current[playingVideo]) {
                videoRefs.current[playingVideo].pause();
            }
            // Play the clicked video
            videoRefs.current[index].play();
            setPlayingVideo(index);
        }
    };

    return (
        <div className='w-full h-auto py-10 lg:pb-20'>
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

                {/* Video Grid */}
                <div className="px-5 sm:px-10 lg:px-14">
                    <div className={`grid gap-4 ${
                        itemsPerPage === 1 
                            ? "grid-cols-1" 
                            : itemsPerPage === 2 
                                ? "grid-cols-2" 
                                : "grid-cols-4"
                    }`}>
                        {currentItems.map((video, index) => (
                            <div key={index} className="relative group">
                                <video
                                    ref={el => videoRefs.current[index] = el}
                                    className="w-full h-[550px] object-cover rounded-xl border border-gray-400 shadow-lg"
                                    src={video.src}
                                    onClick={() => handleVideoClick(index)}
                                    onEnded={() => setPlayingVideo(null)}
                                >
                                    Your browser does not support the video tag.
                                </video>
                                {playingVideo !== index && (
                                    <div 
                                        className="absolute inset-0 flex items-center justify-center 
                                                 bg-transparent backdrop-blur-[2px]
                                                 transition-all duration-300 cursor-pointer rounded-lg"
                                        onClick={() => handleVideoClick(index)}
                                    >
                                        <div className="w-16 h-16 flex items-center justify-center 
                                                      bg-white bg-opacity-90 rounded-full 
                                                      group-hover:bg-opacity-100 transition-all duration-300">
                                            <Play className="w-8 h-8 text-[#1e3473]" />
                                        </div>
                                    </div>
                                )}
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

export default VideoSection; 