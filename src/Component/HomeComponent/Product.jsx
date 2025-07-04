import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import raspberry from "../../assets/rasperrybi.svg";
import filtericon from "../../assets/filtericon.png";
import { IoFilter } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { handleBuyNow } from "../../utils/paymentUtils";
const backend = import.meta.env.VITE_BACKEND;

// Mock data for testing when API fails
const mockProducts = [
  {
    _id: 1,
    product_name: "Raspberry Pi 4",
    category_name: "Development Boards",
    brand_name: "Raspberry Pi",
    non_discounted_price: 3500,
    discounted_single_product_price: 3200,
    product_image_main: raspberry,
    product_image_sub: [raspberry],
    review_stars: 4.5,
    no_of_reviews: 120,
    featured: true,
    topRated: true,
    onSale: true,
    discount_percentage: 8,
    deliveryDate: "May 15, 2023",
    deliveryType: "Free Delivery"
  },
  {
    _id: 2,
    product_name: "Arduino Uno",
    category_name: "Development Boards",
    brand_name: "Arduino",
    non_discounted_price: 1500,
    discounted_single_product_price: 1200,
    product_image_main: raspberry,
    product_image_sub: [raspberry],
    review_stars: 4.2,
    no_of_reviews: 85,
    featured: true,
    topRated: false,
    onSale: true,
    discount_percentage: 20,
    deliveryDate: "May 16, 2023",
    deliveryType: "Free Delivery"
  },
  {
    _id: 3,
    product_name: "ESP32 Development Board",
    category_name: "Development Boards",
    brand_name: "Espressif",
    non_discounted_price: 800,
    discounted_single_product_price: 650,
    product_image_main: raspberry,
    product_image_sub: [raspberry],
    review_stars: 4.0,
    no_of_reviews: 60,
    featured: false,
    topRated: false,
    onSale: true,
    discount_percentage: 18,
    deliveryDate: "May 17, 2023",
    deliveryType: "Free Delivery"
  },
  {
    _id: 4,
    product_name: "Ultrasonic Sensor HC-SR04",
    category_name: "Sensors",
    brand_name: "Generic",
    non_discounted_price: 250,
    discounted_single_product_price: 200,
    product_image_main: raspberry,
    product_image_sub: [raspberry],
    review_stars: 3.8,
    no_of_reviews: 45,
    featured: false,
    topRated: false,
    onSale: false,
    discount_percentage: 0,
    deliveryDate: "May 18, 2023",
    deliveryType: "Standard Delivery"
  },
  {
    _id: 5,
    product_name: "Servo Motor SG90",
    category_name: "Motors",
    brand_name: "TowerPro",
    non_discounted_price: 300,
    discounted_single_product_price: 280,
    product_image_main: raspberry,
    product_image_sub: [raspberry],
    review_stars: 4.3,
    no_of_reviews: 70,
    featured: true,
    topRated: true,
    onSale: false,
    discount_percentage: 6,
    deliveryDate: "May 19, 2023",
    deliveryType: "Free Delivery"
  }
];

