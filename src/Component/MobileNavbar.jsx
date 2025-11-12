import { useState, useEffect } from "react";
import { FaSearch, FaBars, FaTimes, FaHome, FaShoppingBag, FaUser, FaMicrophone, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useDebounce } from "../hooks/useDebounce";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import logo from "../assets/Logo.webp";
import mic from "../assets/mic.gif";

const backend = import.meta.env.VITE_BACKEND;

const MobileNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Development Board");
  
  const { uniqueItems } = useCart();
  const { products, categories } = useProducts();
  const navigate = useNavigate();
  const currentLocation = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setMobileMenuOpen(false); // Close menu after search
    }
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle debounced search suggestions
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      const matchingProducts = products
        .filter(p => p.product_name && p.product_name.toLowerCase().includes(query))
        .slice(0, 5)
        .map(p => ({
          type: "product",
          name: p.product_name,
          id: p._id,
        }));
      setSuggestions(matchingProducts);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchQuery, products]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "product") {
      navigate(`/product/${suggestion.id}`);
    }
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    setMobileMenuOpen(false); // Close menu after suggestion click
  };

  // Voice search
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
        setTimeout(() => {
          navigate(`/product?search=${encodeURIComponent(transcript.trim())}`);
          setMobileMenuOpen(false); // Close menu after voice search
        }, 500);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Voice search is not supported in this browser");
    }
  };

  // Categories handlers
  const handleSubcategoryClick = (category, subcategory) => {
    navigate(
      `/allproducts?category=${category}&subcategory=${subcategory.toLowerCase()}`
    );
    setShowCategoriesDropdown(false);
    setMobileMenuOpen(false); // Close menu after subcategory click
    // Scroll to top after navigation
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (category) => {
    navigate(`/product?category=${encodeURIComponent(category)}`);
    setShowCategoriesDropdown(false);
    setMobileMenuOpen(false); // Close menu after category click
    // Scroll to top after navigation
    window.scrollTo(0, 0);
  };

  // Close categories when mobile menu closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      setShowCategoriesDropdown(false);
    }
  }, [mobileMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentLocation]);

  return (
    <>
      {/* Mobile App Header */}
      <div className="md:hidden bg-white shadow-sm border-b sticky top-0 z-50">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
            onClick={() => setMobileMenuOpen(false)} // Close menu on logo click
          >
            <img src={logo} alt="Bharatronix" className="h-10 w-auto" />
          </Link>

          {/* Cart Icon */}
          <div 
            className="relative" 
            onClick={() => {
              navigate("/cart");
              setMobileMenuOpen(false); // Close menu on cart click
            }}
          >
            <FaShoppingBag size={20} className="text-gray-700" />
            {uniqueItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F7941D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {uniqueItems}
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#F7941D] transition-colors pr-12"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaSearch className="text-gray-400" />
                </button>
                
                {/* Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <span className="font-medium text-gray-900 text-sm">
                          {suggestion.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Voice Search Button */}
              <button
                type="button"
                onClick={startVoiceSearch}
                className={`relative bg-gray-50 border border-gray-200 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors ${
                  isListening ? "ring-2 ring-[#F7941D] bg-orange-50" : ""
                }`}
              >
                <img src={mic} alt="Voice Search" className="w-6 h-6" />
                {isListening && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-full h-full rounded-full animate-ping bg-[#F7941D] opacity-20"></div>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Bharatronix" className="h-8 w-auto" />
                <span className="text-lg font-bold text-[#1E3473]">BharatroniX</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Menu Items with Scroll */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-10 space-y-1">
                
                {/* All Categories Dropdown */}
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <div
                    onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-blue-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <span className="text-xl">📂</span>
                      </div>
                      <span className="text-gray-800 font-medium">All Categories</span>
                    </div>
                    <FaChevronDown 
                      className={`text-gray-400 transition-transform duration-300 ${
                        showCategoriesDropdown ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>

                  {/* Categories Dropdown Content */}
                  {showCategoriesDropdown && (
                    <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {/* Category List */}
                      <div className="p-3 border-b border-gray-200 bg-gray-50 max-h-40 overflow-y-auto">
                        {Object.keys(categories).map((category, index) => (
                          <div
                            key={index}
                            onClick={() => setActiveCategory(category)}
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

                      {/* Subcategories Grid */}
                      <div className="p-4 max-h-60 overflow-y-auto">
                        {activeCategory &&
                        categories[activeCategory] &&
                        categories[activeCategory].length > 0 ? (
                          <>
                            <h3 className="mb-3 text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                              {activeCategory}
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              {categories[activeCategory]
                                .slice(0, 6)
                                .map((subcat, index) => (
                                  <div
                                    key={index}
                                    onClick={() =>
                                      handleSubcategoryClick(
                                        activeCategory,
                                        subcat.name
                                      )
                                    }
                                    className="cursor-pointer group transition-all duration-200"
                                  >
                                    <div className="relative overflow-hidden border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                      {subcat.image ? (
                                        <img
                                          src={subcat.image}
                                          alt={subcat.name}
                                          className="object-cover w-full h-20 transition-transform duration-300 group-hover:scale-105"
                                          onError={(e) => {
                                            e.target.src =
                                              "https://via.placeholder.com/300x200?text=No+Image";
                                          }}
                                        />
                                      ) : (
                                        <div className="flex items-center justify-center w-full h-20 bg-gray-100">
                                          <span className="text-xs text-gray-400">
                                            No Image
                                          </span>
                                        </div>
                                      )}
                                      <div className="p-2 bg-white">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-[#F7941D] transition-colors text-xs">
                                          {subcat.name}
                                        </h3>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                            <div
                              onClick={() => {
                                handleCategoryClick(activeCategory);
                              }}
                              className="mt-4 flex items-center justify-center py-2 px-4 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-800 font-semibold transition-colors cursor-pointer border border-blue-200 hover:border-blue-300 text-sm"
                            >
                              View All {activeCategory} Products
                              <FaChevronRight className="ml-2 text-xs" />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-32">
                            <div className="text-2xl text-gray-300 mb-2">
                              🔍
                            </div>
                            <p className="text-gray-600 text-sm mb-1 font-medium">
                              {activeCategory
                                ? "No subcategories available"
                                : "Select a category"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Other Menu Items */}
                <Link
                  to="/shopbybrand"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                    <span className="text-xl">🏷️</span>
                  </div>
                  <span className="text-gray-800 font-medium">Shop by Brands</span>
                </Link>

                <Link
                  to="/b2bpage"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-xl">🏢</span>
                  </div>
                  <span className="text-gray-800 font-medium">B2B Enquiry</span>
                </Link>

                <Link
                  to="/track-order"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-xl">📦</span>
                  </div>
                  <span className="text-gray-800 font-medium">Track Order</span>
                </Link>
              </div>
            </div>

            {/* User Section */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white transition-colors group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <FaUser className="text-purple-600" size={16} />
                    </div>
                    <span className="text-gray-800 font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      setUser(null);
                      setMobileMenuOpen(false);
                      window.location.href = "/";
                    }}
                    className="flex items-center gap-4 w-full p-4 text-left rounded-xl hover:bg-red-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <span className="text-xl">🚪</span>
                    </div>
                    <span className="text-red-600 font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 bg-[#1E3473] text-white rounded-xl hover:bg-[#F7941D] transition-colors font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 border-2 border-[#1E3473] text-[#1E3473] rounded-xl hover:bg-[#1E3473] hover:text-white transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="flex items-center justify-around py-2">
          <Link 
            to="/" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-[#F7941D] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaHome size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <div 
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-[#F7941D] transition-colors cursor-pointer"
          >
            <FaShoppingBag size={20} />
            <span className="text-xs mt-1">Categories</span>
          </div>

          <Link 
            to="/cart" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-[#F7941D] transition-colors relative"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative">
              <FaShoppingBag size={20} />
              {uniqueItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F7941D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {uniqueItems}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">Cart</span>
          </Link>

          <Link 
            to="/profile" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-[#F7941D] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaUser size={20} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;