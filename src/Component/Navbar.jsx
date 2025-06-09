import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaGlobeAmericas,
  FaChevronDown,
  FaBolt,
  FaMicrophone,
  FaChevronRight
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

const subcategories = {
  "Development Board": [
    { name: "Arduino", description: "Boards & Accessories", image: "https://picsum.photos/300/200?random=1" },
    { name: "Raspberry Pi", description: "Boards & Kits", image: "https://picsum.photos/300/200?random=2" },
    { name: "ESP32", description: "WiFi & Bluetooth", image: "https://picsum.photos/300/200?random=3" },
    { name: "ESP8266", description: "IoT Development", image: "https://picsum.photos/300/200?random=4" },
    { name: "STM32", description: "ARM Controllers", image: "https://picsum.photos/300/200?random=5" },
    { name: "Teensy", description: "USB Development", image: "https://picsum.photos/300/200?random=6" },
    { name: "BeagleBone", description: "Linux Boards", image: "https://picsum.photos/300/200?random=7" },
    { name: "FPGA", description: "Programmable Logic", image: "https://picsum.photos/300/200?random=8" }
  ],
  "Sensors": [
    { name: "Temperature", description: "Heat & Cold Detection", image: "https://picsum.photos/300/200?random=11" },
    { name: "Pressure", description: "Force & Weight", image: "https://picsum.photos/300/200?random=12" },
    { name: "Motion", description: "Movement Detection", image: "https://picsum.photos/300/200?random=13" },
    { name: "Gas", description: "Air Quality", image: "https://picsum.photos/300/200?random=14" },
    { name: "Humidity", description: "Moisture Sensing", image: "https://picsum.photos/300/200?random=15" },
    { name: "Light", description: "Luminosity Detection", image: "https://picsum.photos/300/200?random=16" },
    { name: "Sound", description: "Audio Sensing", image: "https://picsum.photos/300/200?random=17" },
    { name: "Distance", description: "Range Finding", image: "https://picsum.photos/300/200?random=18" }
  ],
  "Motors and Drivers": [
    { name: "DC Motors", description: "Various Sizes", image: "https://picsum.photos/300/200?random=21" },
    { name: "Stepper Motors", description: "Precise Control", image: "https://picsum.photos/300/200?random=22" },
    { name: "Servo Motors", description: "Robotics & RC", image: "https://picsum.photos/300/200?random=23" },
    { name: "Motor Drivers", description: "Control Boards", image: "https://picsum.photos/300/200?random=24" },
    { name: "Encoders", description: "Position Feedback", image: "https://picsum.photos/300/200?random=25" },
    { name: "Gearboxes", description: "Speed Reduction", image: "https://picsum.photos/300/200?random=26" },
    { name: "Linear Actuators", description: "Linear Motion", image: "https://picsum.photos/300/200?random=27" },
    { name: "Motor Controllers", description: "Speed Control", image: "https://picsum.photos/300/200?random=28" }
  ],
  "Battery": [
    { name: "LiPo", description: "High Performance", image: "https://picsum.photos/300/200?random=31" },
    { name: "Li-ion", description: "Rechargeable", image: "https://picsum.photos/300/200?random=32" },
    { name: "NiMH", description: "Long Lasting", image: "https://picsum.photos/300/200?random=33" },
    { name: "Battery Holders", description: "Storage Solutions", image: "https://picsum.photos/300/200?random=34" },
    { name: "Chargers", description: "Smart Charging", image: "https://picsum.photos/300/200?random=35" },
    { name: "Power Banks", description: "Portable Power", image: "https://picsum.photos/300/200?random=36" },
    { name: "Battery Monitors", description: "Voltage Display", image: "https://picsum.photos/300/200?random=37" },
    { name: "Protection Circuits", description: "Safety First", image: "https://picsum.photos/300/200?random=38" }
  ],
  "3D Printer": [
    { name: "Filaments", description: "PLA, ABS & More", image: "https://picsum.photos/300/200?random=41" },
    { name: "Hot Ends", description: "Print Heads", image: "https://picsum.photos/300/200?random=42" },
    { name: "Extruders", description: "Feed Systems", image: "https://picsum.photos/300/200?random=43" },
    { name: "Control Boards", description: "Printer Brains", image: "https://picsum.photos/300/200?random=44" },
    { name: "Stepper Motors", description: "Axis Control", image: "https://picsum.photos/300/200?random=45" },
    { name: "Linear Rails", description: "Smooth Motion", image: "https://picsum.photos/300/200?random=46" },
    { name: "Build Plates", description: "Print Surfaces", image: "https://picsum.photos/300/200?random=47" },
    { name: "Nozzles", description: "Various Sizes", image: "https://picsum.photos/300/200?random=48" }
  ],
  "Drone Parts": [
    { name: "ESC", description: "Speed Controls", image: "https://picsum.photos/300/200?random=51" },
    { name: "Flight Controllers", description: "Brain Units", image: "https://picsum.photos/300/200?random=52" },
    { name: "Props", description: "Propellers", image: "https://picsum.photos/300/200?random=53" },
    { name: "Frames", description: "Drone Bodies", image: "https://picsum.photos/300/200?random=54" },
    { name: "Motors", description: "Brushless Motors", image: "https://picsum.photos/300/200?random=55" },
    { name: "Batteries", description: "Flight Power", image: "https://picsum.photos/300/200?random=56" },
    { name: "FPV Cameras", description: "Live View", image: "https://picsum.photos/300/200?random=57" },
    { name: "Radio Systems", description: "Control Link", image: "https://picsum.photos/300/200?random=58" }
  ]
};

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
  const [activeCategory, setActiveCategory] = useState("Development Board");

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
              <div className="absolute -left-[200px] right-[400px] top-full mt-1 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-[1400px] duration-300 z-50">
                <div className="w-full ">
                  <div className="flex">
                    {/* Left Side - Category List */}
                    <div className="w-1/4 bg-gray-50 p-4 border-r border-gray-200">
                      {Object.keys(categories).map((category, index) => (
                        <div
                          key={index}
                          onMouseEnter={() => setActiveCategory(category)}
                          className="flex items-center justify-between py-3 px-4 hover:bg-gray-100 rounded-lg group cursor-pointer"
                        >
                          <span className="text-gray-700 group-hover:text-[#F7941D] font-medium">{category}</span>
                          <FaChevronRight className="text-gray-400 text-xs" />
                        </div>
                      ))}
                    </div>

                    {/* Right Side - Subcategories Grid */}
                    <div className="w-3/4 p-6">
                      <div className="grid grid-cols-4 gap-4">
                        {subcategories[activeCategory]?.slice(0, 8).map((subcat, index) => (
                          <Link 
                            key={index}
                            to={`/allproducts?category=${activeCategory}&subcategory=${subcat.name.toLowerCase()}`} 
                            className="group"
                          >
                            <div className="relative overflow-hidden rounded-lg">
                              <img 
                                src={subcat.image}
                                alt={subcat.name}
                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                                <h3 className="text-white font-medium text-sm">{subcat.name}</h3>
                                <p className="text-gray-200 text-xs">{subcat.description}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link 
                        to={`/subcategories?category=${activeCategory}`}
                        className="mt-4 flex items-center justify-center py-3 px-6 bg-gray-50 hover:bg-gray-100 rounded-lg text-[#F7941D] font-medium transition-colors"
                      >
                        See All Categories
                        <FaChevronRight className="ml-2 text-xs" />
                      </Link>
                    </div>
                  </div>
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
