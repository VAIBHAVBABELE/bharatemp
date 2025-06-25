import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import shop from "../../assets/shop.png";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Section1 from "../HomeComponent/Section1";
import { fetchProducts } from "../../utils/api";
import SideCart from "./SideCart";
import ProductDetailsModal from "./ProductDetailsModal";
import { toast } from "react-toastify";
import Customers from "../B2bComponent/Customers";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { jwtDecode } from "jwt-decode";
const backend = import.meta.env.VITE_BACKEND;

// Function to calculate dynamic bulk prices based on product price
const calculateBulkPrices = (basePrice) => {
  return [
    {
      range: "5-10",
      price: parseFloat((basePrice * 0.95).toFixed(2)), // 5% discount
      key: "multiple_quantity_price_5_10",
    },
    {
      range: "10-20",
      price: parseFloat((basePrice * 0.9).toFixed(2)), // 10% discount
      key: "multiple_quantity_price_10_20",
    },
    {
      range: "20-50",
      price: parseFloat((basePrice * 0.85).toFixed(2)), // 15% discount
      key: "multiple_quantity_price_20_50",
    },
    {
      range: "50-100",
      price: parseFloat((basePrice * 0.8).toFixed(2)), // 20% discount
      key: "multiple_quantity_price_50_100",
    },
    {
      range: "100+",
      price: parseFloat((basePrice * 0.75).toFixed(2)), // 25% discount
      key: "multiple_quantity_price_100_plus",
    },
  ];
};

