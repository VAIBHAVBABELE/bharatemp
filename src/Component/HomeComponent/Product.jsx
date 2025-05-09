import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import raspberry from '../../assets/rasperrybi.svg';
import filtericon from '../../assets/filtericon.png';
import { IoFilter } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useCart } from '../../context/CartContext';

const Product = () => {
  const [activeTab, setActiveTab] = useState('Featured');
  const [showSidebar, setShowSidebar] = useState(false);
  const [sliderValue, setSliderValue] = useState(10000);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  
  // Filter states
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: 100, max: 10000 });
  const [tempPriceRange, setTempPriceRange] = useState({ min: 100, max: 10000 }); // Temporary state for slider before Apply
  const [priceCheckboxFilters, setPriceCheckboxFilters] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);

  // Get cart functions
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const min = 100;
  const max = 10000;

  const navigate = useNavigate();

  // Replace the allProducts array with this more diverse product data
  const allProducts = [
    {
      id: 1,
      name: 'Raspberry Pi 4 (8GB)',
      category: 'Development Boards',
      color: 'Green',
      brand: 'Raspberry Pi',
      image: raspberry,
      rating: 4.7,
      reviewCount: 128,
      price: 5499,
      originalPrice: 6499,
      deliveryDate: 'Friday, Jan 18',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: true
    },
    {
      id: 2,
      name: 'Arduino Mega 2560',
      category: 'Development Boards',
      color: 'Blue',
      brand: 'Arduino',
      image: raspberry,
      rating: 4.5,
      reviewCount: 92,
      price: 2499,
      originalPrice: 2999,
      deliveryDate: 'Saturday, Jan 19',
      deliveryType: 'FREE Delivery',
      onSale: false,
      topRated: true
    },
    {
      id: 3,
      name: 'ESP32 DevKit',
      category: 'Development Boards',
      color: 'Black',
      brand: 'Espressif',
      image: raspberry,
      rating: 4.3,
      reviewCount: 76,
      price: 499,
      originalPrice: 699,
      deliveryDate: 'Monday, Jan 21',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: false
    },
    {
      id: 4,
      name: 'Drone Frame Kit',
      category: 'Drone Parts',
      color: 'Black',
      brand: 'DJI',
      image: raspberry,
      rating: 4.6,
      reviewCount: 83,
      price: 3899,
      originalPrice: 4299,
      deliveryDate: 'Friday, Jan 18',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: true
    },
    {
      id: 5,
      name: 'Drone Motor 2400KV',
      category: 'Drone Parts',
      color: 'Silver',
      brand: 'Emax',
      image: raspberry,
      rating: 4.2,
      reviewCount: 65,
      price: 799,
      originalPrice: 999,
      deliveryDate: 'Sunday, Jan 20',
      deliveryType: 'FREE Delivery',
      onSale: false,
      topRated: false
    },
    {
      id: 6,
      name: 'Flight Controller F4',
      category: 'Drone Parts',
      color: 'Black',
      brand: 'BetaFlight',
      image: raspberry,
      rating: 4.8,
      reviewCount: 112,
      price: 1799,
      originalPrice: 2299,
      deliveryDate: 'Saturday, Jan 19',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: true
    },
    {
      id: 7,
      name: 'Servo Motor SG90',
      category: 'Robotics',
      color: 'White',
      brand: 'TowerPro',
      image: raspberry,
      rating: 3.9,
      reviewCount: 48,
      price: 149,
      originalPrice: 199,
      deliveryDate: 'Monday, Jan 21',
      deliveryType: 'FREE Delivery',
      onSale: false,
      topRated: false
    },
    {
      id: 8,
      name: 'Robot Chassis Kit',
      category: 'Robotics',
      color: 'Black',
      brand: 'Makeblock',
      image: raspberry,
      rating: 4.4,
      reviewCount: 37,
      price: 2999,
      originalPrice: 3499,
      deliveryDate: 'Sunday, Jan 20',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: false
    },
    {
      id: 9,
      name: 'LiPo Battery 5000mAh',
      category: 'Power Supply',
      color: 'Red',
      brand: 'Turnigy',
      image: raspberry,
      rating: 4.6,
      reviewCount: 94,
      price: 1499,
      originalPrice: 1799,
      deliveryDate: 'Friday, Jan 18',
      deliveryType: 'FREE Delivery',
      onSale: false,
      topRated: true
    },
    {
      id: 10,
      name: 'DC-DC Buck Converter',
      category: 'Power Supply',
      color: 'Blue',
      brand: 'Pololu',
      image: raspberry,
      rating: 4.1,
      reviewCount: 28,
      price: 349,
      originalPrice: 399,
      deliveryDate: 'Monday, Jan 21',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: false
    },
    {
      id: 11,
      name: 'Ultrasonic Sensor HC-SR04',
      category: 'Sensors',
      color: 'Blue',
      brand: 'Generic',
      image: raspberry,
      rating: 4.0,
      reviewCount: 72,
      price: 99,
      originalPrice: 149,
      deliveryDate: 'Sunday, Jan 20',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: false
    },
    {
      id: 12,
      name: 'DHT22 Temperature Sensor',
      category: 'Sensors',
      color: 'White',
      brand: 'Adafruit',
      image: raspberry,
      rating: 4.3,
      reviewCount: 61,
      price: 299,
      originalPrice: 349,
      deliveryDate: 'Saturday, Jan 19',
      deliveryType: 'FREE Delivery',
      onSale: false,
      topRated: true
    },
    {
      id: 13,
      name: 'OLED Display 0.96"',
      category: 'Displays',
      color: 'Blue',
      brand: 'Waveshare',
      image: raspberry,
      rating: 4.5,
      reviewCount: 47,
      price: 399,
      originalPrice: 499,
      deliveryDate: 'Friday, Jan 18',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: true
    },
    {
      id: 14,
      name: 'Breadboard 830 Points',
      category: 'Tools',
      color: 'White',
      brand: 'Generic',
      image: raspberry,
      rating: 3.8,
      reviewCount: 124,
      price: 149,
      originalPrice: 199,
      deliveryDate: 'Monday, Jan 21',
      deliveryType: 'FREE Delivery',
      onSale: false,
      topRated: false
    },
    {
      id: 15,
      name: 'Soldering Iron Kit',
      category: 'Tools',
      color: 'Silver',
      brand: 'Hakko',
      image: raspberry,
      rating: 4.7,
      reviewCount: 138,
      price: 1299,
      originalPrice: 1599,
      deliveryDate: 'Saturday, Jan 19',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: true
    },
    {
      id: 16,
      name: 'Jumper Wires Pack',
      category: 'Tools',
      color: 'Multi',
      brand: 'SparkFun',
      image: raspberry,
      rating: 4.2,
      reviewCount: 89,
      price: 199,
      originalPrice: 249,
      deliveryDate: 'Sunday, Jan 20',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: false
    },
    {
      id: 17,
      name: 'High-End Drone Kit',
      category: 'Drone Parts',
      color: 'Black',
      brand: 'DJI',
      image: raspberry,
      rating: 4.9,
      reviewCount: 52,
      price: 8999,
      originalPrice: 9999,
      deliveryDate: 'Friday, Jan 18',
      deliveryType: 'FREE Delivery',
      onSale: true,
      topRated: true
    }
  ];

  // Fix the order of function declarations and usage
  const tabs = ['Featured', 'On Sale', 'Top Rated'];

  // Get category, color, and brand counts
  function getCountForCategory(category) {
    return allProducts.filter(p => p.category === category).length;
  }

  function getCountForBrand(brand) {
    return allProducts.filter(p => p.brand === brand).length;
  }

  function getCountForPriceRange(min, max) {
    if (max === Infinity) {
      return allProducts.filter(p => p.price >= min).length;
    }
    return allProducts.filter(p => p.price >= min && p.price <= max).length;
  }

  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 499, count: getCountForPriceRange(0, 499) },
    { label: '₹500 - ₹999', min: 500, max: 999, count: getCountForPriceRange(500, 999) },
    { label: '₹1000 - ₹1999', min: 1000, max: 1999, count: getCountForPriceRange(1000, 1999) },
    { label: '₹2000 - ₹3999', min: 2000, max: 3999, count: getCountForPriceRange(2000, 3999) },
    { label: '₹4000 - ₹4999', min: 4000, max: 4999, count: getCountForPriceRange(4000, 4999) },
    { label: 'Over ₹5000', min: 5000, max: Infinity, count: getCountForPriceRange(5000, Infinity) }
  ];

  // Log to check which products are over 5000
  console.log("Products over 5000:", allProducts.filter(p => p.price >= 5000).map(p => p.name));

  // Extract unique categories, colors, and brands
  const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
  const uniqueBrands = [...new Set(allProducts.map(p => p.brand))];

  const categories = uniqueCategories.map(category => ({
    label: category,
    count: getCountForCategory(category)
  }));

  const brands = uniqueBrands.map(brand => ({
    label: brand,
    count: getCountForBrand(brand)
  }));

  // Complete the rest of the filter logic with debugging
  useEffect(() => {
    let filtered = [...allProducts];
    console.log("Starting with all products:", filtered.length);

    // Filter by tab
    if (activeTab === 'On Sale') {
      filtered = filtered.filter(p => p.onSale);
      console.log("After 'On Sale' filter:", filtered.length);
    } else if (activeTab === 'Top Rated') {
      filtered = filtered.filter(p => p.topRated);
      console.log("After 'Top Rated' filter:", filtered.length);
    }

    // Filter by price slider (using the applied priceRangeFilter, not the temp slider value)
    filtered = filtered.filter(p => p.price >= priceRangeFilter.min && p.price <= priceRangeFilter.max);
    console.log("After price slider filter:", filtered.length, priceRangeFilter);

    // Filter by price checkbox selections
    if (priceCheckboxFilters.length > 0) {
      console.log("Active price checkbox filters:", priceCheckboxFilters);
      
      // First collect all products that match any of the selected price ranges
      const priceFiltered = [];
      
      priceCheckboxFilters.forEach(filter => {
        const range = priceRanges.find(r => r.label === filter);
        if (range) {
          console.log(`Applying filter: ${filter}`, range);
          
          // For each price range filter, find products that match from the current filtered set
          const matchingProducts = filtered.filter(p => {
            const matches = p.price >= range.min && 
                (range.max === Infinity ? true : p.price <= range.max);
            
            if (matches && filter === "Over ₹5000") {
              console.log(`Product matches "Over ₹5000": ${p.name} (₹${p.price})`);
            }
            
            return matches;
          });
          
          console.log(`${matchingProducts.length} products match the ${filter} filter`);
          priceFiltered.push(...matchingProducts);
        }
      });
      
      // Remove duplicates from the price filtered results
      if (priceFiltered.length > 0) {
        filtered = priceFiltered.filter((product, index, self) =>
          index === self.findIndex(p => p.id === product.id)
        );
        console.log("After price checkbox filters:", filtered.length);
      } else {
        console.log("No products match the price checkbox filters");
        filtered = [];
      }
    }

    // Filter by category
    if (categoryFilters.length > 0) {
      console.log("Applying category filters:", categoryFilters);
      filtered = filtered.filter(p => categoryFilters.includes(p.category));
      console.log("After category filter:", filtered.length);
    }

    // Filter by brand
    if (brandFilters.length > 0) {
      console.log("Applying brand filters:", brandFilters);
      filtered = filtered.filter(p => brandFilters.includes(p.brand));
      console.log("After brand filter:", filtered.length);
    }

    console.log("Final filtered products:", filtered.length);
    setDisplayedProducts(filtered);
  }, [activeTab, priceRangeFilter, priceCheckboxFilters, categoryFilters, brandFilters]);

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
    setPriceCheckboxFilters(prev => {
      if (prev.includes(label)) {
        return prev.filter(item => item !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  const handleCategoryChange = (category) => {
    setCategoryFilters(prev => {
      if (prev.includes(category)) {
        return prev.filter(item => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };


  const handleBrandChange = (brand) => {
    setBrandFilters(prev => {
      if (prev.includes(brand)) {
        return prev.filter(item => item !== brand);
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

  // Calculate slider percentage for display
  const percentage = ((sliderValue - min) / (max - min)) * 100;
  
  // Calculate applied range percentage for the applied filter indicator
  const appliedPercentage = ((priceRangeFilter.max - min) / (max - min)) * 100;

  // Update the function to handle product click with the proper ID
  const handleProductClick = (product) => {
    // Navigate to the product detail page with the product ID
    navigate(`/product/${product.id}`);
    
    // Store the selected product in localStorage
    localStorage.setItem('selectedProduct', JSON.stringify(product));
  };

  // Add a new function to handle adding to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent click from bubbling up to the card
    addToCart(product);
  };

  return (
    <div className="relative bg-white font-[outfit]">
      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          className="bg-[#f7941d] text-white p-3 rounded-full shadow-lg flex items-center justify-center"
          onClick={() => setShowSidebar(true)}
        >
          <IoFilter size={24} />
        </button>
      </div>

      {/* Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="w-full px-4 md:px-6 py-6">
        <div className="w-full flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter */}
          <div
            className={`
              fixed top-0 left-0 z-50 bg-white w-[300px] h-full overflow-y-auto px-2 shadow-lg transition-transform duration-300
              ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
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
                    className="absolute h-1 bg-[#f7941d] rounded-full"
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
                    className="absolute w-4 h-4 bg-[#f7941d] rounded-full -mt-1.5"
                    style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
                  ></div>
                  
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">
                  Price: ₹{min} - ₹{sliderValue}
                  {priceRangeFilter.max !== sliderValue && (
                    <span className="ml-1 text-xs text-[#f7941d]"> (not applied)</span>
                  )}
                </p>
                <button
                  onClick={handleApply}
                  className={`px-4 py-1 text-xs font-medium text-white rounded-full transition shadow-sm ${
                    priceRangeFilter.max !== sliderValue 
                      ? 'bg-[#f7941d] hover:bg-orange-600' 
                      : 'bg-blue-900 hover:bg-blue-800'
                  }`}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Filter by Price Options */}
            <div className="mb-6">
              <h3 className="bg-[#f7941d] text-white px-4 py-1.5 text-sm font-medium rounded-full mb-3">
                Filter by Price
              </h3>
              <ul className="space-y-2">
                {priceRanges.map((range, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-2 h-4 w-4 accent-[#f7941d]"
                        checked={priceCheckboxFilters.includes(range.label)}
                        onChange={() => handlePriceCheckboxChange(range.label)}
                      />
                      {range.label}
                    </label>
                    <span className="text-[#f7941d] bg-gray-100 text-xs font-medium rounded-full px-2 py-0.5">
                      {range.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter by Categories */}
            <div className="mb-6">
              <h3 className="bg-[#f7941d] text-white px-4 py-1.5 text-sm font-medium rounded-full mb-3">
                Filter by Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-2 h-4 w-4 accent-[#f7941d]"
                        checked={categoryFilters.includes(category.label)}
                        onChange={() => handleCategoryChange(category.label)}
                      />
                      {category.label}
                    </label>
                    <span className="text-[#f7941d] bg-gray-100 text-xs font-medium rounded-full px-2 py-0.5">
                      {category.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter by Brand */}
            <div className="mb-6">
              <h3 className="bg-[#f7941d] text-white px-4 py-1.5 text-sm font-medium rounded-full mb-3">
                Filter by Brand
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {brands.map((brand, index) => (
                  <div key={index} className="flex items-center bg-gray-100 text-xs font-medium px-2 py-1.5 rounded-full">
                    <input 
                      type="checkbox" 
                      className="mr-1.5 h-3 w-3 accent-[#f7941d]" 
                      id={`brand-${index}`} 
                      checked={brandFilters.includes(brand.label)}
                      onChange={() => handleBrandChange(brand.label)}
                    />
                    <label htmlFor={`brand-${index}`} className="cursor-pointer truncate">{brand.label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid Section */}
          <div className=" w-full">
            <div className="border-b border-gray-300 flex items-center justify-between mb-6">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 font-medium relative ${
                      activeTab === tab ? 'text-gray-900 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute left-0 -bottom-0.5 w-full h-1 bg-[#f7941d] rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
              <Link
                to="/product2"
                className="text-sm text-gray-800 hover:text-gray-900 flex items-center"
              >
                View All Products <span className="ml-1">›</span>
              </Link>
            </div>

            {/* Product Count and Active Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <p className="text-sm text-gray-600">
                {displayedProducts.length} {displayedProducts.length === 1 ? 'product' : 'products'} found
              </p>
              
              {[
                // Add slider price range if it's not at max
                ...(priceRangeFilter.max < max ? [{ type: 'slider', value: `₹${min} - ₹${priceRangeFilter.max}` }] : []),
                ...priceCheckboxFilters.map(filter => ({ type: 'price', value: filter })),
                ...categoryFilters.map(category => ({ type: 'category', value: category })),
                ...brandFilters.map(brand => ({ type: 'brand', value: brand }))
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
                  
                  {priceCheckboxFilters.map(filter => (
                    <span key={filter} className="bg-gray-100 text-xs rounded-full px-2 py-1 flex items-center">
                      {filter}
                      <button 
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handlePriceCheckboxChange(filter)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  
                  {categoryFilters.map(category => (
                    <span key={category} className="bg-gray-100 text-xs rounded-full px-2 py-1 flex items-center">
                      {category}
                      <button 
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleCategoryChange(category)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  
                  {brandFilters.map(brand => (
                    <span key={brand} className="bg-gray-100 text-xs rounded-full px-2 py-1 flex items-center">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-3">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col h-full"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex justify-center mb-5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-contain"
                      />
                    </div>
                    <div className="">
                      <h2 className="text-[#1e3473] font-semibold text-lg">{product.name}</h2>
                      <p className="text-gray-400 text-sm ">With Wifi</p>
                      <div className="flex items-center my-3">
                        {Array(5).fill().map((_, i) => (
                          <span key={i} className="text-orange-400">
                            {i < Math.floor(product.rating) ? (
                              <FaStar />
                            ) : i < product.rating ? (
                              <FaStarHalfAlt />
                            ) : (
                              <FaRegStar />
                            )}
                          </span>
                        ))}
                        <span className="text-gray-600 ml-1 text-sm">({product.reviewCount})</span>
                      </div>
                      <div className="">
                        <span className="text-xl font-semibold">₹{product.price.toLocaleString()}</span>
                        <span className="text-sm line-through text-gray-400 ml-2">₹{product.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-5 space-y-3">
                      <div className="flex gap-3">
                        <button className="bg-[#f7941d] text-white font-medium py-1 px-4 rounded-2xl text-sm">
                          Buy Now
                        </button>
                        <button 
                          className="bg-gray-50 border border-gray-200 text-[#f7941d] py-1 px-4 rounded-2xl text-sm"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          {isInCart(product.id) ? `In Cart (${getItemQuantity(product.id)})` : 'Add to cart'}
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Get it <span className="font-bold">Friday</span>, {product.deliveryDate.split(',')[1]}</p>
                        <p className="text-gray-400">{product.deliveryType}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16">
                  <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg p-8 text-center">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-6">We couldn't find any products that match your current filter selections. Try adjusting your filters to see more results.</p>
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
                          setActiveTab('Featured');
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
  );
};

export default Product;
