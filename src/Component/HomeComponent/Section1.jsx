import { useState } from "react";
import { IoBagOutline } from "react-icons/io5";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { handleBuyNow } from "../../utils/paymentUtils";
import "../../styles/mobile-responsive.css";

import fallbackImage1 from "../../assets/homepage1.webp";
import fallbackImage2 from "../../assets/homepage2.webp";
import fallbackImage3 from "../../assets/homepage3.webp";
import fallbackImage4 from "../../assets/homepage4.webp";
import fallbackImage5 from "../../assets/homepage5.webp";
import fallbackImage6 from "../../assets/homepage6.webp";
import axios from "axios";
import { toast } from "react-toastify";

const backend = import.meta.env.VITE_BACKEND;

const fallbackImages = [
  fallbackImage1,
  fallbackImage2,
  fallbackImage3,
  fallbackImage4,
  fallbackImage5,
  fallbackImage6,
];

const fallbackProducts = [
  {
    _id: "prod1",
    name: "Mark 34",
    brand: "Battery",
    price: 4029.5,
    oldPrice: 8029.5,
    tag: "BUY NOW",
    tags: "Add to cart",
    image: fallbackImage1,
    rating: 4.5,
    reviewCount: 23,
  },
  {
    _id: "prod2",
    name: "RedBoard Plus",
    brand: "Spark Fun",
    price: 73529.5,
    oldPrice: 8029.5,
    tag: "BUY NOW",
    tags: "Add to cart",
    image: fallbackImage2,
    rating: 4,
    reviewCount: 15,
  },
];