export default function ProductCard() {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showBulkOrder, setShowBulkOrder] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [bulkOrderForm, setBulkOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedBulkRange, setSelectedBulkRange] = useState(null);
  const [selectedBulkPrice, setSelectedBulkPrice] = useState(null);
  const [bulkQuantity, setBulkQuantity] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [bulkPrices, setBulkPrices] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Fetch from API
        const response = await axios.get(`${backend}/product/${id}`);

        if (response.data.status === "Success" && response.data.data.product) {
          setProduct(response.data.data.product);
        } else {
          // If API doesn't return a product, try getting from localStorage as fallback
          const selectedProduct = localStorage.getItem("selectedProduct");
          if (selectedProduct) {
            const parsedProduct = JSON.parse(selectedProduct);
            setProduct(parsedProduct);
          } else {
            setError("Product not found");
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);

        // Try to get from localStorage as fallback
        const selectedProduct = localStorage.getItem("selectedProduct");
        if (selectedProduct) {
          const parsedProduct = JSON.parse(selectedProduct);
          setProduct(parsedProduct);
        } else {
          setError("Failed to load product data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch products from the backend
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    getProducts();
  }, []);

  // Navigate back to products page
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSubmitReview = () => {
    if (reviewText.trim() === "") {
      toast.error("Please enter a review");
      return;
    }
    // Handle review submission
    toast.success("Review submitted successfully");
    setReviewText("");
    setRating(0);
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      const regularItem = {
        ...product,
        quantity: quantity,
        price: product.discounted_single_product_price,
        total: product.discounted_single_product_price * quantity,
        isBulkOrder: false,
      };
      addToCart(regularItem);
      toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart`);
      setShowCart(true);
    }
  };

  // Handle Buy Now button
  const handleBuyNow = async () => {
    if (!product) return;

    // Check if product is in stock
    if (!product.product_instock) {
      toast.error("Product is out of stock");
      return;
    }

    // Check if requested quantity is available
    if (product.no_of_product_instock && quantity > product.no_of_product_instock) {
      toast.error(`Only ${product.no_of_product_instock} items available in stock`);
      return;
    }

    try {
      // Get token from localStorage
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      // Parse token if stored as JSON string
      const parsedToken = storedToken.startsWith('"')
        ? JSON.parse(storedToken)
        : storedToken;

      const decoded = jwtDecode(parsedToken);
      const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;

      if (!userId) {
        toast.error("Authentication failed");
        navigate("/login");
        return;
      }

      // Get user details
      const userResponse = await axios.get(`${backend}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${parsedToken}`,
        },
      });

      if (!userResponse.data || !userResponse.data.data || !userResponse.data.data.user) {
        throw new Error("Failed to fetch user details");
      }

      const userData = userResponse.data.data.user;

      // Calculate expected delivery date (3-4 days from now)
      const expectedDelivery = new Date();
      expectedDelivery.setDate(expectedDelivery.getDate() + 4);

      // Prepare order item
      const orderItem = {
        product_id: product._id,
        quantity: quantity,
        product_name: product.product_name,
        product_sku: product.SKU,
        product_price: product.discounted_single_product_price,
        product_tax_rate: "0",
        product_hsn_code: "0",
        product_discount: "0",
        product_img_url: product.product_image_main,
      };
  

      // Calculate total price
      const shippingFee = 5;
      const codeDiscount = 15;
      const totalPrice = Math.max(
        0,
        (product.discounted_single_product_price * quantity) + shippingFee - codeDiscount
      );

      // Prepare order data
      const orderData = {
        user_id: userId,
        products: [orderItem],
        totalPrice: totalPrice,
        shippingAddress: userData.address?.[0] || "",
        shippingCost: shippingFee,
        email: userData.email,
        pincode: userData.address?.[0]?.match(/\b\d{6}\b/)?.[0] || "000000",
        name:  userData ? `${userData.name}` : "",
        city: userData.address?.[0]?.split(",").slice(-2, -1)[0]?.trim() || "City",
        expectedDelivery: expectedDelivery,
      };


      // Create the order
      const orderResponse = await axios.post(
        `${backend}/order/new`,
        {
          order: orderData,
        },
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
          },
        }
      );


      if (
        !orderResponse.data ||
        !orderResponse.data.data ||
        !orderResponse.data.data.order._id
      ) {
        throw new Error("Failed to create order");
      }

      const createdOrderId = orderResponse.data.data.order._id;


      // Initiate Cashfree payment
      const FRONTEND_URL = window.location.origin + "/payment-status/";

      const paymentData = {
        orderId: createdOrderId,
        userId: userId,
        FRONTEND_URL: FRONTEND_URL
      };

      const paymentResponse = await axios.post(
        `${backend}/payment/create-cashfree-payment`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            "Content-Type": "application/json",
          },
        }
      );


      if (paymentResponse.data?.data?.response?.cashfreeResponse?.paymentLink) {
        // Redirect to Cashfree payment page
        window.location.href = paymentResponse.data.data.response.cashfreeResponse.paymentLink;
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (error) {
      console.error("Payment error:", error);
      let errorMessage = "Failed to process payment";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const incrementQuantity = () => {
    if (product.no_of_product_instock && quantity >= product.no_of_product_instock) {
      toast.error(`Only ${product.no_of_product_instock} items available in stock`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleBulkOrderClick = () => {
    setShowBulkOrder(true);
  };

  const handleCloseBulkOrder = () => {
    setShowBulkOrder(false);
  };

  const handleBulkOrderSubmit = (e) => {
    e.preventDefault();
    // Handle bulk order submission
    setShowBulkOrder(false);
  };

  const handleBulkOrderInputChange = (e) => {
    setBulkOrderForm({
      ...bulkOrderForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleBulkRangeSelect = (range, price) => {
    setSelectedBulkRange(range);
    setSelectedBulkPrice(price);
    // Set initial quantity to MAXIMUM of range
    const maxQuantity = range.includes("+")
      ? range.split("+")[0] // For "100+", use 100 as the initial value
      : range.split("-")[1]; // For "10-100", use 100
    setBulkQuantity(parseInt(maxQuantity));
  };

  // Update bulk prices when product changes
  useEffect(() => {
    if (product && product.discounted_single_product_price) {
      const prices = calculateBulkPrices(
        product.discounted_single_product_price
      );
      setBulkPrices(prices);
    }
  }, [product]);

  const handleBulkAddToCart = () => {
    if (selectedBulkRange && selectedBulkPrice && product && bulkQuantity > 0) {
      // Parse the range values
      let minQty, maxQty;
      if (selectedBulkRange.includes("+")) {
        minQty = parseInt(selectedBulkRange.split("+")[0]);
        maxQty = Infinity;
      } else {
        [minQty, maxQty] = selectedBulkRange
          .split("-")
          .map((num) => parseInt(num));
      }

      // Validate quantity
      if (
        bulkQuantity >= minQty &&
        (maxQty === Infinity || bulkQuantity <= maxQty)
      ) {
        const bulkItem = {
          ...product,
          quantity: bulkQuantity,
          price: selectedBulkPrice,
          totalPrice: selectedBulkPrice * bulkQuantity,
        };
        addToCart(bulkItem);
        setShowBulkOrder(false);
        setShowCart(true);
      } else {
        toast.error(
          `Please enter a quantity between ${minQty} and ${
            maxQty === Infinity ? "∞" : maxQty
          }`
        );
      }
    }
  };

  const handleBulkBuyNow = () => {
    if (selectedBulkRange && selectedBulkPrice && product && bulkQuantity > 0) {
      // Parse the range values
      let minQty, maxQty;
      if (selectedBulkRange.includes("+")) {
        minQty = parseInt(selectedBulkRange.split("+")[0]);
        maxQty = Infinity;
      } else {
        [minQty, maxQty] = selectedBulkRange
          .split("-")
          .map((num) => parseInt(num));
      }

      // Validate quantity
      if (
        bulkQuantity >= minQty &&
        (maxQty === Infinity || bulkQuantity <= maxQty)
      ) {
        const bulkItem = {
          ...product,
          quantity: bulkQuantity,
          price: selectedBulkPrice,
          total: selectedBulkPrice * bulkQuantity,
          isBulkOrder: true,
          bulkRange: selectedBulkRange,
          originalPrice: product.discounted_single_product_price,
        };
        addToCart(bulkItem);
        setShowBulkOrder(false);
        navigate("/cart");
      } else {
        toast.error(
          `Please enter a quantity between ${minQty} and ${
            maxQty === Infinity ? "∞" : maxQty
          }`
        );
      }
    }
  };

  // Add this new function to check delivery availability
  const checkDeliveryAvailability = async () => {
    if (!zipcode || zipcode.length !== 6) {
      toast.error("Please enter a valid 6-digit zipcode");
      return;
    }

    setCheckingDelivery(true);
    try {
      // Replace this with your actual API endpoint
      const response = await axios.get(`${backend}/check-delivery/${zipcode}`);
      if (response.data.available) {
        setDeliveryStatus(true);
        toast.success("Delivery available in your area!");
      } else {
        setDeliveryStatus(false);
        toast.error("Sorry, delivery not available in your area");
      }
    } catch (error) {
      console.error("Error checking delivery:", error);
      toast.error("Error checking delivery availability");
      setDeliveryStatus(false);
    } finally {
      setCheckingDelivery(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col justify-center items-center h-screen">
        <LoadingSpinner />
        <div className="text-gray-700 font-semibold">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 font-semibold mb-4">{error}</div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-[#1e3473] text-white rounded-lg"
        >
          Go Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 flex justify-center items-center h-screen">
        <div className="text-gray-700 font-semibold">Product not found</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 font-[outfit] relative">
      {/* Breadcrumb Navigation */}
      <div className="w-full font-[outfit] pb-10 flex md:flex-row flex-col items-center justify-between text-[#2F294D] text-sm font-medium px-4 py-2 mt-4 ">
        <div className="flex items-center flex-wrap gap-3">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center cursor-pointer bg-[#f7941d] text-white rounded-full"
          >
            <FaArrowLeft size={12} />
          </button>
          <span className="text-base">
            Back to products | Listed in category:{" "}
            <Link to="/product" className="font-semibold hover:text-[#f7941d]">
              All Products
            </Link>
          </span>
          <div className="text-[#2F294D] pl-0 md:pl-10 font-semibold whitespace-nowrap">
            Single Product Page
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col gap-10 justify-between lg:flex-row">
        {/* Left: Product Images */}
        <div className="w-full lg:w-[45%]">
          <div className="bg-white rounded-lg mb-4">
            <img
              src={product.product_image_main}
              alt={product.product_name}
              className="w-full h-[400px] object-contain"
            />
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-[#1e3473]"
              >
                <img
                  src={
                    product.product_image_sub &&
                    product.product_image_sub[index - 1]
                      ? product.product_image_sub[index - 1]
                      : shop
                  }
                  alt={`${product.product_name} thumbnail ${index}`}
                  className="w-full h-[100px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full lg:w-[45%] space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2F294D]">
              {product.product_name}
              <span className="ml-4 inline-block px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-full">
                {product.product_instock ? "In stock" : "Out of stock"}
              </span>
            </h1>
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-[#FFB800]">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(product.review_stars) ? (
                      <FaStar className="w-5 h-5" />
                    ) : i < product.review_stars ? (
                      <FaStarHalfAlt className="w-5 h-5" />
                    ) : (
                      <FaRegStar className="w-5 h-5" />
                    )}
                  </span>
                ))}
            </div>
            <span className="text-gray-600">{product.review_stars}</span>
            <span className="text-gray-400">
              from {product.no_of_reviews} Reviews
            </span>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="text-gray-500 text-sm">
              ₹2345 (incl. of all taxes)
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#162554]">
                ₹
                {product.discounted_single_product_price?.toLocaleString(
                  "en-IN"
                )}
              </span>
              <span className="text-sm text-gray-500">+₹41 Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through">
                MRP ₹{product.non_discounted_price?.toLocaleString("en-IN")}
              </span>
              <span className="text-[#F7941D] font-medium">
                {product.discount}% Off
              </span>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                className="px-6 py-2 bg-[#F7941D] cursor-pointer text-white rounded-3xl"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBulkOrderClick}
                className="px-6 py-2 bg-[#F7941D] cursor-pointer text-white rounded-3xl"
              >
                Bulk Orders
              </button>
            </div>

            {/* Add Quantity Selector */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center ">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className={`w-10 h-10 flex border border-gray-300 items-center justify-center rounded-full text-xl font-bold transition-colors ${
                    quantity <= 1
                      ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                      : "text-[#1e3473] bg-white hover:bg-[#f7e3c1] cursor-pointer"
                  }`}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) {
                      setQuantity(value);
                    }
                  }}
                  className="w-12 mx-2 text-center py-1 text-lg font-bold bg-transparent border-none focus:outline-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold text-[#1e3473] border border-gray-300 bg-white hover:bg-[#f7e3c1] cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-5 items-center">
              <button
                onClick={handleBuyNow}
                className="w-[200px] bg-[#1e3473] text-white py-3 rounded-2xl cursor-pointer font-medium hover:bg-[#162554] transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M4 11h16M4 11a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7z"
                    strokeWidth="2"
                  />
                  <path d="M8 11V7a4 4 0 018 0v4" strokeWidth="2" />
                </svg>
                Buy Now
              </button>

              {/* Add Zipcode Check Section */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={zipcode}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setZipcode(value);
                      if (value.length !== 6) {
                        setDeliveryStatus(null);
                      }
                    }}
                    placeholder="Enter ZIP code"
                    className="w-[150px] px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#1e3473] text-sm"
                  />
                  {deliveryStatus !== null && (
                    <div className="absolute -bottom-6 left-0 text-xs">
                      {deliveryStatus ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Delivery Available
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Delivery Not Available
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={checkDeliveryAvailability}
                  disabled={zipcode.length !== 6 || checkingDelivery}
                  className={`px-4 py-3 rounded-2xl font-medium flex items-center gap-2 ${
                    zipcode.length === 6 && !checkingDelivery
                      ? "bg-[#f7941d] text-white hover:bg-[#e88a1a]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } transition-colors`}
                >
                  {checkingDelivery ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Delivery"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {product.product_overview ? (
              product.product_overview
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {" "}
                    {/* Changed to items-start */}
                    <div className="flex-shrink-0 pt-0.5">
                      {" "}
                      {/* Wrapper for SVG to prevent shrinking */}
                      <svg
                        className="w-5 h-5 text-[#1e3473] flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 flex-1 break-words">
                      {feature.trim()}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No overview available</p>
            )}
          </div>

          {/* Service Info */}
          <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDIyczgtNCA4LTEwVjVsLTgtMy04IDN2N2MwIDYgOCAxMCA4IDEweiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4="
                alt="Transparent"
                className="w-6 h-6"
              />
              <div className="flex flex-col">
                <span className="font-medium">Transparent</span>
                <span>100% Genuine Products </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgMTJoMTRNMTIgNWw3IDctNyA3IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg=="
                alt="Shipping"
                className="w-6 h-6"
              />
              <div className="flex flex-col">
                <span className="font-medium">Shipping</span>
                <span>One Day delivery </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTJsMiAyIDQtNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4="
                alt="Secure"
                className="w-6 h-6"
              />
              <div className="flex flex-col">
                <span className="font-medium">Secure</span>
                <span>24*7 Technical support </span>
              </div>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="flex items-center gap-2">
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
            <span className="text-gray-500 text-base font-semibold">
              1,241 Sold in the last 24 hours
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#2F294D]">Description</h2>
            <p className="text-gray-500 mb-2 text-base font-semibold">
              {product.product_description}
            </p>
            <button
              onClick={() => setShowDetailsModal(true)}
              className="bg-[#1e3473] text-white px-4 py-2 rounded-xl font-medium mb-4"
            >
              More Details
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Order Sidebar */}
      {showBulkOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={handleCloseBulkOrder}
          />

          <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white z-50 shadow-xl rounded-l-3xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-[#1e3473]">
                    Bulk Order Discounts
                  </h2>
                  <button
                    onClick={handleCloseBulkOrder}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <p className="text-gray-600 text-sm">
                  Select quantity range for bulk pricing
                </p>
              </div>

              {/* Price Table Header */}
              <div className="px-6">
                <div className="bg-[#1e3473] text-white px-6 py-2 grid grid-cols-4 text-sm rounded-xl">
                  <span className="col-span-1">Select</span>
                  <span className="col-span-1 text-center">Quantity</span>
                  <span className="col-span-2 text-center">Price per unit</span>
                </div>
              </div>

              {/* Price Table Body */}
              <div className="flex-1 overflow-y-auto py-2 px-6">
                {bulkPrices.map((item, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      handleBulkRangeSelect(item.range, item.price)
                    }
                    className={`grid grid-cols-4 items-center py-2 border-b border-gray-100 cursor-pointer ${
                      selectedBulkRange === item.range
                        ? "bg-blue-50 border border-gray-800 rounded-xl px-6"
                        : "px-6"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${
                          selectedBulkRange === item.range
                            ? "border-[#f7941d] bg-[#f7941d]"
                            : "border-gray-300"
                        } flex items-center justify-center`}
                      >
                        {selectedBulkRange === item.range && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-600 text-center">
                      {item.range}
                    </span>
                    <span className="text-[#1e3473] col-span-2 text-center font-medium">
                      ₹
                      {item.price.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}

                {selectedBulkRange && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">
                        Enter Quantity:
                      </span>
                      <input
                        type="number"
                        value={bulkQuantity}
                        onChange={(e) =>
                          setBulkQuantity(
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        }
                        className="w-24 px-3 py-1 border rounded-lg text-center"
                        min={parseInt(selectedBulkRange.split("-")[0])}
                        max={
                          selectedBulkRange.includes("+")
                            ? 999999
                            : parseInt(selectedBulkRange.split("-")[1])
                        }
                      />
                    </div>
                    <div className="text-right text-[#1e3473] font-bold">
                      Total: ₹
                      {(selectedBulkPrice * bulkQuantity).toLocaleString(
                        "en-IN",
                        { maximumFractionDigits: 2 }
                      )}
                    </div>
                  </div>
                )}

                <div className="py-4 border-t border-gray-200">
                  <div className="flex justify-between gap-10">
                    <button
                      onClick={handleBulkAddToCart}
                      disabled={!selectedBulkRange || bulkQuantity === 0}
                      className={`flex-1 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 ${
                        selectedBulkRange && bulkQuantity > 0
                          ? "bg-[#f7941d] text-white hover:bg-[#e88a1a]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } transition-colors`}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M9 20a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2zm-7-3h7a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                          strokeWidth="2"
                        />
                      </svg>
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBulkBuyNow}
                      disabled={!selectedBulkRange || bulkQuantity === 0}
                      className={`flex-1 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 ${
                        selectedBulkRange && bulkQuantity > 0
                          ? "bg-[#1e3473] text-white hover:bg-[#162554]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } transition-colors`}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2" />
                      </svg>
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-[#1e3473] rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">
                    Get Customised Price
                  </h3>
                  <form onSubmit={handleBulkOrderSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={bulkOrderForm.name}
                        onChange={handleBulkOrderInputChange}
                        className="w-full p-2 rounded-xl bg-white text-gray-800 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={bulkOrderForm.email}
                        onChange={handleBulkOrderInputChange}
                        className="w-full p-2 rounded-xl bg-white text-gray-800 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={bulkOrderForm.phone}
                        onChange={handleBulkOrderInputChange}
                        className="w-full p-2 rounded-xl bg-white text-gray-800 placeholder-gray-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#F7941D] text-white rounded-xl font-medium hover:bg-[#e88a1a] transition-colors"
                    >
                      Sign Up
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3473]"></div>
        </div>
      ) : (
        <Section1 products={products} />
      )}

      {/* Review Section */}
      <div className="w-full bg-[#1e3473] py-4 mt-8 rounded-2xl">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <h3 className="text-xl font-semibold text-white">Write a Review</h3>
            <div className="w-full md:flex-1 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-2 md:gap-4 mx-0 md:mx-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl md:text-3xl focus:outline-none cursor-pointer ${
                      star <= (rating || 0) ? "text-[#FFB800]" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write Review"
                className="w-full md:flex-1 px-4 py-2 rounded-lg border-none bg-white focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
              <button
                onClick={handleSubmitReview}
                className="w-full md:w-[250px] bg-[#F7941D] text-white flex justify-center items-center cursor-pointer py-2 rounded-lg hover:bg-[#e88a1a] transition-colors font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <Customers />

      {/* Add SideCart */}
      <SideCart isOpen={showCart} onClose={() => setShowCart(false)} />

      {/* Add ProductDetailsModal */}
      <ProductDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={product}
      />
    </div>
  );
}