const Product = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeTab, setActiveTab] = useState("All");
  const [loadingBuyNow, setLoadingBuyNow] = useState({});

  const [showSidebar, setShowSidebar] = useState(false);
  const [sliderValue, setSliderValue] = useState(50000);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [priceRangeFilter, setPriceRangeFilter] = useState({
    min: 1,
    max: 50000,
  });
  const [tempPriceRange, setTempPriceRange] = useState({
    min: 1,
    max: 50000,
  }); // Temporary state for slider before Apply
  const [priceCheckboxFilters, setPriceCheckboxFilters] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);

  // Get cart functions
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const location = useLocation();

  const min = 1;
  const max = 50000;

  const navigate = useNavigate();

  // Get search query and category from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    const category = params.get('category');

    if (query) {
      setSearchQuery(query);
    } else {
      setSearchQuery("");
    }

    // If category is provided, set it in the filters
    if (category) {
      // Use the exact category name from the URL since it matches the database
      setCategoryFilters([category]);
    }
  }, [location]);

  async function fetchAllProducts() {
    try {
      setLoading(true);
      const response = await axios.post(`${backend}/product/list`, {
        pageNum: 1,
        pageSize: 50,
        filters: {},
      });
      if (response.data.status === "Success") {
        setAllProducts(response.data.data.productList);
        setTotalProducts(response.data.data.productCount);
      } else {
        // If API fails or returns no products, use mock data
        setAllProducts(mockProducts);
        setTotalProducts(mockProducts.length);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // If API call fails, use mock data
      setAllProducts(mockProducts);
      setTotalProducts(mockProducts.length);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllProducts();
  }, []);



  // Fix the order of function declarations and usage
  const tabs = ["All", "Featured", "On Sale", "Top Rated"];

  // Get category, color, and brand counts
  function getCountForCategory(category) {
    return allProducts.filter((p) => p.category_name === category).length;
  }

  function getCountForBrand(brand) {
    return allProducts.filter((p) => p.brand_name === brand).length;
  }

  function getCountForPriceRange(min, max) {
    return allProducts.filter((p) => {
      const price = p.discounted_single_product_price || p.non_discounted_price;
      if (max === Infinity) {
        return price && price >= min;
      }
      return price && price >= min && price <= max;
    }).length;
  }

  const priceRanges = [
    {
      label: "Under ₹500",
      min: 0,
      max: 499,
      count: getCountForPriceRange(0, 499),
    },
    {
      label: "₹500 - ₹999",
      min: 500,
      max: 999,
      count: getCountForPriceRange(500, 999),
    },
    {
      label: "₹1000 - ₹1999",
      min: 1000,
      max: 1999,
      count: getCountForPriceRange(1000, 1999),
    },
    {
      label: "₹2000 - ₹3999",
      min: 2000,
      max: 3999,
      count: getCountForPriceRange(2000, 3999),
    },
    {
      label: "₹4000 - ₹4999",
      min: 4000,
      max: 4999,
      count: getCountForPriceRange(4000, 4999),
    },
    {
      label: "Over ₹5000",
      min: 5000,
      max: Infinity,
      count: getCountForPriceRange(5000, Infinity),
    },
  ];

  const uniqueCategories = [...new Set(allProducts.map((p) => p.category_name))];
  const uniqueBrands = [...new Set(allProducts.map((p) => p.brand_name))];

  const categories = uniqueCategories.map((category) => ({
    label: category,
    count: getCountForCategory(category),
  }));


  const brands = uniqueBrands.map((brand) => ({
    label: brand,
    count: getCountForBrand(brand),
  }));

  // Update the filtering logic in useEffect
  useEffect(() => {
    if (allProducts.length === 0) {
      setDisplayedProducts([]);
      return;
    }

    let filtered = [...allProducts];

    // Apply search filter if there's a search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.product_name && p.product_name.toLowerCase().includes(query)) ||
          (p.category_name && p.category_name.toLowerCase().includes(query)) ||
          (p.brand_name && p.brand_name.toLowerCase().includes(query))
      );
    }

    // Filter by tab
    if (activeTab === "On Sale") {
      filtered = filtered.filter((p) => p.discount_percentage > 0);
    } else if (activeTab === "Top Rated") {
      filtered = filtered.filter((p) => p.review_stars >= 4);
    } else if (activeTab === "Featured") {
      filtered = filtered.filter((p) => p.featured === true);
    }

    // Price range slider filter
    filtered = filtered.filter((p) => {
      const price = p.discounted_single_product_price || p.non_discounted_price;
      return price >= priceRangeFilter.min && price <= priceRangeFilter.max;
    });

    // Price checkbox filters
    if (priceCheckboxFilters.length > 0) {
      const priceFiltered = [];

      priceCheckboxFilters.forEach((filterLabel) => {
        const range = priceRanges.find((r) => r.label === filterLabel);
        if (range) {
          const matchingProducts = filtered.filter((p) => {
            const price = p.discounted_single_product_price || p.non_discounted_price;
            if (!price) return false;

            if (range.max === Infinity) {
              return price >= range.min;
            }
            return price >= range.min && price <= range.max;
          });
          priceFiltered.push(...matchingProducts);
        }
      });

      if (priceFiltered.length > 0) {
        // Remove duplicates
        filtered = Array.from(new Set(priceFiltered.map(p => p._id)))
          .map(id => priceFiltered.find(p => p._id === id));
      } else {
        filtered = [];
      }
    }

    // Filter by category
    if (categoryFilters.length > 0) {
      filtered = filtered.filter((p) => categoryFilters.includes(p.category_name));
    }

    // Filter by brand
    if (brandFilters.length > 0) {
      filtered = filtered.filter((p) => brandFilters.includes(p.brand_name));
    }

    setDisplayedProducts(filtered);
  }, [allProducts, activeTab, priceRangeFilter, priceCheckboxFilters, categoryFilters, brandFilters, searchQuery]);

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setSliderValue(value);
    // Update temp price range but don't apply it yet
    setTempPriceRange({ min: min, max: value });
  };

  const handleApply = () => {
    // Now apply the temporary price range to the actual filter
    setPriceRangeFilter(tempPriceRange);
    setShowSidebar(false);
  };

  const handlePriceCheckboxChange = (label) => {
    setPriceCheckboxFilters((prev) => {
      if (prev.includes(label)) {
        return prev.filter((item) => item !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  const handleCategoryChange = (category) => {
    setCategoryFilters((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleBrandChange = (brand) => {
    setBrandFilters((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((item) => item !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const clearAllFilters = () => {
    setPriceRangeFilter({ min: min, max: max });
    setTempPriceRange({ min: min, max: max });
    setSliderValue(max);
    setPriceCheckboxFilters([]);
    setCategoryFilters([]);
    setBrandFilters([]);
  };
  const clearPriceRangeFilter = () => {
    setPriceRangeFilter({ min: min, max: max });
    setTempPriceRange({ min: min, max: max });
    setSliderValue(max);
  };

  const clearPriceCheckboxFilters = () => {
    setPriceCheckboxFilters([]);
  };

  const clearCategoryFilters = () => {
    setCategoryFilters([]);
  };

  const clearBrandFilters = () => {
    setBrandFilters([]);
  };

  // Calculate slider percentage for display
  const percentage = ((sliderValue - min) / (max - min)) * 100;

  // Calculate applied range percentage for the applied filter indicator
  const appliedPercentage = ((priceRangeFilter.max - min) / (max - min)) * 100;

  // Update the function to handle product click with the proper ID
  const handleProductClick = (product) => {
    // Navigate to the product detail page with the product ID
    navigate(`/product/${product._id}`);

    // Store the selected product in localStorage
    localStorage.setItem("selectedProduct", JSON.stringify(product));
  };

  // Add a new function to handle adding to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent click from bubbling up to the card
    addToCart(product);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const handleBuyNowClick = (e, product) => {
    e.stopPropagation(); // Prevent click from bubbling up to the card
    handleBuyNow({
      product,
      quantity: 1,
      navigate,
      setLoadingBuyNow: (loading) => {
        setLoadingBuyNow(prev => ({
          ...prev,
          [product._id]: loading
        }));
      },
      customShippingFee: 5,
    });
  };
  return (
    <>
      <ToastContainer />
      <div className="relative bg-white font-[outfit] z-20">
        {/* Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <button
            className="bg-[#1e3473] text-white p-3 rounded-full shadow-lg flex items-center justify-center"
            onClick={() => setShowSidebar(true)}
          >
            <IoFilter size={24} />
          </button>
        </div>

        {/* Overlay */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-transparent bg-opacity-40 z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <div className="w-full px-4 md:px-6 py-6 relative z-40">
          {searchQuery && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-[#1e3473] font-medium">
                  Search results for: <span className="font-bold">"{searchQuery}"</span>
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    navigate("/product");
                  }}
                  className="text-sm bg-white px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-100"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          <div className="w-full flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filter */}
            <div
              className={`
              fixed top-0 left-0 z-50 bg-white w-[300px] h-full overflow-y-auto px-2 shadow-lg transition-transform duration-300
              ${showSidebar ? "translate-x-0" : "-translate-x-full"}
              lg:static lg:translate-x-0 lg:w-[340px] lg:max-w-none lg:shadow-none lg:rounded-lg lg:h-auto lg:overflow-visible
            `}
            >
              <div className="flex justify-between items-center lg:hidden mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdClose size={24} />
                </button>
              </div>

              {/* Price Filter Slider */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Filter by Price</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-1 flex-grow bg-gray-200 rounded-full relative">
                    {/* Temp slider range - orange overlay */}
                    <div
                      className="absolute h-1 bg-[#1e3473] rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={sliderValue}
                      onChange={handleSliderChange}
                      className="absolute w-full h-1 opacity-0 cursor-pointer"
                    />
                    {/* Slider thumb */}
                    <div
                      className="absolute w-4 h-4 bg-[#1e3473] rounded-full -mt-1.5"
                      style={{
                        left: `${percentage}%`,
                        transform: "translateX(-50%)",
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">
                    Price: ₹{min} - ₹{sliderValue}
                    {priceRangeFilter.max !== sliderValue && (
                      <span className="ml-1 text-xs text-[#1e3473]">
                        {" "}
                        (not applied)
                      </span>
                    )}
                  </p>
                  <div className="flex gap-1 items-center">
                  <button
                    onClick={handleApply}
                    className={`px-4 py-1 text-xs font-medium text-white rounded-full transition shadow-sm ${priceRangeFilter.max !== sliderValue
                        ? "bg-[#f7941d] hover:bg-orange-600"
                        : "bg-[#1e3473] hover:bg-blue-800"
                      }`}
                  >
                    Apply
                  </button>
                  <button
                      onClick={clearPriceRangeFilter}
                      className="text-xs  bg-[#1e3473] text-white rounded-3xl cursor-pointer px-4 py-1 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  
                </div>
              </div>

              {/* Filter by Price Options */}
              <div className="mb-6">
                <h3 className="bg-[#1e3473] text-white px-4 py-1.5 text-sm font-medium rounded-full mb-3">
                  Filter by Price
                </h3>
                <ul className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <label className="flex items-center text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 accent-[#1e3473]"
                          checked={priceCheckboxFilters.includes(range.label)}
                          onChange={() => handlePriceCheckboxChange(range.label)}
                        />
                        {range.label}
                      </label>
                      <span className="text-[#1e3473] bg-gray-100 text-xs font-medium rounded-full px-2 py-0.5">
                        {range.count}
                      </span>
                    </li>
                  ))}
                </ul>
               
                    <button
                      onClick={clearPriceCheckboxFilters}
                      className="text-xs mt-4 bg-[#1e3473] text-white rounded-3xl cursor-pointer px-8 py-2 hover:underline"
                    >
                      Clear
                    </button>
                
              </div>

              {/* Filter by Categories */}
              <div className="mb-6">
                <h3 className="bg-[#1e3473] text-white px-4 py-1.5 text-sm font-medium rounded-full mb-3">
                  Filter by Categories
                </h3>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <label className="flex items-center text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 accent-[#1e3473]"
                          checked={categoryFilters.includes(category.label)}
                          onChange={() => handleCategoryChange(category.label)}
                        />
                        {category.label}
                      </label>
                      <span className="text-[#1e3473] bg-gray-100 text-xs font-medium rounded-full px-2 py-0.5">
                        {category.count}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                      onClick={clearCategoryFilters}
                      className="text-xs mt-4 bg-[#1e3473] text-white rounded-3xl cursor-pointer px-8 py-2 hover:underline"
                    >
                      Clear
                    </button>
              </div>

              {/* Filter by Brand */}
              <div className="mb-6">
                <h3 className="bg-[#1e3473] text-white px-4 py-1.5 text-sm font-medium rounded-full mb-3">
                  Filter by Brand
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {brands.map((brand, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 text-xs font-medium px-2 py-1.5 rounded-full"
                    >
                      <input
                        type="checkbox"
                        className="mr-1.5 h-3 w-3 accent-[#1e3473]"
                        id={`brand-${index}`}
                        checked={brandFilters.includes(brand.label)}
                        onChange={() => handleBrandChange(brand.label)}
                      />
                      <label
                        htmlFor={`brand-${index}`}
                        className="cursor-pointer truncate"
                      >
                        {brand.label}
                      </label>
                    </div>
                  ))}
                </div>
                <button
                      onClick={clearBrandFilters}
                      className="text-xs mt-4 bg-[#1e3473] text-white rounded-3xl cursor-pointer px-8 py-2 hover:underline"
                    >
                      Clear
                    </button>
              </div>
            </div>

            {/* Product Grid Section */}
            <div className=" w-full">
              <div className="border-b text-sm md:text-base lg:text-lg border-gray-300 flex items-center justify-between mb-6">
                <div className="flex space-x-4 lg:space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`font-medium cursor-pointer relative ${activeTab === tab
                          ? "text-gray-900 font-semibold"
                          : "text-gray-500"
                        }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute left-0 -bottom-0.5 w-full h-1 bg-[#f7941d] rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>
                {/* <Link
                to="/product2"
                className="text-sm text-gray-800 hover:text-gray-900 flex items-center"
              >
                View All Products <span className="ml-1">›</span>
              </Link> */}
              </div>

              {/* Product Count and Active Filters */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <p className="text-sm text-gray-600">
                  {displayedProducts.length}{" "}
                  {displayedProducts.length === 1 ? "product" : "products"} found
                </p>

                {[
                  // Add slider price range if it's not at max
                  ...(priceRangeFilter.max < max
                    ? [
                      {
                        type: "slider",
                        value: `₹${min} - ₹${priceRangeFilter.max}`,
                      },
                    ]
                    : []),
                  ...priceCheckboxFilters.map((filter) => ({
                    type: "price",
                    value: filter,
                  })),
                  ...categoryFilters.map((category) => ({
                    type: "category",
                    value: category,
                  })),
                  ...brandFilters.map((brand) => ({
                    type: "brand",
                    value: brand,
                  })),
                ].length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-2">
                      {/* Price Range Slider Tag */}
                      {priceRangeFilter.max < max && (
                        <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-1 flex items-center">
                          Price: ₹{min} - ₹{priceRangeFilter.max}
                          <button
                            className="ml-1 text-blue-600 hover:text-blue-800"
                            onClick={() => {
                              setPriceRangeFilter({ min, max });
                              setTempPriceRange({ min, max });
                              setSliderValue(max);
                            }}
                          >
                            ×
                          </button>
                        </span>
                      )}

                      {priceCheckboxFilters.map((filter) => (
                        <span
                          key={filter}
                          className="bg-gray-100 text-xs rounded-full px-2 py-1 flex items-center"
                        >
                          {filter}
                          <button
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => handlePriceCheckboxChange(filter)}
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {categoryFilters.map((category) => (
                        <span
                          key={category}
                          className="bg-gray-100 text-xs rounded-full px-2 py-1 flex items-center"
                        >
                          {category}
                          <button
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => handleCategoryChange(category)}
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {brandFilters.map((brand) => (
                        <span
                          key={brand}
                          className="bg-gray-100 text-xs rounded-full px-2 py-1 flex items-center"
                        >
                          {brand}
                          <button
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => handleBrandChange(brand)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {loading ? (

                  <div className="col-span-full flex justify-center items-center py-40">
                    <LoadingSpinner />
                  </div>
                ) : displayedProducts.length > 0 ? (
                  displayedProducts.map((product, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col h-full"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="flex justify-center mb-5">
                        <img
                          src={product.product_image_main}
                          alt={product.product_name}
                          className="w-full h-40 object-contain"
                        />
                      </div>
                      <div className="">
                        <h2 className="text-[#1e3473] font-semibold h-[84px] text-lg">
                          {product.product_name}
                        </h2>
                        <p className="text-gray-400 text-sm">{product.category_name}</p>
                        <div className="flex items-center my-3">
                          {Array(5)
                            .fill()
                            .map((_, i) => (
                              <span key={i} className="text-orange-400">
                                {i < Math.floor(product.review_stars || 0) ? (
                                  <FaStar />
                                ) : i < (product.review_stars || 0) ? (
                                  <FaStarHalfAlt />
                                ) : (
                                  <FaRegStar />
                                )}
                              </span>
                            ))}
                          <span className="text-gray-600 ml-1 text-sm">
                            ({product.no_of_reviews || 0})
                          </span>
                        </div>
                        <div className="">
                          <span className="text-xl font-semibold">
                            ₹{product.discounted_single_product_price?.toLocaleString()}
                          </span>
                          <span className="text-sm line-through text-gray-400 ml-2">
                            ₹{product.non_discounted_price?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto pt-5 space-y-3">
                        <div className="flex gap-3">
                          <button className="bg-[#f7941d] cursor-pointer text-white font-medium py-1 px-4 rounded-2xl text-sm" onClick={(e) => handleBuyNowClick(e, product)}>
                            {loadingBuyNow[product._id] ? "Buying..." : "Buy Now"}
                          </button>
                          <button
                            className="bg-gray-50 border border-gray-200 text-[#f7941d] py-1 px-4 rounded-2xl text-sm"
                            onClick={(e) => {
                              handleAddToCart(e, product);
                              toast.success('Added to cart successfully!', {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                              });
                            }}
                          >
                            {isInCart(product._id)
                              ? `In Cart (${getItemQuantity(product._id)})`
                              : "Add to cart"}
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            Get it <span className="font-bold">Friday</span>
                            {product.deliveryDate && `, ${product.deliveryDate.split(",")[1]}`}
                          </p>
                          <p className="text-gray-400">{product?.deliveryType || "Standard Delivery"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16">
                    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg p-8 text-center">
                      <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        We couldn't find any products that match your current
                        filter selections. Try adjusting your filters to see more
                        results.
                      </p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <button
                          onClick={clearAllFilters}
                          className="px-5 py-2.5 bg-[#f7941d] text-white font-medium rounded-full hover:bg-orange-600 transition shadow-md"
                        >
                          Clear All Filters
                        </button>
                        <button
                          onClick={() => {
                            clearAllFilters();
                            setActiveTab("All");
                          }}
                          className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition"
                        >
                          View All Products
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
