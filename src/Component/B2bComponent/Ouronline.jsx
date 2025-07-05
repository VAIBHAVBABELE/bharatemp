import React, { useEffect, useState, useRef } from "react";
import Section2 from './Section2';
import Section3 from './Section3';
import Customers from './Customers';
import b2b from "../../assets/b2b.webp";
import { Link, useLocation } from "react-router-dom";
import { FaCloud, FaRobot, FaPlusCircle, FaWind, FaHelicopter } from 'react-icons/fa';
const OnlinePresenceSection = () => {
  const [showModal, setShowModal] = useState(false);
  const sectors = [
    { id: 1, name: "IT/IoT", icon: FaCloud },
    { id: 2, name: "Automation", icon: FaRobot },
    { id: 3, name: "Medical", icon: FaPlusCircle },
    { id: 4, name: "Renewable Energy", icon: FaWind },
    { id: 5, name: "Drone Manufacturer", icon: FaHelicopter }
  ];

  const customerSectionRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/b2bpage") {
      const el = document.getElementById("customer-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row px-6 py-10 md:px-16 gap-10">
        {/* Left Text Content */}
        <div className="w-full flex flex-col justify-center px-4">
          <h2 className="text-3xl md:text-4xl lg:text-[57px] font-bold text-[#1E3473] mb-6">
            Who We Are
          </h2>
          <div className="md:w-[80%] w-full">
            <p className="text-[#656565] text-[21px] mb-6">
              India's first one-stop platform for sourcing and manufacturing electronic components, complete with an integrated supply chain and logistics network.
            </p>
          </div>
          <Link to="/contact"
            className="bg-[#1a1a4b] flex justify-center items-center w-[250px] hover:bg-[#0f0f3a] text-white font-semibold px-8 py-3 rounded-full"
          >
            Connect with us
          </Link>
        </div>

        {/* Right Image/Video Placeholder */}
        <div className="md:w-1/2 w-full">
          <div className="lg:w-[600px] lg:h-[400px] md:w-[350px] md:h-[200px] bg-[#000127] rounded-4xl shadow-lg">
            <img src={b2b} alt="Bharatronix" className="w-full h-full object-cover rounded-4xl" />
          </div>
        </div>
      </div>

      {/* B2B Sector We Serve Section */}
    

      <Section2 />
      <div className="px-6 py-10 md:px-16">
        <Section3 />
      </div>
      <div className="w-full flex flex-col items-center py-12 lg:py-24 px-4 md:px-12 lg:px-20 bg-gradient-to-b from-white to-blue-50">
  <div className="max-w-6xl w-full text-center">
    <h2 className="text-4xl md:text-5xl font-bold lg:text-[52px] text-[#1E3473] mb-6">
      B2B Sectors We Serve
    </h2>
    <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
      We partner with innovative industries to deliver cutting-edge solutions
    </p>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
      {sectors.map((sector) => (
        <div 
          key={sector.id}
          className="flex cursor-pointer flex-col items-center gap-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-8 hover:-translate-y-2 border border-gray-100"
        >
          <div className="p-4 rounded-full bg-blue-100 text-blue-600">
            <sector.icon className="text-3xl" />
          </div>
          <span className="font-semibold text-lg text-gray-800 text-center">
            {sector.name}
          </span>
        </div>
      ))}
    </div>
  </div>
</div>
      <div id="customer-section" className="px-6 py-10 md:px-16">
        <Customers />
      </div>
      {showModal && <ContactFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default OnlinePresenceSection;
