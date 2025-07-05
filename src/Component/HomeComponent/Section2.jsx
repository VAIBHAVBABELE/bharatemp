import React, { useState, useEffect } from "react";
import { IoBagOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import image1 from "../../assets/homepage1.webp";
import image2 from "../../assets/homepage2.webp";
import image3 from "../../assets/homepage3.webp";
import image4 from "../../assets/homepage4.webp";
import droneImage from "../../assets/homeleft.webp";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { handleBuyNow } from "../../utils/paymentUtils";

// Default fallback images
import fallbackImage1 from "../../assets/homepage1.webp";
import fallbackImage2 from "../../assets/homepage2.webp";
import fallbackImage3 from "../../assets/homepage3.webp";
import fallbackImage4 from "../../assets/homepage4.webp";

const fallbackImages = [
  fallbackImage1,
  fallbackImage2,
  fallbackImage3,
  fallbackImage4,
];

const categories = [
  "Top 30",
  // "Propellers",
  // "Battery",
  // "Wings",
  // "Stand",
  // "Camera",
];

// Fallback products if API fails or props are not passed
const fallbackProducts = [
  {
    _id: "fallback1",
    name: "DJI Battery",
    brand: "DJI Mini",
    category: "Battery",
    price: 4029.5,
    oldPrice: 8029.5,
    tag: "Buy Now",
    tags: "Add to cart",
    image: fallbackImage1,
  },
  {
    _id: "fallback2",
    name: "TVT Cam",
    brand: "Camera",
    category: "Camera",
    price: 4029.5,
    oldPrice: 9099.5,
    tag: "Buy Now",
    tags: "Add to cart",
    image: fallbackImage2,
  },
  {
    _id: "fallback3",
    name: "Omni Cam",
    brand: "Camera",
    category: "Camera",
    price: 3529.5,
    oldPrice: 6029.5,
    tag: "Buy Now",
    tags: "Add to cart",
    image: fallbackImage3,
  },
  {
    _id: "fallback4",
    name: "Mi Air3s",
    brand: "Airpod",
    category: "Propellers",
    price: 4029.5,
    oldPrice: 8029.5,
    tag: "Buy Now",
    tags: "Add to cart",
    image: fallbackImage4,
  },
];



export default function DronePartsCarousel({ products = [] }) {
  const [activeCategory, setActiveCategory] = useState("Top 30");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingBuyNow, setLoadingBuyNow] = useState({});

  const [itemsToShow, setItemsToShow] = useState(3);
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const navigate = useNavigate();

  // Process products from API or use fallback
  const processedProducts =
    products.length > 0
      ? products.map((product, index) => ({
          ...product,
          // Ensure all required fields exist
          category: product.category || "Top 30",
          image: product.image || fallbackImages[index % fallbackImages.length],
          tag: "Buy Now",
          tags: "Add to cart",
        }))
      : fallbackProducts;

  useEffect(() => {
    const updateItemsToShow = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile
        setItemsToShow(1);
      } else if (width >= 640 && width < 1100) {
        // Tablet
        setItemsToShow(2);
      } else if (width >= 1100 && width < 1300) {
        // Desktop
        setItemsToShow(3);
      } else {
        // Desktop
        setItemsToShow(4);
      }
    };

    updateItemsToShow(); // initial check
    window.addEventListener("resize", updateItemsToShow); // resize listener

    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  // Filter based on selected tab
  const filteredProducts =
    activeCategory === "Top 30"
      ? processedProducts
      : processedProducts.filter(
          (product) => product.category === activeCategory
        );

  // Navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= filteredProducts.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, filteredProducts.length - 1) : prevIndex - 1
    );
  };

  // Calculate the visible products (with looping)
  const getVisibleProducts = () => {
    const visibleItems = [];
    const totalItems = filteredProducts.length;

    if (totalItems === 0) return [];

    for (let i = 0; i < Math.min(itemsToShow, totalItems); i++) {
      const index = (currentIndex + i) % totalItems;
      visibleItems.push(filteredProducts[index]);
    }

    return visibleItems;
  };

  // Handle add to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent card click event
    addToCart(product);
  };

  // Handle product click to navigate to details page
  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
    localStorage.setItem("selectedProduct", JSON.stringify(product));
  };

  const handleBuyNowClick = (e, product) => {
  e.stopPropagation(); // Prevent the card click event
  handleBuyNow({
    product,
    quantity: 1,
    navigate,
    setLoadingBuyNow: (loading) => {
      setLoadingBuyNow((prev) => ({ ...prev, [product._id]: loading }));
    },
    customShippingFee: 5,
  });
};

  return (
    <div className="flex flex-col md:flex-row w-full  lg:h-[600px] gap-8 py-16 bg-white font-[Outfit]">
      {/* Left Section */}
      <div
        className="md:w-1/3 w-full bg-gray-50 p-6 rounded-3xl shadow-sm flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${droneImage})` }}
      >
        <div className="bg-opacity-80 p-4 rounded-xl">
          <h2 className="lg:text-3xl md:text-2xl text-xl font-bold text-[#1E3473]">
            Drones Parts
          </h2>
          <p className="text-[#39AEF2] font-semibold lg:text-3xl md:text-2xl text-xl mb-2">
            Parts
          </p>
          <p className="text-[#F7941D] mt-2 text-sm font-medium">
            ENJOY FLYING ALL DAY WITH DJI PHANTOM.
          </p>
        </div>
        <button className="bg-[#1e3473] text-white py-3 px-6 rounded-full font-medium self-start mt-auto md:text-[18px] text-[12px]">
          BROWSE CATEGORY
        </button>
      </div>

      {/* Right Section */}
      <div className="md:w-2/3 w-full overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-4 text-[16px] md:text-[20px] mb-6 border-b pb-2 flex-wrap">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveCategory(item);
                setCurrentIndex(0); // Reset to first slide on category change
              }}
              className={`px-6 py-1 cursor-pointer rounded-full ${
                activeCategory === item
                  ? "border-2  border-[#F7941D] text-gray-800 font-medium"
                  : "text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Carousel Container */}
        <div className="relative mt-8 px-4 w-full">
          {/* Navigation Buttons */}
          {filteredProducts.length > itemsToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 border border-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute  cursor-pointer right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 border border-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Carousel Cards */}
          <div
            className={`grid gap-4 ${
              itemsToShow === 1
                ? "grid-cols-1"
                : itemsToShow === 2
                ? "grid-cols-2"
                : itemsToShow === 3
                ? "grid-cols-3"
                : "grid-cols-4"
            }`}
          >
            {getVisibleProducts().map((product, index) => (
              <div
                key={product._id || index}
                className="group hover:border-2 hover:border-[#c2c2c2] rounded-2xl hover:shadow-lg transition-all duration-500 h-[350px] hover:h-[340px]  py-2 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="p-4 flex flex-col items-start relative h-full">
                  <p className="text-[10px] font-semibold text-[#D9D3D3] mb-1">
                    {product.brand}
                  </p>
                  <h2 className="md:text-[13px] text-[10px] font-bold text-[#1E3473] mb-2">
                    {product.product_name}
                  </h2>
                  <img
                    src={product.product_image_main}
                    alt={product.product_name}
                    className="w-full h-32 object-contain mb-4"
                  />
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <button
                      className="bg-[#f7941d] cursor-pointer text-white font-medium py-1 px-4 rounded-2xl text-sm"
                      onClick={(e) => handleBuyNowClick(e, product)}
                    >
                      {loadingBuyNow[product._id] ? "Buying..." : "Buy Now"}
                    </button>
                    <span
                      className="bg-gray-200 px-3 py-1 text-[12px] text-[#f7941d] rounded-full cursor-pointer"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      {isInCart(product._id)
                        ? `In Cart (${getItemQuantity(product._id)})`
                        : product.tags}
                    </span>
                  </div>
                  <div className="w-full flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <p className="lg:text-[15px] text-[12px] font-bold text-[#000000]">
                        ₹
                        {product.discounted_single_product_price?.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                      <p className="text-sm line-through text-gray-400">
                        ₹{product.non_discounted_price?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex justify-end items-end">
                      <span className="rounded-full group-hover:hidden justify-between py-3 px-3 bg-white border border-[#797979]">
                        <IoBagOutline
                          size={15}
                          className="group-hover:text-white text-black"
                        />
                      </span>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
