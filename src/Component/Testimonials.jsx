import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import person1 from "../assets/per1.png";
import person2 from "../assets/per2.png";
import person3 from "../assets/per3.png";

 
const users = [
    { id: 1, name: "Shruti Jain", designation: "CEO", rating: 4, title: "CEO, Mars Furniture", quote: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.", image: person1 },
    { id: 2, name: "Vansh Tyagi", designation: "Manager", rating: 5, title: "Senior Mart", quote: "Doloremque laudantium, totam rem aperiam.", image: person2 },
    { id: 3, name: "Ruhi Singh", designation: "Developer", rating: 3, title: "Junior Mart", quote: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.", image: person3},
    { id: 4, name: "Amit Kapoor", designation: "Product Lead", rating: 5, title: "Tech Venture", quote: "Et harum quidem rerum facilis est et expedita distinctio.", image: person1 },
    { id: 5, name: "Sneha Iyer", designation: "Designer", rating: 4, title: "Design Co.", quote: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.", image: person2},
    { id: 6, name: "Rohan Mehta", designation: "Marketing Head", rating: 5, title: "MarketFlow", quote: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.", image: person3 },
];
 
function Testimonials() {
    const [hoveredId, setHoveredId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
 
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) setItemsPerPage(1);
            else if (width < 1024) setItemsPerPage(2);
            else setItemsPerPage(3);
        };
 
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
 
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const visibleUsers = users.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );
 
    const isFocused = (id, index) => {
        if (hoveredId === null) return index === 0;
        return hoveredId === id;
    };
 
    const handlePrev = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
    };
 
    const handleNext = () => {
        setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
    };
 
    return (
        <div className="w-full py-10 relative">
            <h1 className="text-2xl font-bold text-[#3e3e3e] text-center md:text-3xl lg:text-4xl">
                Our Customer Says
            </h1>
            <p className="text-center text-xs mt-2 sm:text-base md:px-10 lg:px-20 xl:px-52 2xl:px-60 font-semibold text-[#8c8c8c]">
                What our happy customers say about us.
            </p>
 
            {/* Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full border shadow z-10 hover:bg-gray-100"
            >
                <ArrowLeft size={20} />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full border shadow z-10 hover:bg-gray-100"
            >
                <ArrowRight size={20} />
            </button>
 
            {/* Cards */}
            <div className="w-full flex justify-center gap-4 py-10 ">
                {visibleUsers.map((item, index) => {
                    const focused = isFocused(item.id, index);
                    return (
                        <div
                            key={item.id}
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`
        relative transition-all ease-in-out duration-700 rounded-xl cursor-pointer
        bg-[#858585]
        w-full md:w-[48%] lg:w-[30%] xl:w-[25%] h-96 flex justify-center
    `}
                            style={
                                window.innerWidth >= 1024
                                    ? { width: focused ? "40%" : "25%", transition: "width 0.7s ease-in-out" }
                                    : {}
                            }
                        >
                            <div className={`${focused ? "2xl:h-[250px] bottom-5" : "2xl:h-[300px] top-16 "} w-[95%] transition-all duration-300 ease-in-out absolute overflow-visible h-[280px] flex p-4 rounded-xl flex-col bg-white font-satoshi`}>
                                <div className="w-20 h-20 rounded-full bg-white absolute flex items-center justify-center -top-7 z-40">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 shadow-md shadow-yellow-200 rounded-full object-cover"
                                    />
                                </div>
                                <p className="text-lg mt-7">{item.name}</p>
                                <p className="text-sm text-gray-500 mt-1">{item.designation}</p>
                                <div className="flex gap-1 my-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-[#9d9d9d] font-semibold md:text-base">
                                    {item.quote}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
 
            {/* Dots */}
            <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentPage(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentPage
                            ? "bg-[#0a2463] ring-2 ring-[#0a2463] outline outline-white"
                            : "bg-[#0a2463] opacity-50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
 
export default Testimonials;