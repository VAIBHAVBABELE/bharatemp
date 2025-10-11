import { useState, useEffect, useCallback, useRef } from "react";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaBolt,
  FaMicrophone,
  FaChevronRight,
  FaCrosshairs,
} from "react-icons/fa";

import location1 from "../assets/location.webp";

import logo from "../assets/Logo.webp";

import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { SlSocialFacebook } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import axios from "axios";
import search from "../assets/search.webp";
import mic from "../assets/mic.gif";
import cart from "../assets/cart.gif";
import avatar from "../assets/avatar.gif";
import truck from "../assets/truck.gif";
import pincodes from "../utils/pincode.json";
import {
  searchLocations,
  getCurrentLocation as getCurrentLocationService,
  formatLocationString,
} from "../utils/locationService";
import { calculateDeliveryTime } from "../utils/deliveryService";


const backend = import.meta.env.VITE_BACKEND;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [location, setLocation] = useState("Detecting...");
  const [stringForDelivery, setStringForDelivery] = useState("");
  const [_userPincode, setUserPincode] = useState("");
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Development Board");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  // Products now come from context
  const navigate = useNavigate();
  const { uniqueItems } = useCart();
  const { products, categories } = useProducts();
  const currentLocation = useLocation();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [user, setUser] = useState(null);
  const categoriesTimeoutRef = useRef(null); // For 5-second delay

  // Helper to check if pincode exists
  const isPincodeAvailable = (zipcode) => {
    return pincodes.some((p) => String(p.Pincode) === String(zipcode));
  };

  // Get location by browser geolocation
  const fetchLocationAndDelivery = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserCoordinates({ latitude, longitude });

          // Use a reverse geocoding API to get address from coordinates
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const zipcode =
              data.address.postcode ||
              data.address.pincode ||
              data.address.zip ||
              "";

            const city = data.address.city || data.address.town || data.address.village || "";
            const state = data.address.state || "";
            
            setLocation(`${zipcode}, ${city}, ${state}`);
            setUserPincode(zipcode);
            setStringForDelivery(calculateDeliveryTime(city, state));
          } catch (err) {
            setLocation("Location not found");
            setStringForDelivery("");
            throw err;
          }
        },
        (err) => {
          setLocation("Location not found");
          setStringForDelivery("");
          throw err;
        }
      );
    } else {
      setLocation("Geolocation not supported");
      setStringForDelivery("");
    }
  }, []);

  // Categories now come from context

  const getLocationByIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const foundPincode = pincodes.find(
        (pincode) => pincode.Pincode === String(data.postal)
      );
      if (foundPincode) {
        setStringForDelivery(calculateDeliveryTime(foundPincode.City, foundPincode.state));
        setLocation(
          foundPincode.Pincode +
            ", " +
            foundPincode.City +
            ", " +
            foundPincode.state
        );
      } else {
        setStringForDelivery(calculateDeliveryTime(data.city, data.region));
        setLocation(data.city);
      }
      setUserPincode(data);
    } catch (error) {
      // console.error("Error fetching IP location:", error);
    }
  };

  // Get current location using browser geolocation
  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);

      const result = await getCurrentLocationService();

      if (result.success) {
        setStringForDelivery(result.deliveryTime);
        setLocation(formatLocationString(result));
        setUserPincode({
          postal: result.postcode,
          city: result.city,
          state: result.state,
        });
        setUserCoordinates(result.coordinates);
      } else {
        // Fallback to IP-based location
        getLocationByIP();
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      // Fallback to IP-based location
      getLocationByIP();
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Enhanced location search with coordinates
  const handleLocationSearch = async (searchTerm) => {
    try {
      const results = await searchLocations(searchTerm);

      if (results.length > 0) {
        const result = results[0]; // Use first result
        setStringForDelivery(result.deliveryTime);
        setLocation(formatLocationString(result));
        setUserPincode({
          postal: result.postcode,
          city: result.city,
          state: result.state,
        });
        setUserCoordinates(result.coordinates);
        setShowLocationDropdown(false);
      }
    } catch (error) {
      // console.error("Error searching location:", error);
    }
  };

  useEffect(() => {
    fetchLocationAndDelivery();
  }, []);

  // Categories loaded from context

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        // console.error("Error decoding token:", error);
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

  // Products now come from context

  const navItems = [
    {
      name: "Shop by brand",
      key: "catalog",
      items: ["Categories"],
      links: ["/product"],
    },
  ];

  const locations = pincodes.map(
    (item) => `${item.Pincode}, ${item.City}, ${item.state}`
  );

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
        // Clear timeout when clicking outside
        if (categoriesTimeoutRef.current) {
          clearTimeout(categoriesTimeoutRef.current);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Cleanup timeout on unmount
      if (categoriesTimeoutRef.current) {
        clearTimeout(categoriesTimeoutRef.current);
      }
    };
  }, []);

  // Handle keypress in search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // console.log(categories);

  // const categories = {
  //   "Development Board": {},
  //   Sensors: {},
  //   "Motors and Drivers": {},
  //   Battery: {},
  //   "3DPrinter": {},
  //   "Drone Parts": {},
  // };

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
        // console.error("Speech recognition error:", event.error);
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

  // Categories dropdown hover handlers with 5-second delay
  const handleCategoriesMouseEnter = () => {
    // Clear any existing timeout
    if (categoriesTimeoutRef.current) {
      clearTimeout(categoriesTimeoutRef.current);
    }
    setShowCategoriesDropdown(true);
  };

  const handleCategoriesMouseLeave = () => {
    // Start 5-second timer
    categoriesTimeoutRef.current = setTimeout(() => {
      setShowCategoriesDropdown(false);
    }, 5000);
  };

  return (
    <>
      {/* Top Blue Bar */}
      <div className="bg-[#1E3473] text-white text-xs sm:text-sm px-2 sm:px-4 md:px-12 lg:px-16 py-2 flex justify-between items-center font-[Outfit]">
        {/* Mobile: Show only phone */}
        <div className="flex md:hidden items-center">
          <Link to="tel:+91 9403893115" className="hover:text-[#F7941D] text-xs">
            📞 +91 94038 93115
          </Link>
        </div>
        
        {/* Desktop: Show email and phone */}
        <div className="space-x-4 lg:space-x-8 text-[13px] lg:text-[15px] hidden md:flex">
          <a
            href="https://mail.google.com/mail/?extsrc=mailto&url=mailto%3Asupport%40bharatronix.com%3Fsubject%3DSupport%2520Request%26body%3DHello%2520Bharatronix%2520Team%252C%250A%250AI%2527d%2520like%2520to%2520request%2520support%2520regarding%253A%250A%250A%250AThanks%252C%250A%255BYour%2520Name%255D"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F7941D]"
          >
            Support@bharatronix.com
          </a>
          <Link to="tel:+91 9403893115" className="hover:text-[#F7941D]">
            +91 94038 93115
          </Link>
        </div>
        
        {/* Express delivery - hidden on mobile */}
        <div className="hidden lg:flex items-center text-[13px] lg:text-[15px] gap-2">
          <FaBolt className="text-[#F7941D] w-4 h-4 lg:w-5 lg:h-5 rotate-20" />
          <span>24 hours Express delivery</span>
        </div>

        {/* Social Icons - Responsive */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <Link
            to="https://www.instagram.com/bharatronix/?hl=en"
            className="text-white hover:text-[#F7941D] transition-colors"
          >
            <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </Link>
          <Link
            to="https://www.facebook.com/profile.php?id=61579174892065#"
            className="text-white hover:text-[#F7941D] transition-colors"
          >
            <SlSocialFacebook className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </Link>
          <Link
            to="https://www.youtube.com/@BharatroniX2024"
            className="text-white hover:text-[#F7941D] transition-colors"
          >
            <FiYoutube className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </Link>
          <Link to="https://x.com/bharatroni68370" className="text-white hover:text-[#F7941D] transition-colors">
            <FaXTwitter className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white border-b shadow-sm font-inter">
        <div className="flex items-center justify-between px-2 sm:px-4 py-2 lg:px-16 md:px-12">
          {/* Logo and Location Section */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[280px]" />
            </Link>

            {/* Location Selector - Hidden on mobile, show on tablet+ */}
            <div className="relative hidden md:block location-dropdown-container">
              <div
                onClick={() => setShowLocationDropdown((prev) => !prev)}
                className="flex items-start gap-2 cursor-pointer"
              >
                <img src={location1} className="w-6 h-6 mt-1" alt="Location" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-semibold text-[#F7941D]">
                      {isGettingLocation ? "Getting location..." : location}
                    </span>
                    <FaChevronDown className="text-xs text-blue-900" />
                  </div>
                  <span className="text-[12px] leading-0 text-[#1E3473]">
                    {stringForDelivery}
                  </span>
                </div>
              </div>

              {showLocationDropdown && (
                <div className="absolute z-40 mt-2 w-96 bg-white border border-gray-200 shadow-md rounded-md max-h-[500px] overflow-y-auto">
                  {/* Current Location Button */}
                  <div className="p-3 border-b border-gray-200">
                    <button
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex items-center w-full gap-2 px-3 py-2 font-medium text-blue-700 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <FaCrosshairs className="w-4 h-4" />
                      {isGettingLocation
                        ? "Getting location..."
                        : "Use my current location"}
                    </button>
                  </div>

                  {/* Location Search */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search location or enter coordinates (e.g., 28.6139, 77.2090)"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleLocationSearch(e.target.value);
                          }
                        }}
                      />
                      <button
                        onClick={(e) =>
                          handleLocationSearch(
                            e.target.previousElementSibling.value
                          )
                        }
                        className="px-3 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-[#e6851a] transition-colors"
                      >
                        <FaSearch className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Current Coordinates Display */}
                  {userCoordinates && (
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <div className="mb-1 text-xs text-gray-600">
                        Current Coordinates:
                      </div>
                      <div className="font-mono text-sm">
                        {userCoordinates.latitude.toFixed(6)},{" "}
                        {userCoordinates.longitude.toFixed(6)}
                      </div>
                    </div>
                  )}

                  {/* Popular Locations */}
                  <div className="p-3">
                    <div className="mb-2 text-sm font-medium text-gray-700">
                      Popular Locations:
                    </div>
                    {locations.slice(0, 10).map((loc) => (
                      <div
                        key={loc}
                        onClick={() => handleLocationSelect(loc)}
                        className="px-3 py-2 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar Section */}
          <div className="hidden lg:flex flex-1 items-center justify-center max-w-[650px] w-full mx-4">
            {/* Search Bar and Voice Button Container */}
            <div className="flex items-center w-full gap-2">
              {/* Search Bar with Suggestions */}
              <div className="relative flex-1 search-container">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center justify-between flex-1 px-4 py-2 border border-gray-300 rounded-full"
                >
                  <input
                    type="text"
                    placeholder="Search by name, category, brand..."
                    className="flex-1 text-sm bg-transparent outline-none"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center rounded-full w-7 h-7"
                  >
                    <img src={search} alt="Search" className="w-7 h-7" />
                  </button>
                </form>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{suggestion.icon}</span>
                          <div className="flex flex-col">
                            {suggestion.type === "product" ? (
                              <>
                                <span className="font-medium text-gray-900">
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
                                <span className="font-medium text-gray-900">
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
                className={`relative border cursor-pointer border-gray-300 w-9 h-9 rounded-full flex items-center justify-center  transition-colors ${
                  isListening ? "ring-2 ring-[#F7941D]" : ""
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
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-gray-600">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {/* Shopping Bag Icon */}
              <div
                className="relative p-1.5 sm:p-2 border border-gray-300 cursor-pointer rounded-2xl sm:rounded-3xl hover:border-[#F7941D] transition-colors"
                onClick={() => navigate("/cart")}
              >
                <img src={cart} className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" alt="Cart" />
                {uniqueItems > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-[#F7941D] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                    {uniqueItems}
                  </span>
                )}
              </div>

              {/* Divider - Hidden on mobile */}
              <div className="w-[2px] h-6 bg-gray-300 hidden sm:block"></div>

              {/* User Icon or Auth Buttons */}
              {user ? (
                <div className="relative p-1.5 sm:p-2 border border-gray-300 cursor-pointer rounded-2xl sm:rounded-3xl profile-dropdown-container hover:border-[#F7941D] transition-colors">
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <img src={avatar} className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" alt="User" />
                  </div>
                  {showProfileDropdown && (
                    <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileDropdown(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 cursor-pointer hover:bg-gray-100"
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
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 cursor-pointer hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="items-center hidden sm:flex gap-1 md:gap-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-[#1E3473] text-white rounded-full hover:bg-[#F7941D] cursor-pointer transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-[#1E3473] text-white rounded-full hover:bg-[#F7941D] cursor-pointer transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <FaTimes size={20} className="text-gray-700" /> : <FaBars size={20} className="text-gray-700" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="hidden bg-white md:flex md:justify-between md:items-center">
          <div className="flex items-center px-4 space-x-4 text-sm font-medium whitespace-nowrap lg:px-16 md:px-12">
            <Link
              to="/"
              className="px-3 py-1 rounded-full hover:text-white hover:bg-blue-900"
            >
              HOME
            </Link>

            {/* Categories Dropdown - Fixed to have only one instance */}
            <div
              className="relative group categories-dropdown-container"
              style={{ position: "static" }}
              onMouseEnter={handleCategoriesMouseEnter}
              onMouseLeave={handleCategoriesMouseLeave}
            >
              <Link
                to="/product"
                className="flex items-center gap-1 px-3 py-1 text-gray-700 rounded-full hover:text-white hover:bg-blue-900"
              >
                All Categories
                <FaChevronDown className="text-xs" />
              </Link>

              {/* Categories Dropdown */}
              {showCategoriesDropdown && (
                <div 
                  className="absolute left-0 right-0 top-full bg-white shadow-xl border-t-2 border-blue-800 z-99"
                  onMouseEnter={handleCategoriesMouseEnter}
                  onMouseLeave={handleCategoriesMouseLeave}
                >
                  <div className="max-w-[2000px] mx-auto">
                    <div className="flex">
                      {/* Left Side - Category List */}
                      <div className="w-1/4 p-3 border-r border-gray-200 bg-gray-50">
                        {Object.keys(categories).map((category, index) => (
                          <div
                            key={index}
                            onMouseEnter={() => setActiveCategory(category)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-all ${
                              activeCategory === category
                                ? "bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-800"
                                : "hover:bg-blue-100 text-gray-700 hover:text-blue-800"
                            }`}
                          >
                            <span className="text-sm">{category}</span>
                            <FaChevronRight className="text-xs text-gray-400" />
                          </div>
                        ))}
                      </div>

                      {/* Right Side - Subcategories Grid */}
                      <div className="w-3/4 p-5">
                        {activeCategory &&
                        categories[activeCategory] &&
                        categories[activeCategory].length > 0 ? (
                          <>
                            <h3 className="mb-5 text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                              {activeCategory}
                            </h3>
                            <div className="grid grid-cols-4 gap-5">
                              {categories[activeCategory]
                                .slice(0, 8)
                                .map((subcat, index) => (
                                  <div
                                    key={index}
                                    onClick={() =>
                                      handleSubcategoryClick(
                                        activeCategory,
                                        subcat.name
                                      )
                                    }
                                    className="cursor-pointer group transition-all duration-200 hover:-translate-y-0.5"
                                  >
                                    <div className="relative overflow-hidden border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                      {subcat.image ? (
                                        <img
                                          src={subcat.image}
                                          alt={subcat.name}
                                          className="object-cover w-full h-28 transition-transform duration-300 group-hover:scale-105"
                                          onError={(e) => {
                                            e.target.src =
                                              "https://via.placeholder.com/300x200?text=No+Image";
                                          }}
                                        />
                                      ) : (
                                        <div className="flex items-center justify-center w-full h-28 bg-gray-100">
                                          <span className="text-sm text-gray-400">
                                            No Image
                                          </span>
                                        </div>
                                      )}
                                      <div className="p-3 bg-white">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-[#F7941D] transition-colors text-sm">
                                          {subcat.name}
                                        </h3>
                                        {subcat.description && (
                                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                                            {subcat.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                            <div
                              onClick={() => {
                                navigate(
                                  `/product?category=${encodeURIComponent(
                                    activeCategory
                                  )}`
                                );
                                setShowCategoriesDropdown(false);
                              }}
                              className="mt-6 flex items-center justify-center py-2.5 px-5 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-800 font-semibold transition-colors cursor-pointer border border-blue-200 hover:border-blue-300"
                            >
                              View All {activeCategory} Products
                              <FaChevronRight className="ml-2 text-xs" />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-56">
                            <div className="text-4xl text-gray-300 mb-3">
                              🔍
                            </div>
                            <p className="text-gray-600 text-base mb-2 font-medium">
                              {activeCategory
                                ? "No subcategories available"
                                : "Select a category"}
                            </p>
                            <p className="text-sm text-gray-500 text-center">
                              {activeCategory
                                ? "Check back later for new products"
                                : "Hover over a category to see subcategories"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative dropdown-container">
              <Link
                to={"/shopbybrand"}
                className="flex items-center gap-1 px-3 py-1 text-gray-700 rounded-full hover:text-white hover:bg-blue-900"
              >
                Shop By Brands
              </Link>
            </div>
            <Link
              to="/b2bpage"
              className="px-3 py-1 text-gray-700 rounded-full hover:text-white hover:bg-blue-900"
            >
              B2B Enquiry
            </Link>
          </div>
          <div className="flex pr-4 lg:pr-16 md:pr-8">
            <Link
              to="/track-order"
              className="flex items-center gap-3 px-3 py-1 text-blue-900 transition-colors duration-300 rounded-full "
            >
              <img src={truck} alt="Logo" className="w-10 h-10 " /> Track Order
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="px-4 py-4 space-y-4 text-sm bg-white shadow-lg border-t md:hidden">
            {/* Mobile Search Bar Section */}
            <div className="flex items-center w-full gap-2">
              {/* Search Bar with Suggestions */}
              <div className="relative flex-1 search-container">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center justify-between flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus-within:border-[#F7941D] transition-colors"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 text-sm bg-transparent outline-none placeholder-gray-500"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="submit"
                    className="bg-[#F7941D] w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#e6851a] transition-colors"
                  >
                    <FaSearch size={14} className="text-white" />
                  </button>
                </form>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{suggestion.icon}</span>
                          <div className="flex flex-col">
                            {suggestion.type === "product" ? (
                              <>
                                <span className="font-medium text-gray-900">
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
                                <span className="font-medium text-gray-900">
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
                className={`relative bg-gray-50 border border-gray-200 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors ${
                  isListening ? "ring-2 ring-[#F7941D] bg-orange-50" : ""
                }`}
                onClick={startVoiceSearch}
              >
                <img src={mic} alt="Voice Search" className="w-6 h-6" />
                {isListening && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-full h-full rounded-full animate-ping bg-[#F7941D] opacity-20"></div>
                    <div className="absolute w-3/4 h-3/4 rounded-full animate-ping bg-[#F7941D] opacity-10 delay-150"></div>
                    <div className="absolute w-1/2 h-1/2 rounded-full animate-ping bg-[#F7941D] opacity-5 delay-300"></div>
                  </div>
                )}
              </button>
            </div>
            
            {/* Mobile Location Selector */}
            <div className="relative location-dropdown-container">
              <div
                onClick={() => setShowLocationDropdown((prev) => !prev)}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer border border-gray-200 hover:border-[#F7941D] transition-colors"
              >
                <img src={location1} className="w-5 h-5" alt="Location" />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-[#F7941D] truncate">
                      {isGettingLocation ? "Getting location..." : location}
                    </span>
                    <FaChevronDown className="text-xs text-blue-900 flex-shrink-0" />
                  </div>
                  <span className="text-xs text-[#1E3473] truncate">
                    {stringForDelivery}
                  </span>
                </div>
              </div>
              
              {/* Mobile Location Dropdown */}
              {showLocationDropdown && (
                <div className="absolute z-40 mt-2 w-full bg-white border border-gray-200 shadow-lg rounded-lg max-h-[300px] overflow-y-auto">
                  {/* Current Location Button */}
                  <div className="p-3 border-b border-gray-200">
                    <button
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex items-center w-full gap-2 px-3 py-2 font-medium text-blue-700 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <FaCrosshairs className="w-4 h-4" />
                      {isGettingLocation
                        ? "Getting location..."
                        : "Use my current location"}
                    </button>
                  </div>
                  
                  {/* Popular Locations */}
                  <div className="p-3">
                    <div className="mb-2 text-sm font-medium text-gray-700">
                      Popular Locations:
                    </div>
                    {locations.slice(0, 5).map((loc) => (
                      <div
                        key={loc}
                        onClick={() => handleLocationSelect(loc)}
                        className="px-3 py-2 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 font-semibold text-gray-800 rounded-lg hover:bg-gray-50 hover:text-[#F7941D] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏠 HOME
              </Link>
              
              <Link
                to="/product"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#F7941D] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                📦 All Categories
              </Link>
              
              <Link
                to="/shopbybrand"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#F7941D] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏷️ Shop By Brands
              </Link>
              
              <Link
                to="/b2bpage"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#F7941D] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏢 B2B Enquiry
              </Link>
              
              <Link
                to="/track-order"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#F7941D] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img src={truck} alt="Track" className="w-5 h-5" /> Track Order
              </Link>
            </div>
            
            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 px-4 py-3 text-sm font-medium bg-[#1E3473] text-white rounded-lg hover:bg-[#F7941D] transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 px-4 py-3 text-sm font-medium border border-[#1E3473] text-[#1E3473] rounded-lg hover:bg-[#1E3473] hover:text-white transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
            
            {/* Mobile User Menu */}
            {user && (
              <div className="pt-4 border-t border-gray-200 space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#F7941D] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img src={avatar} className="w-5 h-5" alt="Profile" /> Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setUser(null);
                    setMobileMenuOpen(false);
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
