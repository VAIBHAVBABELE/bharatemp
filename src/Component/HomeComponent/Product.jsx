import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoFilter } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useCart } from "../../context/CartContext";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { fetchProductsDynamic } from "../../utils/api";
import axios from "axios";
import "../../styles/mobile-responsive.css";

const backend = import.meta.env.VITE_BACKEND;

const Product = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [wholesaleProducts, setWholesaleProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loadingBuyNow] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);

  const [showSidebar, setShowSidebar] = useState(false);
  const [sliderValue, setSliderValue] = useState(50000);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subcategoryFilters, setSubcategoryFilters] = useState([]);

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
  const { addToCart, buyNow, isInCart, getItemQuantity } = useCart();
  const location = useLocation();

  const min = 1;
  const max = 50000;

  const navigate = useNavigate();

  // Get search query and category from URL
  // Get search query, category, and subcategory from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");
    const category = params.get("category");
    const subcategory = params.get("subcategory");

    if (query) {
      setSearchQuery(query);
    } else {
      setSearchQuery("");
    }

    // If category is provided, set it in the filters
    if (category) {
      setCategoryFilters([category]);
    } else {
      setCategoryFilters([]);
    }

    // If subcategory is provided, set it in the filters
    if (subcategory) {
      setSubcategoryFilters([subcategory]);
    } else {
      setSubcategoryFilters([]);
    }
  }, [location]);

  async function fetchAllProducts(options = {}) {
    try {
      setLoading(true);
      const result = await fetchProductsDynamic({
        pageSize: 1000,
        useMockData: false,
        ...options,
      });

      if (result.success && result.products.length > 0) {
        setAllProducts(result.products);
        // console.log(`Fetched ${result.products.length} products from database`);
      } else {
        // console.error("No products found in database:", result.error);
        setAllProducts([]);
        toast.error("No products available. Please check back later.");
      }
    } catch (error) {
      // console.error("Error fetching products:", error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // Add refresh function for when new products are added
  const refreshProducts = useCallback(() => {
    fetchAllProducts();
  }, []);

  // Listen for storage events and real-time updates to refresh when products are added/updated
  useEffect(() => {
    const checkForRefresh = setInterval(() => {
      if (localStorage.getItem("refreshProducts")) {
        refreshProducts();
        localStorage.removeItem("refreshProducts");
      }
    }, 1000);

    // Listen for real-time product updates
    const handleProductUpdate = (event) => {
      // console.log('Product updated:', event.detail);
      refreshProducts();
    };

    window.addEventListener('productUpdated', handleProductUpdate);

    return () => {
      clearInterval(checkForRefresh);
      window.removeEventListener('productUpdated', handleProductUpdate);
    };
  }, [refreshProducts]);

  // Fetch wholesale products
  const fetchWholesaleProducts = async () => {
    try {
      const response = await axios.post(`${backend}/wholesale/list`, {
        pageNum: 1,
        pageSize: 1000,
        filters: {}
      });
      if (response.data.status === "Success") {
        setWholesaleProducts(response.data.data.wholesaleProductsList || []);
      }
    } catch (error) {
      // console.error('Error fetching wholesale products:', error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchWholesaleProducts();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    priceRangeFilter,
    priceCheckboxFilters,
    categoryFilters,
    subcategoryFilters,
    brandFilters,
    searchQuery,
  ]);

  // Fix the order of function declarations and usage
  const tabs = ["All", "On Sale", "Top Rated"];

  // Get category, color, and brand counts
  function getCountForCategory(category) {
    return allProducts.filter((p) => p.category_name === category).length;
  }

  function getCountForBrand(brand) {
    return allProducts.filter((p) => p.brand_name === brand).length;
  }

  const getCountForPriceRange = useCallback(
    (min, max) => {
      return allProducts.filter((p) => {
        const price =
          p.discounted_single_product_price || p.non_discounted_price;
        if (max === Infinity) {
          return price && price >= min;
        }
        return price && price >= min && price <= max;
      }).length;
    },
    [allProducts]
  );

  const priceRanges = useMemo(
    () => [
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
    ],
    [getCountForPriceRange]
  );

  const uniqueCategories = [
    ...new Set(allProducts.map((p) => p.category_name)),
  ];
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
      filtered = filtered
        .filter((p) => p.discount && p.discount > 0)
        .sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (activeTab === "Top Rated") {
      // Filter products with good ratings and sort by review count and rating
      filtered = filtered
        .filter((p) => p.review_stars >= 4)
        .sort((a, b) => {
          // First sort by number of reviews (descending)
          const reviewDiff = (b.no_of_reviews || 0) - (a.no_of_reviews || 0);
          // If review counts are equal, sort by rating (descending)
          if (reviewDiff === 0) {
            return (b.review_stars || 0) - (a.review_stars || 0);
          }
          return reviewDiff;
        });
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
            const price =
              p.discounted_single_product_price || p.non_discounted_price;
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
        filtered = Array.from(new Set(priceFiltered.map((p) => p._id))).map(
          (id) => priceFiltered.find((p) => p._id === id)
        );
      } else {
        filtered = [];
      }
    }

    // Filter by category
    if (categoryFilters.length > 0) {
      filtered = filtered.filter((p) =>
        categoryFilters.includes(p.category_name)
      );
    }

    // Filter by subcategory
    if (subcategoryFilters.length > 0) {
      filtered = filtered.filter((p) =>
        subcategoryFilters.some(
          (subcat) =>
            p.sub_category_name &&
            p.sub_category_name.toLowerCase() === subcat.toLowerCase()
        )
      );
    }

    // Filter by brand
    if (brandFilters.length > 0) {
      filtered = filtered.filter((p) => brandFilters.includes(p.brand_name));
    }

    setDisplayedProducts(filtered);
  }, [
    allProducts,
    activeTab,
    priceRangeFilter,
    priceCheckboxFilters,
    categoryFilters,
    subcategoryFilters,
    brandFilters,
    searchQuery,
    priceRanges,
  ]);

  // Get paginated products for display
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return displayedProducts.slice(startIndex, endIndex);
  };

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setSliderValue(value);
    // Update temp price range but don't apply it yet
    setTempPriceRange({ min: min, max: value });
  };

  const handleSubcategoryChange = (subcategory) => {
    setSubcategoryFilters((prev) => {
      if (prev.includes(subcategory)) {
        return prev.filter((item) => item !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
  };

  const clearSubcategoryFilters = () => {
    setSubcategoryFilters([]);
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
      const newFilters = prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category];

      // Clear subcategory filters when category selection changes
      // Only keep subcategories that belong to the newly selected categories
      if (newFilters.length === 0) {
        setSubcategoryFilters([]);
      } else {
        const validSubcategories = [
          ...new Set(
            allProducts
              .filter((p) => newFilters.includes(p.category_name))
              .map((p) => p.sub_category_name)
              .filter(Boolean)
          ),
        ];

        setSubcategoryFilters((prevSub) =>
          prevSub.filter((sub) => validSubcategories.includes(sub))
        );
      }

      return newFilters;
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
    setSubcategoryFilters([]); // ADD THIS LINE
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

  // Add this helper function to get subcategories based on selected categories
  const getFilteredSubcategories = () => {
    if (categoryFilters.length === 0) {
      // If no categories are selected, show all subcategories
      return [
        ...new Set(allProducts.map((p) => p.sub_category_name).filter(Boolean)),
      ];
    } else {
      // If categories are selected, show only subcategories from those categories
      return [
        ...new Set(
          allProducts
            .filter((p) => categoryFilters.includes(p.category_name))
            .map((p) => p.sub_category_name)
            .filter(Boolean)
        ),
      ];
    }
  };

  // Modified function to get count for subcategory (considering category filters)
  function getCountForSubcategoryFiltered(subcategory) {
    let productsToCount = allProducts;

    // If categories are selected, only count products from those categories
    if (categoryFilters.length > 0) {
      productsToCount = allProducts.filter((p) =>
        categoryFilters.includes(p.category_name)
      );
    }

    return productsToCount.filter(
      (p) =>
        p.sub_category_name &&
        p.sub_category_name.toLowerCase() === subcategory.toLowerCase()
    ).length;
  }

  const clearCategoryFilters = () => {
    setCategoryFilters([]);
  };

  const clearBrandFilters = () => {
    setBrandFilters([]);
  };

  // Calculate slider percentage for display
  const percentage = ((sliderValue - min) / (max - min)) * 100;

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
    
    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Check if product is in stock
    if (!product.product_instock) {
      toast.error("Product is out of stock");
      return;
    }

    // Check if requested quantity is available
    if (product.no_of_product_instock && product.no_of_product_instock < 1) {
      toast.error("Product is out of stock");
      return;
    }

    const regularItem = {
      ...product,
      quantity: 1,
      price: product.discounted_single_product_price,
      total: product.discounted_single_product_price * 1,
      isBulkOrder: false,
    };
    
    buyNow(regularItem);
    toast.success("Ready to checkout with 1 item!");
    
    // Navigate to checkout page
    navigate('/checkout');
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
                  Search results for:{" "}
                  <span className="font-bold">"{searchQuery}"</span>
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
              <div className="mb-6 -mt-2">
                <h3 className="text-lg font-semibold mb-4">Filter by Price</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-1 -top-1.5 flex-grow bg-gray-200 rounded-full relative">
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
                      className="absolute w-full h-1 opacity-0 cursor-pointer -top-8"
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
                      className={`px-4 py-1 text-xs font-medium text-white rounded-full transition shadow-sm ${
                        priceRangeFilter.max !== sliderValue
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
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <label className="flex items-center text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 accent-[#1e3473]"
                          checked={priceCheckboxFilters.includes(range.label)}
                          onChange={() =>
                            handlePriceCheckboxChange(range.label)
                          }
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
                <h3 className="bg-[#1e3473] text-white px-4 py-1.5 text-sm font-medium rounded-full mb-3 ">
                  Filter by Categories
                </h3>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
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

              {/* Filter by Subcategories */}
              <div className="mb-6">
                <h3 className="bg-[#1e3473] text-white px-4 py-1.5 text-sm font-medium rounded-full mb-3">
                  Filter by Subcategories
                </h3>
                {getFilteredSubcategories().length > 0 ? (
                  <>
                    <ul className="space-y-2">
                      {getFilteredSubcategories().map((subcategory, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <label className="flex items-center text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              className="mr-2 h-4 w-4 accent-[#1e3473]"
                              checked={subcategoryFilters.includes(subcategory)}
                              onChange={() =>
                                handleSubcategoryChange(subcategory)
                              }
                            />
                            {subcategory}
                          </label>
                          <span className="text-[#1e3473] bg-gray-100 text-xs font-medium rounded-full px-2 py-0.5">
                            {getCountForSubcategoryFiltered(subcategory)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={clearSubcategoryFilters}
                      className="text-xs mt-4 bg-[#1e3473] text-white rounded-3xl cursor-pointer px-8 py-2 hover:underline"
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    {categoryFilters.length > 0
                      ? "No subcategories available for selected categories"
                      : "No subcategories available"}
                  </p>
                )}
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
                      className={`font-medium cursor-pointer relative ${
                        activeTab === tab
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
                  {displayedProducts.length === 1 ? "product" : "products"}{" "}
                  found
                </p>
                <button
                  onClick={refreshProducts}
                  className="ml-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
                  title="Refresh products list"
                >
                  🔄 Refresh
                </button>

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
                  ...subcategoryFilters.map((subcategory) => ({
                    // ADD THIS
                    type: "subcategory",
                    value: subcategory,
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

                    {subcategoryFilters.map((subcategory) => (
                      <span
                        key={subcategory}
                        className="bg-gray-100 text-xs rounded-full px-2 py-1 flex items-center"
                      >
                        {subcategory}
                        <button
                          className="ml-1 text-gray-500 hover:text-gray-700"
                          onClick={() => handleSubcategoryChange(subcategory)}
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

              {/* Desktop Product Grid */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {loading ? (
                  <div className="col-span-full flex justify-center items-center py-40">
                    <LoadingSpinner />
                  </div>
                ) : getPaginatedProducts().length > 0 ? (
                  getPaginatedProducts().map((product, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col h-full"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="flex justify-center mb-5">
                        <img
                          src={
                            product.product_image_main ||
                            (Array.isArray(product.product_image_sub) &&
                              product.product_image_sub[0]) ||
                            "/api/placeholder/400/300"
                          }
                          alt={product.product_name || "Product"}
                          className="w-full h-40 object-contain"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='18' fill='%236b7280' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <div className="">
                        <h2 className="text-[#1e3473] font-semibold h-[84px] text-lg">
                          {product.product_name || "Unnamed Product"}
                        </h2>
                        <p className="text-gray-400 text-sm">
                          {product.category_name || "Uncategorized"}
                        </p>
                        <div className="flex items-center my-3">
                          {Array(5)
                            .fill()
                            .map((_, i) => (
                              <span key={i} className="text-orange-400">
                                {i <
                                Math.floor(
                                  Number(product.review_stars) || 0
                                ) ? (
                                  <FaStar />
                                ) : i < (Number(product.review_stars) || 0) ? (
                                  <FaStarHalfAlt />
                                ) : (
                                  <FaRegStar />
                                )}
                              </span>
                            ))}
                          <span className="text-gray-600 ml-1 text-sm">
                            ({Number(product.no_of_reviews) || 0})
                          </span>
                        </div>
                        <div className="">
                          <span className="text-xl font-semibold">
                            ₹
                            {(
                              Number(product.discounted_single_product_price) ||
                              Number(product.non_discounted_price) ||
                              0
                            ).toLocaleString()}
                          </span>
                          {Number(product.non_discounted_price) &&
                            Number(product.discounted_single_product_price) &&
                            Number(product.non_discounted_price) >
                              Number(
                                product.discounted_single_product_price
                              ) && (
                              <span className="text-sm line-through text-gray-400 ml-2">
                                ₹
                                {Number(
                                  product.non_discounted_price
                                ).toLocaleString()}
                              </span>
                            )}
                        </div>
                        
                        {/* Product Quantity Display */}
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              Stock Available
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {product.no_of_product_instock || 0} units
                            </span>
                          </div>
                        </div>
                        
                        {/* Stock Information - Only show Out of Stock */}
                        <div className="mt-2">
                          {product.product_instock === false || product.no_of_product_instock === 0 ? (
                            <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                          ) : (
                            <span className="text-green-600 text-sm font-medium">In Stock</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto pt-3 space-y-3">
                        <div className="flex gap-2">
                          {/* <button
                            className={`font-medium py-2 px-3 rounded-2xl text-xs ${
                              product.product_instock === false || product.no_of_product_instock === 0
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-[#f7941d] cursor-pointer text-white"
                            }`}
                            onClick={(e) => handleBuyNowClick(e, product)}
                            disabled={product.product_instock === false || product.no_of_product_instock === 0}
                          >
                            {product.product_instock === false || product.no_of_product_instock === 0
                              ? "Out of Stock"
                              : loadingBuyNow[product._id]
                              ? "Buying..."
                              : "Buy Now"}
                          </button> */}
                          <button
                            className={`border py-2 px-3 rounded-2xl text-xs ${
                              product.product_instock === false || product.no_of_product_instock === 0
                                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                : "bg-gray-50 border-gray-200 text-[#f7941d]"
                            }`}
                            onClick={(e) => {
                              if (product.product_instock !== false && product.no_of_product_instock !== 0) {
                                handleAddToCart(e, product);
                                toast.success("Added to cart successfully!", {
                                  position: "top-right",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                });
                              }
                            }}
                            disabled={product.product_instock === false || product.no_of_product_instock === 0}
                          >
                            {product.product_instock === false || product.no_of_product_instock === 0
                              ? "Unavailable"
                              : isInCart(product._id)
                              ? `In Cart (${getItemQuantity(product._id)})`
                              : "Add to cart"}
                          </button>
                        </div>
                        
                        {/* Additional Product Info */}
                        <div className="mt-2 text-center">
                          <span className="text-xs text-gray-500">
                            Available: {product.no_of_product_instock || 0} units
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            Get it <span className="font-bold">Friday</span>
                            {product.deliveryDate &&
                              `, ${product.deliveryDate.split(",")[1]}`}
                          </p>
                          <p className="text-gray-400">
                            {product?.deliveryType || "Standard Delivery"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-2">
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
                        filter selections. Try adjusting your filters to see
                        more results.
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

              {/* Mobile Product Grid - Multiple Rows */}
              <div className="md:hidden">
                {loading ? (
                  <div className="flex justify-center items-center w-full py-20">
                    <LoadingSpinner />
                  </div>
                ) : getPaginatedProducts().length > 0 ? (
                  <>
                    {/* First Row - Horizontal Scroll */}
                    <div className="mobile-section-header">Featured Products</div>
                    <div className="mobile-product-container mobile-scroll">
                      {getPaginatedProducts().slice(0, 6).map((product, index) => (
                        <div
                          key={index}
                          className="mobile-product-card mobile-touch-feedback"
                          onClick={() => handleProductClick(product)}
                        >
                          <img
                            src={
                              product.product_image_main ||
                              (Array.isArray(product.product_image_sub) &&
                                product.product_image_sub[0]) ||
                              "/api/placeholder/400/300"
                            }
                            alt={product.product_name || "Product"}
                            className="mobile-product-image"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='18' fill='%236b7280' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          
                          <h2 className="mobile-product-title">
                            {product.product_name || "Unnamed Product"}
                          </h2>
                          
                          <p className="mobile-product-category">
                            {product.category_name || "Uncategorized"}
                          </p>
                          
                          <div className="mobile-product-price">
                            ₹
                            {(
                              Number(product.discounted_single_product_price) ||
                              Number(product.non_discounted_price) ||
                              0
                            ).toLocaleString()}
                          </div>
                          
                          {product.product_instock === false || product.no_of_product_instock === 0 ? (
                            <div className="text-center text-red-500 text-xs font-medium mt-auto">
                              Out of Stock
                            </div>
                          ) : (
                            <div className="mobile-product-buttons">
                              <button 
                                className="mobile-btn-buy"
                                onClick={(e) => handleBuyNowClick(e, product)}
                              >
                                Buy
                              </button>
                              <button 
                                className="mobile-btn-cart"
                                onClick={(e) => {
                                  handleAddToCart(e, product);
                                  toast.success("Added!", {
                                    position: "top-right",
                                    autoClose: 1000,
                                  });
                                }}
                              >
                                Cart
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Row Separator */}
                    <div className="mobile-row-separator"></div>

                    {/* Second Row - Horizontal Scroll */}
                    {getPaginatedProducts().length > 6 && (
                      <>
                        <div className="mobile-section-header">More Products</div>
                        <div className="mobile-product-container mobile-scroll">
                          {getPaginatedProducts().slice(6, 12).map((product, index) => (
                            <div
                              key={index + 6}
                              className="mobile-product-card mobile-touch-feedback"
                              onClick={() => handleProductClick(product)}
                            >
                              <img
                                src={
                                  product.product_image_main ||
                                  (Array.isArray(product.product_image_sub) &&
                                    product.product_image_sub[0]) ||
                                  "/api/placeholder/400/300"
                                }
                                alt={product.product_name || "Product"}
                                className="mobile-product-image"
                                onError={(e) => {
                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='18' fill='%236b7280' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              
                              <h2 className="mobile-product-title">
                                {product.product_name || "Unnamed Product"}
                              </h2>
                              
                              <p className="mobile-product-category">
                                {product.category_name || "Uncategorized"}
                              </p>
                              
                              <div className="mobile-product-price">
                                ₹
                                {(
                                  Number(product.discounted_single_product_price) ||
                                  Number(product.non_discounted_price) ||
                                  0
                                ).toLocaleString()}
                              </div>
                              
                              {product.product_instock === false || product.no_of_product_instock === 0 ? (
                                <div className="text-center text-red-500 text-xs font-medium mt-auto">
                                  Out of Stock
                                </div>
                              ) : (
                                <div className="mobile-product-buttons">
                                  <button 
                                    className="mobile-btn-buy"
                                    onClick={(e) => handleBuyNowClick(e, product)}
                                  >
                                    Buy
                                  </button>
                                  <button 
                                    className="mobile-btn-cart"
                                    onClick={(e) => {
                                      handleAddToCart(e, product);
                                      toast.success("Added!", {
                                        position: "top-right",
                                        autoClose: 1000,
                                      });
                                    }}
                                  >
                                    Cart
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Third Row - Horizontal Scroll for remaining products */}
                    {getPaginatedProducts().length > 12 && (
                      <>
                        <div className="mobile-row-separator"></div>
                        <div className="mobile-section-header">All Products</div>
                        <div className="mobile-product-container mobile-scroll">
                          {getPaginatedProducts().slice(12, 24).map((product, index) => (
                            <div
                              key={index + 12}
                              className="mobile-product-card mobile-touch-feedback"
                              onClick={() => handleProductClick(product)}
                            >
                              <img
                                src={
                                  product.product_image_main ||
                                  (Array.isArray(product.product_image_sub) &&
                                    product.product_image_sub[0]) ||
                                  "/api/placeholder/400/300"
                                }
                                alt={product.product_name || "Product"}
                                className="mobile-product-image"
                                onError={(e) => {
                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='18' fill='%236b7280' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              
                              <h2 className="mobile-product-title">
                                {product.product_name || "Unnamed Product"}
                              </h2>
                              
                              <p className="mobile-product-category">
                                {product.category_name || "Uncategorized"}
                              </p>
                              
                              <div className="mobile-product-price">
                                ₹
                                {(
                                  Number(product.discounted_single_product_price) ||
                                  Number(product.non_discounted_price) ||
                                  0
                                ).toLocaleString()}
                              </div>
                              
                              {product.product_instock === false || product.no_of_product_instock === 0 ? (
                                <div className="text-center text-red-500 text-xs font-medium mt-auto">
                                  Out of Stock
                                </div>
                              ) : (
                                <div className="mobile-product-buttons">
                                  <button 
                                    className="mobile-btn-buy"
                                    onClick={(e) => handleBuyNowClick(e, product)}
                                  >
                                    Buy
                                  </button>
                                  <button 
                                    className="mobile-btn-cart"
                                    onClick={(e) => {
                                      handleAddToCart(e, product);
                                      toast.success("Added!", {
                                        position: "top-right",
                                        autoClose: 1000,
                                      });
                                    }}
                                  >
                                    Cart
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Fourth Row - More horizontal scroll */}
                    {getPaginatedProducts().length > 24 && (
                      <>
                        <div className="mobile-row-separator"></div>
                        <div className="mobile-section-header">Trending Now</div>
                        <div className="mobile-product-container mobile-scroll">
                          {getPaginatedProducts().slice(24, 36).map((product, index) => (
                            <div
                              key={index + 24}
                              className="mobile-product-card mobile-touch-feedback"
                              onClick={() => handleProductClick(product)}
                            >
                              <img
                                src={
                                  product.product_image_main ||
                                  (Array.isArray(product.product_image_sub) &&
                                    product.product_image_sub[0]) ||
                                  "/api/placeholder/400/300"
                                }
                                alt={product.product_name || "Product"}
                                className="mobile-product-image"
                                onError={(e) => {
                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='18' fill='%236b7280' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              
                              <h2 className="mobile-product-title">
                                {product.product_name || "Unnamed Product"}
                              </h2>
                              
                              <p className="mobile-product-category">
                                {product.category_name || "Uncategorized"}
                              </p>
                              
                              <div className="mobile-product-price">
                                ₹
                                {(
                                  Number(product.discounted_single_product_price) ||
                                  Number(product.non_discounted_price) ||
                                  0
                                ).toLocaleString()}
                              </div>
                              
                              {product.product_instock === false || product.no_of_product_instock === 0 ? (
                                <div className="text-center text-red-500 text-xs font-medium mt-auto">
                                  Out of Stock
                                </div>
                              ) : (
                                <div className="mobile-product-buttons">
                                  <button 
                                    className="mobile-btn-buy"
                                    onClick={(e) => handleBuyNowClick(e, product)}
                                  >
                                    Buy
                                  </button>
                                  <button 
                                    className="mobile-btn-cart"
                                    onClick={(e) => {
                                      handleAddToCart(e, product);
                                      toast.success("Added!", {
                                        position: "top-right",
                                        autoClose: 1000,
                                      });
                                    }}
                                  >
                                    Cart
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {/* Load More Button */}
                    {getPaginatedProducts().length > 36 && (
                      <button
                        onClick={() => {
                          navigate('/allproducts');
                        }}
                        className="mobile-load-more"
                      >
                        View All {displayedProducts.length} Products
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full py-2 text-center">
                    <div className="bg-white rounded-xl p-8 mx-4">
                      <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-400"
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
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Try adjusting your filters
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="bg-[#f7941d] text-white px-4 py-2 rounded-full text-sm font-medium"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Pagination */}
              <div className="hidden md:block">
                {displayedProducts.length > productsPerPage && (
                  <div className="flex justify-end mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from(
                      {
                        length: Math.ceil(
                          displayedProducts.length / productsPerPage
                        ),
                      },
                      (_, i) => i + 1
                    )
                      .filter(
                        (page) =>
                          page === 1 ||
                          page ===
                            Math.ceil(
                              displayedProducts.length / productsPerPage
                            ) ||
                          Math.abs(page - currentPage) <= 1
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg text-sm ${
                              currentPage === page
                                ? "bg-[#1e3473] text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(
                              displayedProducts.length / productsPerPage
                            )
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(displayedProducts.length / productsPerPage)
                      }
                      className={`px-3 py-2 rounded-lg text-sm ${
                        currentPage ===
                        Math.ceil(displayedProducts.length / productsPerPage)
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
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
