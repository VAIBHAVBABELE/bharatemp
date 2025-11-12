import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
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
    const [soundEnabledVideo, setSoundEnabledVideo] = useState(null);
    const videoRefs = useRef({});
    const observerRef = useRef(null);

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

    // Responsive logic
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) setItemsPerPage(1);
            else if (width < 1024) setItemsPerPage(2);
            else setItemsPerPage(4);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(videos.length / itemsPerPage);
    const currentItems = videos.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // Simple play function
    const playVideoMuted = async (globalIndex) => {
        try {
            const video = videoRefs.current[globalIndex];
            if (!video) return;

            // Pause all other videos
            Object.keys(videoRefs.current).forEach(index => {
                const otherVideo = videoRefs.current[index];
                if (otherVideo && parseInt(index) !== globalIndex) {
                    otherVideo.pause();
                }
            });

            video.muted = true;
            video.currentTime = 0;
            await video.play();
            setPlayingVideo(globalIndex);
        } catch (error) {
            // Silent handling
        }
    };

    // Click handler for sound
    const handleVideoClick = async (globalIndex) => {
        try {
            const video = videoRefs.current[globalIndex];
            if (!video) return;

            // Pause all other videos and disable their sound
            Object.keys(videoRefs.current).forEach(index => {
                const otherVideo = videoRefs.current[index];
                if (otherVideo && parseInt(index) !== globalIndex) {
                    otherVideo.pause();
                    otherVideo.muted = true;
                }
            });

            // Toggle sound for clicked video
            if (soundEnabledVideo === globalIndex) {
                // Currently has sound - mute it
                video.muted = true;
                setSoundEnabledVideo(null);
            } else {
                // Enable sound
                video.muted = false;
                video.volume = 0.7;
                video.currentTime = 0;
                await video.play();
                setPlayingVideo(globalIndex);
                setSoundEnabledVideo(globalIndex);
            }
        } catch (error) {
            // Silent handling
        }
    };

    // Intersection Observer
    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const globalIndex = parseInt(entry.target.dataset.videoIndex);
                    if (isNaN(globalIndex)) return;

                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        // In viewport - play muted
                        playVideoMuted(globalIndex);
                    } else {
                        // Out of viewport - pause
                        const video = videoRefs.current[globalIndex];
                        if (video && !video.paused) {
                            video.pause();
                            if (playingVideo === globalIndex) setPlayingVideo(null);
                            if (soundEnabledVideo === globalIndex) setSoundEnabledVideo(null);
                        }
                    }
                });
            },
            { threshold: [0, 0.5, 1] }
        );

        // Observe current videos
        setTimeout(() => {
            currentItems.forEach((_, localIndex) => {
                const globalIndex = currentPage * itemsPerPage + localIndex;
                const video = videoRefs.current[globalIndex];
                if (video && observerRef.current) {
                    observerRef.current.observe(video);
                }
            });
        }, 100);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [currentPage, itemsPerPage]);

    // Cleanup on page change
    useEffect(() => {
        Object.values(videoRefs.current).forEach(video => {
            if (video) video.pause();
        });
        setPlayingVideo(null);
        setSoundEnabledVideo(null);
    }, [currentPage]);

    return (
        <div className='w-full h-auto py-2 lg:pb-20'>
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
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                >
                    <FaArrowLeft className="w-5 h-5" />
                </button>

                {/* Video Grid */}
                <div className="px-5 sm:px-10 lg:px-14">
                    <div className={`grid gap-4 ${
                        itemsPerPage === 1 ? "grid-cols-1" : 
                        itemsPerPage === 2 ? "grid-cols-2" : "grid-cols-4"
                    }`}>
                        {currentItems.map((video, localIndex) => {
                            const globalIndex = currentPage * itemsPerPage + localIndex;
                            const isPlaying = playingVideo === globalIndex;
                            const hasSound = soundEnabledVideo === globalIndex;
                            
                            return (
                                <div 
                                    key={globalIndex} 
                                    className="relative group cursor-pointer"
                                    onClick={() => handleVideoClick(globalIndex)}
                                >
                                    <video
                                        ref={el => {
                                            if (el) {
                                                videoRefs.current[globalIndex] = el;
                                                el.dataset.videoIndex = globalIndex.toString();
                                            }
                                        }}
                                        className="w-full aspect-[9/16] object-contain rounded-xl border border-gray-400 shadow-lg bg-black transition-all duration-300 group-hover:shadow-xl"
                                        src={video.src}
                                        preload="metadata"
                                        playsInline
                                        loop
                                        muted
                                        style={{
                                            maxHeight: '600px'
                                        }}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                    
                                    {/* Sound indicator */}
                                    {hasSound && (
                                        <div className="absolute top-3 right-3 z-20">
                                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                🔊 Sound ON
                                            </div>
                                        </div>
                                    )}

                                    {/* Muted indicator */}
                                    {isPlaying && !hasSound && (
                                        <div className="absolute top-3 left-3 z-20">
                                            <div className="bg-gray-700 text-white p-1.5 rounded-full">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.846l3.537-3.816a1 1 0 011.617.816zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    {/* Click instruction */}
                                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="truncate">{video.title}</p>
                                        <p className="text-xs opacity-75">
                                            {hasSound ? "🔊 Click to mute" : "🔇 Click for sound"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow hover:bg-gray-100"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage >= totalPages - 1}
                >
                    <FaArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4 lg:px-14 lg:justify-start lg:mt-6">
                {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            idx === currentPage
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