import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import shop from "../../assets/shop.png";
// import { servicesData } from "./data";
import { useCart } from "../../context/CartContext";

export default function ProductCard() {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  // Get product data from localStorage when component mounts
  useEffect(() => {
    const fetchProduct = () => {
      // First try to get the product from localStorage
      const selectedProduct = localStorage.getItem('selectedProduct');
      
      if (selectedProduct) {
        const parsedProduct = JSON.parse(selectedProduct);
        // If ID in URL matches the stored product, use that
        if (id && parsedProduct.id.toString() === id) {
          setProduct(parsedProduct);
          return;
        }
      }
      
      // If ID is available, try to find the product in allProducts array
      if (id) {
        // Import or load your products data here
        // For now, we'll use the servicesData as fallback
        const foundProduct = servicesData.find(p => p.id.toString() === id);
        if (foundProduct) {
          setProduct(foundProduct);
          return;
        }
      }
      
      // Fallback to first product if nothing matches
      if (servicesData && servicesData.length > 0) {
        setProduct(servicesData[0]);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Navigate back to products page
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  // Handle Buy Now button
  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      // Navigate to checkout page (create this page later)
      navigate('/cart');
    }
  };

  if (!product) {
    return (
      <div className="p-10 flex justify-center items-center h-screen">
        <div className="text-gray-700 font-semibold">Loading product details...</div>
      </div>
    );
  }

  return (
    <div className="bg-white font-[outfit]">
      {/* Header */}
      <div className="w-full font-[outfit] flex md:flex-row flex-col items-center justify-between text-[#2F294D] text-sm font-medium px-4 py-2 mt-4 ">
        <div className="flex items-center flex-wrap gap-3">
          <button 
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center cursor-pointer bg-[#f7941d] text-white rounded-full"
          >
            <FaArrowLeft size={12} />
          </button>
          <span className="text-base">
            Back to products | Listed in category:{" "}
            <span className="font-semibold">{product.category}</span>
          </span>
          <div className="text-[#2F294D] pl-0 md:pl-10  font-semibold whitespace-nowrap">
          {product.name}
        </div>
        </div>
        
      </div>

      {/* Main Section */}
      <div className="w-full p-4 md:p-6 flex flex-col md:flex-row gap-8 font-[outfit]">
        {/* Left: Images */}
        <div className="w-full md:w-[60%] flex flex-col md:flex-row gap-4 mt-6 pl-0 md:pl-10">
          <div className=" w-full md:h-[450px] flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full  object-contain"
            />
          </div>
          {/* We don't have thumbnails in our product data, but we'll keep the structure */}
          <div className="flex md:flex-col flex-row gap-4">
            {[1, 2, 3,4].map((thumb, i) => (
              <div
                key={i}
                className="w-[70px] h-[60px] md:w-[110px] md:h-[115px] border border-[#E5E7EB] rounded-lg flex items-center justify-center"
              >
                <img 
                  src={product.image} 
                  alt={`${product.name} thumbnail`}
                  className="max-w-full max-h-full object-contain p-2" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-[40%] p-2 md:p-5 space-y-5 text-[#2F294D] font-[outfit]">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-3xl font-bold">{product.name}</h1>
              <span className="bg-gray-100 text-base font-medium px-5 py-2 rounded-full">
                16 Gb
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Free 2 Days Shipping | 1 Year Warranty
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400 text-2xl">
              {Array(5).fill().map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? (
                    <FaStar />
                  ) : i < product.rating ? (
                    <FaStarHalfAlt />
                  ) : (
                    <FaRegStar />
                  )}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-base">
              {product.rating} from {product.reviewCount} Reviews
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3">
            <p className="text-3xl text-[#1e3473] font-bold">
              Rs {Number(product.price).toLocaleString()}
            </p>
            <span className="line-through text-gray-400 text-base">
              ₹{Number(product.originalPrice).toLocaleString()}
            </span>
          </div>

          {/* Model Number */}
          <div className="mt-4">
            <p className="font-semibold mb-3 text-base">Model Number</p>
            <div className="flex gap-3">
              <button className="px-6 py-2 text-base rounded-md bg-[#f7941d] text-white font-medium">
                Hh3
              </button>
              <button className="px-6 py-2 text-base rounded-md border border-gray-300 text-[#2F294D] font-medium">
                Gh2
              </button>
            </div>
          </div>

          

          {/* Features */}
          <div className="space-y-2 text-base mt-3 font-bold">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5  flex items-center text-base justify-center rounded-full border border-gray-400">✓</span>
              Central Processing Unit (CPU)
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5  flex items-center text-base justify-center rounded-full border border-gray-400">✓</span>
              Memory Unit
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5  flex items-center text-base justify-center rounded-full border border-gray-400">✓</span>
              SD Card Slot
            </div>
          </div>

          {/* Sold Info */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://randomuser.me/api/portraits/thumb/men/${i}.jpg`}
                  alt="user"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <p className="text-gray-400 text-base font-bold">
              1,241 Sold in the last 24 hours
            </p>
          </div>

          {/* Buy Now */}
          <div className="flex items-center gap-8 mt-6">
            <button 
              className="w-[250px] bg-[#1E2870] hover:bg-[#283590] text-white py-5 rounded-2xl flex justify-center items-center gap-3"
              onClick={handleBuyNow}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                <path d="M7.5 7.67001V6.70001C7.5 4.45001 9.31 2.24001 11.56 2.03001C14.24 1.77001 16.5 3.88001 16.5 6.51001V7.89001" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.0008 22H15.0008C19.0208 22 19.7408 20.39 19.9508 18.43L20.7008 12.43C20.9708 9.99 20.2708 8 16.0008 8H8.0008C3.7308 8 3.0308 9.99 3.3008 12.43L4.0508 18.43C4.2608 20.39 4.9808 22 9.0008 22Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.4955 12H15.5045" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.49451 12H8.50349" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold">Buy Now</span>
            </button>
            
            <button 
              className={`w-16 h-16 rounded-full border ${isInCart(product.id) ? 'bg-[#f7941d] border-[#f7941d]' : 'border-gray-200'} flex items-center justify-center transition-colors`}
              onClick={handleAddToCart}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-7 h-7 ${isInCart(product.id) ? 'text-white' : 'text-gray-500'}`}>
                <path d="M9.0008 22H15.0008C19.0208 22 19.7408 20.39 19.9508 18.43L20.7008 12.43C20.9708 9.99 20.2708 8 16.0008 8H8.0008C3.7308 8 3.0308 9.99 3.3008 12.43L4.0508 18.43C4.2608 20.39 4.9808 22 9.0008 22Z" stroke={isInCart(product.id) ? "white" : "#666"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 7.67001V6.70001C7.5 4.45001 9.31 2.24001 11.56 2.03001C14.24 1.77001 16.5 3.88001 16.5 6.51001V7.89001" stroke={isInCart(product.id) ? "white" : "#666"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {isInCart(product.id) && (
              <div className="bg-[#f7941d] text-white px-2 py-1 rounded-full text-xs">
                {getItemQuantity(product.id)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

















