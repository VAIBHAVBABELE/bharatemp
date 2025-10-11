import { useState, useEffect } from "react";
import { FaSearch, FaBars, FaTimes, FaHome, FaShoppingBag, FaUser, FaMicrophone } from "react-icons/fa";
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
  const { uniqueItems } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const currentLocation = useLocation();

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

  // Products now come from context

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
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
        }, 500);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        // console.error("Speech recognition error:", event.error);
      };

      recognition.start();
    } else {
      alert("Voice search is not supported in this browser");
    }
  };

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
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Bharatronix" className="h-8 w-auto" />
          </Link>

          {/* Cart Icon */}
          <div className="relative" onClick={() => navigate("/cart")}>
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
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white w-80 h-full shadow-lg">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              <Link
                to="/"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHome className="text-[#F7941D]" />
                <span>Home</span>
              </Link>

              <Link
                to="/product"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShoppingBag className="text-[#F7941D]" />
                <span>All Products</span>
              </Link>

              <Link
                to="/shopbybrand"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-[#F7941D]">🏷️</span>
                <span>Shop by Brands</span>
              </Link>

              <Link
                to="/b2bpage"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-[#F7941D]">🏢</span>
                <span>B2B Enquiry</span>
              </Link>

              <Link
                to="/track-order"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-[#F7941D]">📦</span>
                <span>Track Order</span>
              </Link>
            </div>

            {/* User Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser className="text-[#F7941D]" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      setUser(null);
                      setMobileMenuOpen(false);
                      window.location.href = "/";
                    }}
                    className="flex items-center gap-3 w-full p-3 text-left text-red-600 rounded-lg hover:bg-white transition-colors"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-[#1E3473] text-white rounded-lg hover:bg-[#F7941D] transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 border border-[#1E3473] text-[#1E3473] rounded-lg hover:bg-[#1E3473] hover:text-white transition-colors"
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
          <Link to="/" className="flex flex-col items-center p-2 text-gray-600 hover:text-[#F7941D] transition-colors">
            <FaHome size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link to="/product" className="flex flex-col items-center p-2 text-gray-600 hover:text-[#F7941D] transition-colors">
            <FaShoppingBag size={20} />
            <span className="text-xs mt-1">Shop</span>
          </Link>

          <Link to="/cart" className="flex flex-col items-center p-2 text-gray-600 hover:text-[#F7941D] transition-colors relative">
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

          <Link to="/profile" className="flex flex-col items-center p-2 text-gray-600 hover:text-[#F7941D] transition-colors">
            <FaUser size={20} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;