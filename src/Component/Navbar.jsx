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
  FaChevronRight,
} from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import location1 from "../assets/location.webp";
import { FaShoppingBag } from "react-icons/fa";
import logo from "../assets/Logo.webp";
import icon1 from "../assets/Icon1.webp";
import icon2 from "../assets/icon2.webp";
import { useCart } from "../context/CartContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { SlSocialFacebook } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import top1 from "../assets/generator.webp";
import top2 from "../assets/top1.webp";
import axios from "axios";
import trackorder from "../assets/trackorder.webp";
import search from "../assets/search.webp";
import mic from "../assets/mic.gif";
import cart from "../assets/cart.gif";
import avatar from "../assets/avatar.gif";
import truck from "../assets/truck.gif";
import pincodes from "../utils/pincode.json";
import arduino from "../assets/arduino.webp";
import stm32 from "../assets/stm32.webp";
import esp32 from "../assets/esp32.webp";
import raspberry from "../assets/raspberry.webp";
import esp8266 from "../assets/esp8266.webp";
import teensy from "../assets/teensy.webp";
import beaglebone from "../assets/beaglebone.webp";
import fpga from "../assets/fpga.webp";
import dcmotor from "../assets/dcmotor.webp";
import stepper from "../assets/stepper.webp";
import servomotor from "../assets/servo.webp";
import motordriver from "../assets/motordriver.webp";
import encoder from "../assets/encoder.webp";
import gearbox from "../assets/gearboxes.webp";
import lactuator from "../assets/lactuators.webp";
import motorc from "../assets/motorc.webp";
import temperature from "../assets/temperature.webp";
import pressure from "../assets/pressure.webp";
import gas from "../assets/gas.webp";
import humidity from "../assets/humidity.webp";
import light from "../assets/light.webp";
import sound from "../assets/sound.webp";
import distance from "../assets/distance.webp";
import lipo from "../assets/lipo.webp";
import liion from "../assets/li-ion.webp";
import nihm from "../assets/nimh.webp";
import batteryholder from "../assets/batteryholder.webp";
import charger from "../assets/charger.webp";
import powerbank from "../assets/powerbank.webp";
import batterymonitor from "../assets/batterymonitor.webp";
import printerfilament from "../assets/printerfilament.webp";
import hotend from "../assets/hotend.webp";
import extruder from "../assets/extruders.webp";
import controlboard from "../assets/controlboards.webp";
import steppermotor from "../assets/stepperm.webp";
import buildplates from "../assets/buildplates.webp";
import dbattery from "../assets/dbattery.webp";
import dmotors from "../assets/dmotors.webp";
import dronepartsesc from "../assets/dronepartsesc.webp";
import fpvs from "../assets/fpvs.webp";
import nozzals from "../assets/nozzals.webp";
import radiosystems from "../assets/radiosystem.webp";
import LinearRails from "../assets/linearrails.webp";
import frames from "../assets/frames.webp";
import props from "../assets/props.webp";
import flightcontroller from "../assets/flightcontroller.webp";
import motions from "../assets/motions.webp";
import protectionc from "../assets/protectionc.webp";


const backend = import.meta.env.VITE_BACKEND;

