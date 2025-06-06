import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaGlobeAmericas,
  FaChevronDown,
  FaBolt,
  FaMicrophone
} from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import location1 from "../assets/location.png";
import { FaShoppingBag } from "react-icons/fa";
import logo from "../assets/Logo.png";
import icon1 from "../assets/Icon1.png";
import icon2 from "../assets/icon2.png";
import { useCart } from "../context/CartContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import icon3 from './../assets/Facebook.svg'
import icon4 from './../assets/Twitter.svg'
import icon5 from './../assets/Instagram.svg'
import icon6 from './../assets/YouTube.svg'
import top1 from '../assets/generator.png'
import top2 from '../assets/top1.png'

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [location, setLocation] = useState("Delhi, India");
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { uniqueItems, cartItems } = useCart();
  const currentLocation = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  // Extract search query from URL when page loads or changes
  useEffect(() => {
    const params = new URLSearchParams(currentLocation.search);
    const query = params.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [currentLocation]);

  const navItems = [
    {
      name: "Shop a brand",
      key: "catalog",
      items: ["Categories", "PDF Download"],
      links: ["/categories", "/download-catalog"]
    },
  ];

  const locations = ["Mumbai, India", "Bengaluru, India", "Hyderabad, India"];

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? "" : key);
  };

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setShowLocationDropdown(false);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle keypress in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const categoryImages = {
    "Development Board": top1,
    "Sensors": top2,
    "Motors and Drivers": top2,
    "Battery": top2,
    "3D Printer": top2,
    "Drone Parts": top2
  };

  const categories = {
    "Development Board": {},
    "Sensors": {},
    "Motors and Drivers": {},
    "Battery": {},
    "3D Printer": {},
    "Drone Parts": {}
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        // Wait for state update before navigating
        setTimeout(() => {
          navigate(`/product?search=${encodeURIComponent(transcript.trim())}`);
        }, 500);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
        alert('Sorry, there was an error with voice recognition. Please try again.');
      };
      
      recognition.start();
    } else {
      alert('Voice search is not supported in this browser');
    }
  };

  return (
    <>
      {/* Top Blue Bar */}
      <div className="bg-[#1E3473] text-white text-sm px-4 md:px-12 lg:px-16 py-2 flex justify-between items-center font-[Outfit]">
        <div className="space-x-8 text-[15px] hidden md:flex">
          <Link to="/store-location" className="hover:text-[#F7941D]">Support@bharatronix.com</Link>
          {/* <Link to="/services" className="hover:text-[#F7941D]">Services</Link>
          <Link to="/gift-cards" className="hover:text-[#F7941D]">Gift Cards</Link> */}
          <Link to="#" className="hover:text-[#F7941D]">+91 79827 48787</Link>
        </div>
        <div className="hidden lg:flex items-center text-[15px] gap-2">
          <FaBolt className="text-[#F7941D] w-5 h-5" />
          <span>24 hours Express delivery</span>
        </div>
        {/* <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <FaGlobeAmericas />
            <FaChevronDown />
          </div>
          <div className="flex items-center gap-1">
            <span>USD</span>
            <FaChevronDown />
          </div>
        </div> */}
        <div className=" flex flex-wrap   gap-4 items-center ">
           <Link to="#" className="text-white  ">
            <img src={icon5} alt="Instagram" className="w-6 h-6" />
          </Link>
          <Link to="#" className="text-white  ">
            <img src={icon3} alt="Facebook" className="w-6 h-6" />
          </Link>
          <Link to="#" className="text-white  ">
            <img src={icon6} alt="YouTube" className="w-6 h-6" />
          </Link>
          <Link to="#" className="text-white  ">
            <img src={icon4} alt="Twitter" className="w-6 h-6" />
          </Link>
         

         
        </div>
      </div>

      {/* Main Navbar */}
      <div className="font-inter bg-white border-b shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between lg:px-16 md:px-12">
          {/* Logo and Location Section */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 w-38 md:w-40">
              <img src={logo} alt="Logo" className="w-full" />
            </Link>

            {/* Location Selector */}
            <div className="relative hidden lg:block">
              <div
                onClick={() => setShowLocationDropdown((prev) => !prev)}
                className="cursor-pointer flex items-start gap-2"
              >
                <img src={location1} className="w-6 h-6 mt-1" alt="Location" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-semibold text-[#F7941D]">
                      {location}
                    </span>
                    <FaChevronDown className="text-blue-900 text-xs" />
                  </div>
                  <span className="text-[12px] leading-0 text-[#1E3473]">
                    Delivery in 60 Min
                  </span>
                </div>
              </div>

              {showLocationDropdown && (
                <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-200 shadow-md rounded-md">
                  {locations.map((loc) => (
                    <div
                      key={loc}
                      onClick={() => handleLocationSelect(loc)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar Section */}
          <div className="hidden lg:flex flex-1 items-center justify-center max-w-[650px] w-full mx-4">
            {/* Search Bar and Voice Button Container */}
            <div className="flex items-center gap-2 w-full">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex items-center flex-1 justify-between bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Search by name, category, brand..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="submit"
                  className="bg-[#F7941D] w-7 h-7 rounded-full flex items-center justify-center"
                >
                  <FaSearch size={15} className="text-white" />
                </button>
              </form>

              {/* Voice Search Button */}
              <button
                type="button"
                className={`relative bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors ${isListening ? 'ring-2 ring-[#F7941D]' : ''}`}
                onClick={startVoiceSearch}
              >
                <FaMicrophone className={`h-5 w-5 ${isListening ? 'text-[#F7941D]' : 'text-gray-600'}`} />
                
                {/* Listening Animation */}
                {isListening && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-full h-full rounded-full animate-ping bg-[#F7941D] opacity-20"></div>
                    <div className="absolute w-3/4 h-3/4 rounded-full animate-ping bg-[#F7941D] opacity-10 delay-150"></div>
                    <div className="absolute w-1/2 h-1/2 rounded-full animate-ping bg-[#F7941D] opacity-5 delay-300"></div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center space-x-4">
              {/* Shopping Bag Icon */}
              <div
                className="bg-gray-100 p-3 rounded-full relative cursor-pointer"
                onClick={() => navigate('/cart')}
              >
                <img src={icon1} className="w-5 h-5" alt="Cart" />
                {uniqueItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F7941D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {uniqueItems}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-300"></div>

              {/* User Icon or Auth Buttons */}
              {user ? (
                <div className="relative">
                  <div
                    className="bg-gray-100 p-3 rounded-full cursor-pointer"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <img src={icon2} className="w-5 h-5" alt="User" />
                  </div>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowProfileDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          localStorage.removeItem('token');
                          setUser(null);
                          window.location.href = '/';
                          setShowProfileDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-medium bg-[#1E3473] text-white rounded-full hover:bg-[#F7941D] cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-4 py-2 text-sm font-medium bg-[#1E3473] text-white rounded-full hover:bg-[#F7941D] cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
            <div className="lg:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="bg-white hidden md:flex md:justify-between md:items-center">
          <div className="px-4 py-1 flex items-center space-x-4 text-sm font-medium whitespace-nowrap lg:px-16 md:px-12">
            <Link to="/" className="hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full">
              HOME
            </Link>
            <Link to="/product" className="text-gray-700 hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full">
              All Products
            </Link>
            <div className="relative group">
              <Link to="/product" className="text-gray-700 hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full flex items-center gap-1">
                All Categories
                <FaChevronDown className="text-xs" />
              </Link>
              
              {/* Categories Dropdown */}
              <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-[800px] flex">
                {/* Left Side - Category List */}
                <div className="grid grid-cols-3 gap-4 p-6 w-full">
                  {Object.keys(categories).map((category, index) => (
                    <Link
                      key={index}
                      to={`/allproducts?category=${category}`}
                      className="group"
                    >
                      <div className="bg-[#F5F5F5] border-1 border-[#E0E0E0] rounded-2xl shadow px-3 flex flex-col md:flex-row items-center justify-between hover:shadow-lg transition-shadow duration-300">
                        <div>
                          <h2 className="text-base font-semibold text-blue-900 group-hover:text-[#F7941D] transition-colors duration-300">
                            {category}
                          </h2>
                          <p className="text-[10px] text-gray-500">
                            {category === "Development Board" && "Arduino, ESP32, RPi"}
                            {category === "Sensors" && "Temperature, Pressure, Motion"}
                            {category === "Motors and Drivers" && "DC, Stepper, Servo"}
                            {category === "Battery" && "LiPo, Li-ion, NiMH"}
                            {category === "3D Printer" && "Parts & Accessories"}
                            {category === "Drone Parts" && "ESC, Flight Controllers, Props"}
                          </p>
                        </div>
                        <div className="pl-4">
                          <img
                            src={categoryImages[category]}
                            alt={category}
                            className="w-20 h-20 object-cover mb-2"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {navItems.map((item) => (
              <div className="relative" key={item.key}>
                <button
                  onClick={() => toggleDropdown(item.key)}
                  className="flex items-center gap-1 text-gray-700 hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full"
                >
                  {item.name}
                  <IoMdArrowDropdown />
                </button>
                {openDropdown === item.key && (
                  <div className="absolute top-10 left-0 bg-white shadow-lg rounded-md py-2 w-40 z-50">
                    {item.items.map((subItem, idx) => (
                      <Link
                        to={item.links[idx]}
                        key={idx}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setOpenDropdown("")}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link to="/b2bpage" className="text-gray-700 hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full">
              B2B Enquiry
            </Link>
          </div>
          <div className="flex px-4 lg:px-16 md:px-12">
            <Link 
              to="/track-order" 
              className="text-gray-700 hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full transition-colors duration-300"
            >
              Track Order
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 py-4 space-y-3 text-sm bg-white shadow-md">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search by name, category, brand..."
                className="w-full border border-gray-300 px-3 py-2 rounded-l-md"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
              />
              <button
                type="submit"
                className="bg-[#F7941D] px-3 py-2 rounded-r-md text-white"
              >
                <FaSearch size={15} />
              </button>
            </form>
            <Link to="/" className="block py-2 hover:text-[#F7941D]">
              HOME
            </Link>
            {navItems.map((item) => (
              <div key={item.key} className="py-1">
                <p className="font-semibold text-gray-700">{item.name}</p>
                {item.items.map((subItem, idx) => (
                  <Link
                    to={item.links[idx]}
                    key={idx}
                    className="block pl-4 py-1 text-gray-600 hover:text-[#F7941D]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {subItem}
                  </Link>
                ))}
              </div>
            ))}
            <Link to="/pcb" className="block py-2 hover:text-[#F7941D]">
              PCB
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
