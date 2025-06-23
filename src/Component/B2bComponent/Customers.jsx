import React, { useState, useEffect } from "react";
import image1 from '../../assets/img1.png'
import image2 from '../../assets/img2.png'
const testimonials = [
  {
    image: image1,
    name: "Rajeev Sinha",
    title: "Startup Founder, Delhi",
    rating: 5,
    text:
      "We sourced a range of development boards and IoT sensors from Bharatronix, and the quality exceeded our expectations. The delivery was prompt, and their support team is very responsive. Highly recommended for tech entrepreneurs!",
  },
  {
    image: image2,
    name: "Sneha Arora",
    title: "Robotics Educator, Pune",
    rating: 5,
    text:
      "Bharatronix is my go-to supplier for electronic components. Their Arduino kits are well-organized and beginner-friendly, making it easy for my students to grasp practical concepts.",
  },
  {
    image: image1,
    name: "Ankit Mehta",
    title: "Embedded Engineer, Bangalore",
    rating: 5,
    text:
      "I’ve been ordering Raspberry Pi accessories and microcontrollers for months now. Bharatronix consistently delivers quality products with great packaging and reliable support.",
  },
  {
    image: image2,
    name: "Divya Sharma",
    title: "College Student, Jaipur",
    rating: 5,
    text:
      "As a B.Tech student working on my final-year project, Bharatronix helped me get all the necessary modules at affordable rates. Their tutorials and quick delivery made my life easier.",
  },
  {
    image: image1,
    name: "Karan Patel",
    title: "Hobbyist, Ahmedabad",
    rating: 5,
    text:
      "Excellent collection of sensors and modules! I appreciate the fast shipping and the informative product descriptions. Great for DIY projects.",
  },
  {
    image: image2,
    name: "Dr. Pooja Menon",
    title: "STEM Trainer, Kochi",
    rating: 5,
    text:
      "Our STEM lab needed bulk kits for an upcoming bootcamp. Bharatronix not only delivered everything on time but also gave us educational discounts. Very professional and helpful.",
  },
  {
    image: image1,
    name: "Mohit Verma",
    title: "IoT Developer, Hyderabad",
    rating: 5,
    text:
      "Finding authentic and affordable components online is always a challenge—but Bharatronix has changed that for me. Whether it's NodeMCU boards or sensor kits, the quality is top-notch, and everything arrives exactly as described. I also appreciate their proactive customer support during bulk orders.",
  },
];

const chunkTestimonials = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const Section4 = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleResize = () => setIsMobile(window.innerWidth < 768);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const groupedTestimonials = isMobile
    ? testimonials.map((t) => [t])
    : chunkTestimonials(testimonials, 3);

  const totalSlides = groupedTestimonials.length;

  const goNext = () =>
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const goPrev = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <div className="w-full py-10 bg-white">
      <h2 className="text-2xl text-[#133240] font-bold mb-2 lg:text-[41px] md:text-[30px] text-[25px]">
        Our Customer Feedback
      </h2>
      <p className="text-[#133240] md:text-[29px] text-[20px] mb-8">
        Don’t take our word for it. Trust our customers
      </p>

      <div className="flex items-center justify-center">
        <div className="overflow-hidden w-full  px-4">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {groupedTestimonials.map((group, groupIdx) => (
              <div key={groupIdx} className="flex w-full flex-shrink-0">
                {group.map((testimonial, idx) => (
                  <div
                    key={idx}
                    className="w-full md:w-1/3 px-2 flex-shrink-0"
                  >
                    <div className="bg-white rounded-xl shadow-md p-6 border space-y-4">
                      <div className="  space-x-4">
                       <div className="flex flex-col md:flex-row justify-between ">
                        <img
                          className="w-16 h-16 object-cover"
                          src={testimonial.image}
                          alt={testimonial.name}
                        />
                          <div className="flex space-x-1 text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 fill-current ${
                                    i < testimonial.rating
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 15l-5.878 3.09L5.64 12.18 1.28 8.41l6.162-.89L10 2l2.558 5.52 6.162.89-4.36 3.77 1.518 5.91z" />
                                </svg>
                              ))}
                            </div>
                       </div>
                           <h2 className="text-lg font-semibold text-[#133240] md:text-[29px]  text-[20px] pt-4">
                              {testimonial.name}
                            </h2> 
                          <p className="text-sm text-[#133240] md:text-[21px]  text-[20px] pt-2 line-clamp-3">
                            {testimonial.text}
                          </p>
                        </div>
                      </div>
                    </div>
                 
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {groupedTestimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-4 w-4 rounded-full transition-all ${
              currentSlide === index
                ? "bg-blue-800 ring-2 ring-white ring-offset-2"
                : "bg-blue-400 hover:bg-blue-600"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Section4;