const subcategories = {
  "Development Board": [
    {
      name: "Arduino",
      description: "Boards & Accessories",
      image: arduino,
    },
    {
      name: "Raspberry Pi",
      description: "Boards & Kits",
      image: raspberry,
    },
    {
      name: "ESP32",
      description: "WiFi & Bluetooth",
      image: esp32,
    },
    {
      name: "ESP8266",
      description: "IoT Development",
      image: esp8266,
    },
    {
      name: "STM32",
      description: "ARM Controllers",
      image: stm32,
    },
    {
      name: "Teensy",
      description: "USB Development",
      image: teensy,
    },
    {
      name: "BeagleBone",
      description: "Linux Boards",
      image: beaglebone,
    },
    {
      name: "FPGA",
      description: "Programmable Logic",
      image: fpga,
    },
  ],
  Sensors: [
    {
      name: "Temperature",
      description: "Heat & Cold Detection",
      image: temperature,
    },
    {
      name: "Pressure",
      description: "Force & Weight",
      image: pressure,
    },
    {
      name: "Motion",
      description: "Movement Detection",
      image: motions,
    },
    {
      name: "Gas",
      description: "Air Quality",
      image: gas,
    },
    {
      name: "Humidity",
      description: "Moisture Sensing",
      image: humidity,
    },
    {
      name: "Light",
      description: "Luminosity Detection",
      image: light,
    },
    {
      name: "Sound",
      description: "Audio Sensing",
      image: sound,
    },
    {
      name: "Distance",
      description: "Range Finding",
      image: distance,
    },
  ],
  "Motors and Drivers": [
    {
      name: "DC Motors",
      description: "Various Sizes",
      image: dcmotor,
    },
    {
      name: "Stepper Motors",
      description: "Precise Control",
      image: stepper,
    },
    {
      name: "Servo Motors",
      description: "Robotics & RC",
      image: servomotor,
    },
    {
      name: "Motor Drivers",
      description: "Control Boards",
      image: motordriver,
    },
    {
      name: "Encoders",
      description: "Position Feedback",
      image: encoder,
    },
    {
      name: "Gearboxes",
      description: "Speed Reduction",
      image: gearbox,
    },
    {
      name: "Linear Actuators",
      description: "Linear Motion",
      image: lactuator,
    },
    {
      name: "Motor Controllers",
      description: "Speed Control",
      image: motorc,
    },
  ],
  Battery: [
    {
      name: "LiPo",
      description: "High Performance",
      image: lipo,
    },
    {
      name: "Li-ion",
      description: "Rechargeable",
      image: liion,
    },
    {
      name: "NiMH",
      description: "Long Lasting",
      image: nihm,
    },
    {
      name: "Battery Holders",
      description: "Storage Solutions",
      image: batteryholder,
    },
    {
      name: "Chargers",
      description: "Smart Charging",
      image: charger,
    },
    {
      name: "Power Banks",
      description: "Portable Power",
      image: powerbank,
    },
    {
      name: "Battery Monitors",
      description: "Voltage Display",
      image: batterymonitor,
    },
    {
      name: "Protection Circuits",
      description: "Safety First",
      image: protectionc,
    },
  ],
  "3D Printer": [
    {
      name: "Filaments",
      description: "PLA, ABS & More",
      image: printerfilament,
    },
    {
      name: "Hot Ends",
      description: "Print Heads",
      image: hotend,
    },
    {
      name: "Extruders",
      description: "Feed Systems",
      image: extruder,
    },
    {
      name: "Control Boards",
      description: "Printer Brains",
      image: controlboard,
    },
    {
      name: "Stepper Motors",
      description: "Axis Control",
      image: steppermotor,
    },
    {
      name: "Linear Rails",
      description: "Smooth Motion",
      image: LinearRails,
    },
    {
      name: "Build Plates",
      description: "Print Surfaces",
      image: buildplates,
    },
    {
      name: "Nozzles",
      description: "Various Sizes",
      image: nozzals,
    },
  ],
  "Drone Parts": [
    {
      name: "ESC",
      description: "Speed Controls",
      image: dronepartsesc,
    },
    {
      name: "Flight Controllers",
      description: "Brain Units",
      image: flightcontroller,
    },
    {
      name: "Props",
      description: "Propellers",
      image: props,
    },
    {
      name: "Frames",
      description: "Drone Bodies",
      image: frames,
    },
    {
      name: "Motors",
      description: "Brushless Motors",
      image: dmotors,
    },
    {
      name: "Batteries",
      description: "Flight Power",
      image: dbattery,
    },
    {
      name: "FPV Cameras",
      description: "Live View",
      image: fpvs,
    },
    {
      name: "Radio Systems",
      description: "Control Link",
      image: radiosystems,
    },
  ],
};

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [location, setLocation] = useState("Delhi, India");
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Development Board");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { uniqueItems, cartItems } = useCart();
  const [userPincode, setUserPincode] = useState('');
  const [stringForDelivery, setStringForDelivery] = useState('Delivery in 24 Hours');
  const currentLocation = useLocation();

  const getLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const foundPincode = pincodes.find((pincode) => pincode.Pincode === String(data.postal));
      if (foundPincode) {
        setStringForDelivery("Delivery in 24 Hours");
        setLocation(foundPincode.Pincode + ", " + foundPincode.City + ", " + foundPincode.state);
      } else {
        setStringForDelivery("Delivery in 24 to 72 Hours");
        setLocation(data.city);
      }
      setUserPincode(data);
    } catch (error) {
      console.error('Error fetching IP location:', error);
    }
  };

  useEffect(() => {
    getLocationByIP();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  // Extract search query from URL when page loads or changes
  useEffect(() => {
    const params = new URLSearchParams(currentLocation.search);
    const query = params.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [currentLocation]);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(`${backend}/product/list`, {
          pageNum: 1,
          pageSize: 50,
          filters: {},
        });
        if (response.data.status === "Success") {
          setProducts(response.data.data.productList);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const navItems = [
    {
      name: "Shop by brand",
      key: "catalog",
      items: ["Categories"],
      links: ["/coming-soon"],
    },
  ];

  const locations = pincodes.map((item) => `${item.Pincode}, ${item.City}, ${item.state}`);

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

  // Handle search input change with suggestions
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      const query = value.toLowerCase();

      // Get unique categories and brands that match the query
      const matchingCategories = [
        ...new Set(
          products
            .map((p) => p.category_name)
            .filter(
              (category) => category && category.toLowerCase().includes(query)
            )
        ),
      ];

      const matchingBrands = [
        ...new Set(
          products
            .map((p) => p.brand_name)
            .filter((brand) => brand && brand.toLowerCase().includes(query))
        ),
      ];

      // Create suggestions array with categories and brands first
      const categorySuggestions = matchingCategories.map((category) => ({
        type: "category",
        name: category,
        displayText: `${category}`,
      }));

      const brandSuggestions = matchingBrands.map((brand) => ({
        type: "brand",
        name: brand,
        displayText: `${brand}`,
      }));

      // Get product suggestions
      const productSuggestions = products
        .filter(
          (p) => p.product_name && p.product_name.toLowerCase().includes(query)
        )
        .slice(0, 4) // Limit to 4 product suggestions
        .map((p) => ({
          type: "product",
          name: p.product_name,
          category: p.category_name,
          brand: p.brand_name,
          id: p._id,
        }));

      // Combine all suggestions
      const allSuggestions = [
        ...categorySuggestions,
        ...brandSuggestions,
        ...productSuggestions,
      ].slice(0, 8); // Limit total suggestions to 8

      setSuggestions(allSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "product") {
      navigate(`/product/${suggestion.id}`);
    } else if (suggestion.type === "category") {
      navigate(`/product?category=${encodeURIComponent(suggestion.name)}`);
    } else if (suggestion.type === "brand") {
      navigate(`/product?brand=${encodeURIComponent(suggestion.name)}`);
    }
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdown("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".location-dropdown-container")) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown-container")) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".categories-dropdown-container")) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keypress in search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const categoryImages = {
    "Development Board": top1,
    Sensors: top2,
    "Motors and Drivers": top2,
    Battery: top2,
    "3D Printer": top2,
    "Drone Parts": top2,
  };

  const categories = {
    "Development Board": {},
    Sensors: {},
    "Motors and Drivers": {},
    Battery: {},
    "3DPrinter": {},
    "Drone Parts": {},
  };

  const startVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window) {
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
        console.error("Speech recognition error:", event.error);
        alert(
          "Sorry, there was an error with voice recognition. Please try again."
        );
      };

      recognition.start();
    } else {
      alert("Voice search is not supported in this browser");
    }
  };

  const handleSubcategoryClick = (category, subcategory) => {
    navigate(
      `/allproducts?category=${category}&subcategory=${subcategory.toLowerCase()}`
    );
    setShowCategoriesDropdown(false);
  };

  return (
    <>
      {/* Top Blue Bar */}
      <div className="bg-[#1E3473] text-white text-sm px-4 md:px-12 lg:px-16 py-2 flex justify-between items-center font-[Outfit]">
        <div className="space-x-8 text-[15px] hidden md:flex">
          <a
            href="https://mail.google.com/mail/?extsrc=mailto&url=mailto%3Asupport%40bharatronix.com%3Fsubject%3DSupport%2520Request%26body%3DHello%2520Bharatronix%2520Team%252C%250A%250AI%2527d%2520like%2520to%2520request%2520support%2520regarding%253A%250A%250A%250AThanks%252C%250A%255BYour%2520Name%255D"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F7941D]"
          >
            Support@bharatronix.com
          </a>
          {/* <Link to="/services" className="hover:text-[#F7941D]">Services</Link>
          <Link to="/gift-cards" className="hover:text-[#F7941D]">Gift Cards</Link> */}
          <Link to="tel:+917982748787" className="hover:text-[#F7941D]">
            +91 79827 48787
          </Link>
        </div>
        <div className="hidden lg:flex items-center text-[15px] gap-2">
          <FaBolt className="text-[#F7941D] w-5 h-5 rotate-20" />
          <span>24 hours Express delivery</span>
        </div>

        <div className=" flex flex-wrap pl-40 gap-4 items-center ">
          <Link to="https://www.instagram.com/bharatronix/?hl=en" className="text-white  ">
            <FaInstagram alt="Instagram" className="w-6 h-6" />
          </Link>
          <Link to="#" className="text-white  ">
            <SlSocialFacebook alt=" Facebook" className="w-6 h-6" />
          </Link>
          <Link to="https://www.youtube.com/@BharatroniX2024" className="text-white  ">
            <FiYoutube alt=" Facebook" className="w-6 h-6" />
          </Link>
          <Link to="https://x.com/bharatroni68370" className="text-white  ">
            <FaXTwitter alt="Twitter" className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="font-inter bg-white border-b shadow-sm">
        <div className="px-4 py-1 flex items-center justify-between lg:px-16 md:px-12">
          {/* Logo and Location Section */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 w-56 md:w-48">
              <img src={logo} alt="Logo" className="w-80 h-16" />
            </Link>

            {/* Location Selector */}
            <div className="relative hidden lg:block location-dropdown-container">
              <div
                onClick={() => setShowLocationDropdown((prev) => !prev)}
                className="cursor-pointer flex items-start gap-2"
              >
                <img src={location1} className="w-6 h-6 mt-1" alt="Location" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-semibold text-[#F7941D]">
                      {location}
                    </span>
                    <FaChevronDown className="text-blue-900 text-xs" />
                  </div>
                  <span className="text-[12px] leading-0 text-[#1E3473]">
                    {stringForDelivery}
                  </span>
                </div>
              </div>

              {showLocationDropdown && (
                <div className="absolute z-40 mt-2 w-80 bg-white border border-gray-200 shadow-md rounded-md max-h-[400px] overflow-y-auto">
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
              {/* Search Bar with Suggestions */}
              <div className="relative flex-1 search-container">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center border border-gray-300 flex-1 justify-between  rounded-full px-4 py-2"
                >
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
                    className=" w-7 h-7 rounded-full flex items-center justify-center"
                  >
                    <img src={search} alt="Search" className="w-7 h-7" />
                  </button>
                </form>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{suggestion.icon}</span>
                          <div className="flex flex-col">
                            {suggestion.type === "product" ? (
                              <>
                                <span className="text-gray-900 font-medium">
                                  {suggestion.name}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  {suggestion.category && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      {suggestion.category}
                                    </span>
                                  )}
                                  {suggestion.brand && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                      {suggestion.brand}
                                    </span>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-900 font-medium">
                                  {suggestion.displayText}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {suggestion.type === "category"
                                    ? "Category"
                                    : "Brand"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Search Button */}
              <button
                type="button"
                className={`relative border cursor-pointer border-gray-300 w-9 h-9 rounded-full flex items-center justify-center  transition-colors ${isListening ? "ring-2 ring-[#F7941D]" : ""
                  }`}
                onClick={startVoiceSearch}
              >
                <img src={mic} alt="Mic" className="w-7 h-7" />
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
                className="relative border border-gray-300 rounded-3xl p-2 cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <img src={cart} className="w-7 h-7" alt="Cart" />
                {uniqueItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F7941D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {uniqueItems}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="w-[2px] h-6 bg-gray-300"></div>

              {/* User Icon or Auth Buttons */}
              {user ? (
                <div className="relative border border-gray-300 rounded-3xl p-2 cursor-pointer profile-dropdown-container">
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <img src={avatar} className="w-7 h-7" alt="User" />
                  </div>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileDropdown(false);
                        }}
                        className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          setUser(null);
                          window.location.href = "/";
                          setShowProfileDropdown(false);
                        }}
                        className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 text-sm font-medium bg-[#1E3473] text-white rounded-full hover:bg-[#F7941D] cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 text-sm font-medium bg-[#1E3473] text-white rounded-full hover:bg-[#F7941D] cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="bg-white hidden md:flex md:justify-between md:items-center">
          <div className="px-4  flex items-center space-x-4 text-sm font-medium whitespace-nowrap lg:px-16 md:px-12">
            <Link
              to="/"
              className="hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full"
            >
              HOME
            </Link>
            {/* <Link to="/product" className="text-gray-700 hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full">
              All Products
            </Link> */}
            <div
              className="relative group categories-dropdown-container"
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <Link
                to="/product"
                className="text-gray-700 hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full flex items-center gap-1"
              >
                All Categories
                <FaChevronDown className="text-xs" />
              </Link>

              {/* Categories Dropdown */}
              {showCategoriesDropdown && (
                <div className="fixed left-0 right-0 top-[var(--navbar-height)] mt-0 bg-white shadow-lg w-screen z-50">
                  <div className="max-w-[2000px] mx-auto px-4">
                    <div className="flex">
                      {/* Left Side - Category List */}
                      <div className="w-1/4 bg-gray-50 p-4 border-r border-gray-200">
                        {Object.keys(categories).map((category, index) => (
                          <div
                            key={index}
                            onMouseEnter={() => setActiveCategory(category)}
                            className="flex items-center justify-between py-3 px-4 hover:bg-gray-100 rounded-lg group cursor-pointer"
                          >
                            <span className="text-gray-700 group-hover:text-[#F7941D] font-medium">
                              {category}
                            </span>
                            <FaChevronRight className="text-gray-400 text-xs" />
                          </div>
                        ))}
                      </div>

                      {/* Right Side - Subcategories Grid */}
                      <div className="w-3/4 p-6">
                        <div className="grid grid-cols-4 gap-4">
                          {subcategories[activeCategory]
                            ?.slice(0, 8)
                            .map((subcat, index) => (
                              <div
                                key={index}
                                onClick={() =>
                                  handleSubcategoryClick(
                                    activeCategory,
                                    subcat.name
                                  )
                                }
                                className="group cursor-pointer"
                              >
                                <div className="relative overflow-hidden rounded-lg border border-gray-200">
                                  <img
                                    src={subcat.image}
                                    alt={subcat.name}
                                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                                    <h3 className="text-white font-medium text-sm">
                                      {subcat.name}
                                    </h3>
                                    <p className="text-gray-200 text-xs">
                                      {subcat.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div
                          onClick={() => {
                            navigate(
                              `/product?category=${activeCategory}`
                            );
                            setShowCategoriesDropdown(false);
                          }}
                          className="mt-4 flex items-center justify-center py-3 px-6 bg-gray-50 hover:bg-gray-100 rounded-lg text-[#F7941D] font-medium transition-colors cursor-pointer"
                        >
                          See All Categories
                          <FaChevronRight className="ml-2 text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative dropdown-container">
              <Link
                to={'/coming-soon'}
                className="flex items-center gap-1 text-gray-700 hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full"
              >
                Shop By Brands
              </Link>
            </div>
            <Link
              to="/b2bpage"
              className="text-gray-700 hover:text-white hover:bg-blue-900 px-3 py-1 rounded-full"
            >
              B2B Enquiry
            </Link>
          </div>
          <div className="flex pr-4 lg:pr-16 md:pr-8">
            <Link
              to="/track-order"
              className=" text-blue-900 px-3 py-1 flex items-center rounded-full gap-3 transition-colors duration-300"
            >
              <img src={truck} alt="Logo" className="w-10 h-10 " /> Track
              Order
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 space-y-3 text-sm bg-white shadow-md">
            {/* Mobile Search Bar Section */}
            <div className="flex items-center gap-2 w-full">
              {/* Search Bar with Suggestions */}
              <div className="relative flex-1 search-container">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center flex-1 justify-between bg-gray-100 rounded-full px-4 py-2"
                >
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

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{suggestion.icon}</span>
                          <div className="flex flex-col">
                            {suggestion.type === "product" ? (
                              <>
                                <span className="text-gray-900 font-medium">
                                  {suggestion.name}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  {suggestion.category && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      {suggestion.category}
                                    </span>
                                  )}
                                  {suggestion.brand && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                      {suggestion.brand}
                                    </span>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-900 font-medium">
                                  {suggestion.displayText}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {suggestion.type === "category"
                                    ? "Category"
                                    : "Brand"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Search Button */}
              <button
                type="button"
                className={`relative bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors ${isListening ? "ring-2 ring-[#F7941D]" : ""
                  }`}
                onClick={startVoiceSearch}
              >
                <FaMicrophone
                  className={`h-5 w-5 ${isListening ? "text-[#F7941D]" : "text-gray-600"
                    }`}
                />
                {isListening && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-full h-full rounded-full animate-ping bg-[#F7941D] opacity-20"></div>
                    <div className="absolute w-3/4 h-3/4 rounded-full animate-ping bg-[#F7941D] opacity-10 delay-150"></div>
                    <div className="absolute w-1/2 h-1/2 rounded-full animate-ping bg-[#F7941D] opacity-5 delay-300"></div>
                  </div>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-2 items-center text-center">
              <Link
                to="/"
                className="block py-2 font-bold hover:text-[#F7941D]"
              >
                HOME
              </Link>
              {/* <Link to="/product" className="block py-2 text-gray-600 hover:text-[#F7941D]">
              All Products
            </Link> */}
              {navItems.map((item) => (
                <div key={item.key} className="py-1">
                  <p className="font-semibold text-gray-700">{item.name}</p>
                  {item.items.map((subItem, idx) => (
                    <Link
                      to={item.links[idx]}
                      key={idx}
                      className="block py-1 text-gray-600 hover:text-[#F7941D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {subItem}
                    </Link>
                  ))}
                </div>
              ))}
              {/* <Link to="/pcb" className="block py-2 hover:text-[#F7941D]">
              PCB
            </Link> */}
              <Link
                to="/b2bpage"
                className="block py-2 text-gray-600 hover:text-[#F7941D]"
              >
                B2B Enquiry
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
