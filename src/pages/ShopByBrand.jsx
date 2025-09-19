import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../utils/LoadingSpinner";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaMicrochip,
  FaRobot,
  FaSatellite,
  FaCogs,
  FaBolt,
  FaTools,
  FaCube,
  FaShieldAlt,
} from "react-icons/fa";

const backend = import.meta.env.VITE_BACKEND;

const ShopByBrand = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // ✅ Brands from screenshot
  const brands = [
    "AMAS",
    "Emax",
    "Raspberry Pi",
    "Genric",
    "FlyCat",
    "Readytosky",
    "Generic",
    "Pixhawk",
    "SG90 Tower Pro",
    "Tower Pro",
    "ReadyToSky",
  ];

  // Brand icons mapping
  const brandIcons = {
    AMAS: FaMicrochip,
    Emax: FaBolt,
    "Raspberry Pi": FaCube,
    Genric: FaTools,
    FlyCat: FaSatellite,
    Readytosky: FaRobot,
    Generic: FaCogs,
    Pixhawk: FaShieldAlt,
    "SG90 Tower Pro": FaRobot,
    "Tower Pro": FaTools,
    ReadyToSky: FaSatellite,
  };

  // Fetch all products
  async function fetchAllProducts() {
    try {
      setLoading(true);
      const response = await axios.post(`${backend}/product/list`, {
        pageNum: 1,
        pageSize: 100,
        filters: {},
      });
      if (response.data.status === "Success") {
        setAllProducts(response.data.data.productList);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllProducts();
    window.scrollTo(0, 0);
  }, []);

  // ✅ Brand filter logic
  const filteredProducts =
    selectedBrands.length === 0
      ? allProducts
      : allProducts.filter((product) =>
          selectedBrands.includes(product.brand_name?.trim())
        );

  // Group by brand
  const brandProducts = filteredProducts.reduce((acc, product) => {
    if (product.brand_name) {
      if (!acc[product.brand_name]) {
        acc[product.brand_name] = [];
      }
      acc[product.brand_name].push(product);
    }
    return acc;
  }, {});

  const handleToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleClear = () => {
    setSelectedBrands([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1e3473] mb-4">
            Shop By Brand
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select your favorite brands and explore products instantly.
          </p>
        </div>

        {/* ✅ Filter by Brand Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-white bg-[#1e3473] px-6 py-3 w-full rounded-3xl mb-4">
            Filter by Brand
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {brands.map((brand, idx) => {
              const IconComponent = brandIcons[brand] || FaCogs;
              return (
                <label
                  key={idx}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedBrands.includes(brand)
                      ? "bg-[#1e3473] text-white shadow-lg"
                      : "bg-white border border-gray-200 hover:border-[#1e3473]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleToggle(brand)}
                  />
                  <IconComponent className="text-lg flex-shrink-0" />
                  <span className="font-medium">{brand}</span>
                </label>
              );
            })}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* ✅ Products Grid by Brand */}
        <div className="grid grid-cols-1 gap-8">
          {Object.entries(brandProducts).map(([brand, products]) => (
            <div key={brand} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#1e3473] flex items-center gap-3">
                  {brand}
                  <span className="text-sm bg-[#1e3473] text-white px-3 py-1 rounded-full">
                    {products.length} Products
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition flex flex-col group"
                  >
                    <div className="relative flex justify-center mb-4 overflow-hidden rounded-lg bg-white p-2">
                      <img
                        src={product.product_image_main}
                        alt={product.product_name}
                        className="w-32 h-32 object-contain transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-[#1e3473] font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#f7941d] transition-colors">
                        {product.product_name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {product.category_name}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center mb-2">
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

                      <div className="mt-auto">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-[#1e3473]">
                            ₹
                            {product.discounted_single_product_price?.toLocaleString()}
                          </p>
                          {product.non_discounted_price >
                            product.discounted_single_product_price && (
                            <p className="text-sm text-gray-500">
                              <span className="line-through">
                                ₹
                                {product.non_discounted_price?.toLocaleString()}
                              </span>
                            </p>
                          )}
                        </div>
                        {product.discount_percentage > 0 && (
                          <p className="text-green-600 text-sm font-medium">
                            {product.discount_percentage}% off
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(brandProducts).length === 0 && (
            <p className="text-center text-gray-600">
              No products available for selected brand(s).
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopByBrand;