const ProductSlider = ({ products = [] }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("You may also like");
  const [loadingBuyNow, setLoadingBuyNow] = useState({});
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const navigate = useNavigate();

  const getTabs = () => {
    if (location.pathname === "/") {
      return ["Trending Products", "Offers", "New Arrivals"];
    } else if (location.pathname.includes("/product")) {
      return ["You may also like", "Offer", "Recommended for you"];
    }
    return ["You may also like", "Offer", "Recommended for you"];
  };

  const tabs = getTabs();

  const allProducts =
    products.length > 0
      ? products.map((product, index) => ({
          ...product,
          image: product.image || fallbackImages[index % fallbackImages.length],
          rating: product.rating || 4,
          reviewCount: product.reviewCount || 15,
          tags: "Add to cart",
        }))
      : fallbackProducts;

  const getFilteredProducts = () => {
    if (activeTab === "Offers" || activeTab === "Offer") {
      return allProducts
        .filter((product) => product.discount && product.discount > 0)
        .sort((a, b) => (b.discount || 0) - (a.discount || 0))
        .slice(0, 5);
    }

    if (activeTab === "New Arrivals") {
      return allProducts
        .sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at);
          const dateB = new Date(b.updated_at || b.created_at);
          return dateB - dateA;
        })
        .slice(0, 5);
    }

    if (activeTab === "Recommended for you") {
      return allProducts
        .sort((a, b) => (b.review_stars || 0) - (a.review_stars || 0))
        .slice(0, 5);
    }

    return allProducts.slice(0, 5);
  };

  const filteredProducts = getFilteredProducts();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow2 = async (e, product) => {
    e.stopPropagation();
    toast.dismiss();
    window.location.href = `/checkout`;
  };

  const handlePaymentSuccess = async (response) => {
    try {
      const verifyResponse = await axios.post(
        `${backend}/verify-magic-checkout-payment`,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }
      );

      if (verifyResponse.data.success) {
        alert("Payment successful!");
      } else {
        alert("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      alert("Payment verification failed");
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
    localStorage.setItem("selectedProduct", JSON.stringify(product));
  };

  return (
    // ✅ margin 2 - mt-2
    <div className="h-auto xl:h-[500px] mt-2">
      {/* Tabs */}
      <div className="border-b border-[#797979] flex items-center justify-between mb-2">
        <div className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium cursor-pointer lg:text-[20px] md:text-[13px] text-[13px] relative ${
                activeTab === tab ? "text-[#333333]" : "text-gray-500"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute left-0 -bottom-0.5 w-full h-1 bg-orange-400 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Product Grid */}
      {/* ✅ gap 2 - gap-2 */}
      <div className="hidden md:grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 pb-2 scrollbar-hide">
        {filteredProducts.slice(0, 5).map((product, index) => (
          <div
            key={product._id || index}
            onClick={() => handleProductClick(product)}
            className="group border rounded-2xl shadow-sm hover:shadow-lg transition-all scale-100 border-[#f3f3f3] hover:border-2 hover:border-[#c2c2c2] duration-700 lg:h-[330px] hover:h-[380px] h-[350px] cursor-pointer"
          >
            <div className="p-4 flex flex-col items-start relative">
              <p className="text-[14px] font-semibold text-[#D9D3D3] mb-1 group-hover:hidden block">
                {product.brand}
              </p>
              <h2 className="text-[13px] font-bold text-[#1E3473] group-hover:hidden block mb-4">
                {product.product_name}
              </h2>
              <img
                src={product.product_image_main}
                alt={product.brand_name}
                className="w-full h-32 object-contain mb-4"
              />
              <h2 className="text-[16px] font-bold text-[#1E3473] group-hover:block hidden mb-4">
                {product.brand_name}
                <p className="text-[14px] font-semibold text-[#D9D3D3] mb-1 group-hover:block hidden">
                  {product.brand}
                </p>
                <div className="items-center group-hover:flex hidden my-3">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <span key={i} className="text-orange-400">
                        {i < Math.floor(product.review_stars) ? (
                          <FaStar />
                        ) : i < product.rating ? (
                          <FaStarHalfAlt />
                        ) : (
                          <FaRegStar />
                        )}
                      </span>
                    ))}
                  <span className="text-gray-600 ml-1 text-sm">
                    ({product.no_of_reviews})
                  </span>
                </div>
                <div className="items-center gap-2 group-hover:flex hidden">
                  <p className="lg:text-[17px] text-[12px] font-bold text-[#000000]">
                    ₹
                    {product.discounted_single_product_price?.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                  <p className="text-sm line-through text-gray-400">
                    ₹{product.non_discounted_price?.toLocaleString("en-IN")}
                  </p>
                </div>
              </h2>

              <div className="flex items-center flex-wrap gap-2 mb-2">
                <button
                  className="bg-[#f7941d] cursor-pointer text-white font-medium py-1 px-4 rounded-2xl text-sm"
                  onClick={(e) => handleBuyNow2(e, product)}
                >
                  {loadingBuyNow[product._id] ? "Buying..." : "Buy Now"}
                </button>
                <span
                  className="bg-gray-200 text-[#f7941d] px-3 rounded-full cursor-pointer"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  {isInCart(product._id)
                    ? `In Cart (${getItemQuantity(product._id)})`
                    : product.tags}
                </span>
              </div>

              <div className="w-full flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 group-hover:hidden mb-2">
                  <p className="lg:text-[17px] text-[12px] font-bold text-[#000000]">
                    ₹
                    {product.discounted_single_product_price?.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                  <p className="text-sm line-through text-gray-400">
                    ₹{product.non_discounted_price?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <hr />
              <div className="absolute -bottom-8 gap-1 left-0 w-full bg-white text-[#5D5D5D] px-2 py-2 flex justify-between items-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-900 rounded-b-2xl">
                <div className="text-[14px] text-[#ABA1A1] font-[outfit]">
                  Get it <span className="text-black">Friday,</span> Jan 18
                  <br />
                  <span className="mr-1"> FREE Delivery</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Products Horizontal Scroll */}
      <div className="md:hidden mobile-product-container mobile-scroll">
        {filteredProducts.slice(0, 8).map((product, index) => (
          <div
            key={product._id || index}
            onClick={() => handleProductClick(product)}
            className="mobile-product-card mobile-touch-feedback"
          >
            <img
              src={product.product_image_main}
              alt={product.product_name}
              className="mobile-product-image"
              onError={(e) => {
                e.target.src = fallbackImages[index % fallbackImages.length];
              }}
            />
            <h2 className="mobile-product-title">{product.product_name}</h2>
            <p className="mobile-product-category">
              {product.brand_name || product.brand}
            </p>
            <div className="mobile-product-price">
              ₹{product.discounted_single_product_price?.toLocaleString()}
            </div>

            {product.product_instock === false ||
            product.no_of_product_instock === 0 ? (
              <div className="text-center text-red-500 text-xs font-medium mt-auto">
                Out of Stock
              </div>
            ) : (
              <div className="mobile-product-buttons">
                <button
                  className="mobile-btn-buy"
                  onClick={(e) => handleBuyNow2(e, product)}
                >
                  {loadingBuyNow[product._id] ? "Buying..." : "Buy"}
                </button>
                <button
                  className="mobile-btn-cart"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  {isInCart(product._id)
                    ? `In Cart (${getItemQuantity(product._id)})`
                    : "Cart"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;