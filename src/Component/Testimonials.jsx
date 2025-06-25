import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import person1 from "../assets/per1.png";
import person2 from "../assets/per2.png";
import person3 from "../assets/per3.png";

 
const users = [
    {
        id: 1,
        name: "Rajeev Sinha",
        designation: "Startup Founder",
        location: "Delhi",
        rating: 5,
        title: "Startup Founder, Delhi",
        quote: "We sourced a range of development boards and IoT sensors from Bharatronix, and the quality exceeded our expectations. The delivery was prompt, and their support team is very responsive. Highly recommended for tech entrepreneurs!",
        image: person1
    },
    {
        id: 2,
        name: "Sneha Arora",
        designation: "Robotics Educator",
        location: "Pune",
        rating: 5,
        title: "Robotics Educator, Pune",
        quote: "Bharatronix is my go-to supplier for electronic components. Their Arduino kits are well-organized and beginner-friendly, making it easy for my students to grasp practical concepts.",
        image: person2
    },
    {
        id: 3,
        name: "Ankit Mehta",
        designation: "Embedded Engineer",
        location: "Bangalore",
        rating: 5,
        title: "Embedded Engineer, Bangalore",
        quote: "I’ve been ordering Raspberry Pi accessories and microcontrollers for months now. Bharatronix consistently delivers quality products with great packaging and reliable support.",
        image: person3
    },
    {
        id: 4,
        name: "Divya Sharma",
        designation: "College Student",
        location: "Jaipur",
        rating: 5,
        title: "College Student, Jaipur",
        quote: "As a B.Tech student working on my final-year project, Bharatronix helped me get all the necessary modules at affordable rates. Their tutorials and quick delivery made my life easier.",
        image: person1
    },
    {
        id: 5,
        name: "Karan Patel",
        designation: "Hobbyist",
        location: "Ahmedabad",
        rating: 5,
        title: "Hobbyist, Ahmedabad",
        quote: "Excellent collection of sensors and modules! I appreciate the fast shipping and the informative product descriptions. Great for DIY projects.",
        image: person2
    },
    {
        id: 6,
        name: "Dr. Pooja Menon",
        designation: "STEM Trainer",
        location: "Kochi",
        rating: 5,
        title: "STEM Trainer, Kochi",
        quote: "Our STEM lab needed bulk kits for an upcoming bootcamp. Bharatronix not only delivered everything on time but also gave us educational discounts. Very professional and helpful.",
        image: person3
    },
    {
        id: 7,
        name: "Mohit Verma",
        designation: "IoT Developer",
        location: "Hyderabad",
        rating: 5,
        title: "IoT Developer, Hyderabad",
        quote: "Finding authentic and affordable components online is always a challenge—but Bharatronix has changed that for me. Whether it's NodeMCU boards or sensor kits, the quality is top-notch, and everything arrives exactly as described. I also appreciate their proactive customer support during bulk orders.",
        image: person1
    }
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