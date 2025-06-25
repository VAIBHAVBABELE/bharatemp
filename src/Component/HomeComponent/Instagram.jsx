import React, { useState, useEffect } from "react";
import { BsInstagram } from "react-icons/bs";
import left from "../../assets/left.png";
import right from "../../assets/right.png";

const Instagram = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backend = import.meta.env.VITE_BACKEND;

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const response = await fetch(`${backend}/news/instagram-reels`);
                if (!response.ok) throw new Error('Failed to fetch reels');
                const data = await response.json();
                setReels(data);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                // Fallback to placeholder images if API fails
                setReels([
                    { media_url: "https://via.placeholder.com/300x200?text=Reel+1", permalink: "#" },
                    { media_url: "https://via.placeholder.com/300x200?text=Reel+2", permalink: "#" },
                    { media_url: "https://via.placeholder.com/300x200?text=Reel+3", permalink: "#" },
                    { media_url: "https://via.placeholder.com/300x200?text=Reel+4", permalink: "#" },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchReels();

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalSlides = isMobile ? reels.length : Math.ceil(reels.length / 4);
    const goNext = () => setCurrentSlide(prev => (prev + 1) % totalSlides);
    const goPrev = () => setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);

    if (loading) return <div>Loading Instagram reels...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full h-auto border-4 border-red-400">
            <h2 className="text-2xl font-bold mb-2">Our Instagram Reels</h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-6">
                Check out our latest Instagram reels
            </p>

            <div className="relative flex items-center justify-center">
                <img
                    src={left}
                    alt="Left Arrow"
                    onClick={goPrev}
                    className="absolute top-1/2 left-4 z-2 -translate-y-1/2 p-2 rounded-full transition cursor-pointer"
                />

                <div className="overflow-hidden w-full max-w-7xl">
                    <div
                        className="flex transition-transform duration-900 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {reels.map((reel, idx) => (
                            <div
                                key={idx}
                                className="w-full md:w-1/4 px-2 flex-shrink-0"
                            >
                                <a 
                                    href={reel.permalink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block bg-gray-100 rounded-3xl overflow-hidden shadow w-full h-[418px] border-4 border-red-400"
                                >
                                    <video
                                        src={reel.media_url}
                                        className="object-cover w-full h-full"
                                        muted
                                        loop
                                        playsInline
                                    />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <img
                    src={right}
                    alt="Right Arrow"
                    onClick={goNext}
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full transition cursor-pointer"
                />
            </div>

            <div className="flex gap-2 pl-4 md:pl-24 mt-6">
                {[0, 1, 2].map((dotIndex) => (
                    <button
                        key={dotIndex}
                        onClick={() => setCurrentSlide(dotIndex)}
                        className={`h-4 w-4 rounded-full border-2 border-blue-800 transition-all
                            ${
                                currentSlide === dotIndex
                                    ? "bg-blue-800 ring-2 ring-blue-800 ring-offset-2 ring-offset-white"
                                    : "bg-blue-800 hover:bg-blue-800"
                            }`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Instagram;