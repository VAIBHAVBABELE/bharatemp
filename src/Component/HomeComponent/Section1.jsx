import { useState } from "react";
import { IoBagOutline } from "react-icons/io5";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { useCart } from "../../context/CartContext";
import { handleBuyNow } from "../../utils/paymentUtils";

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

// Fallback products in case API fails or props are not passed
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
  // ... other fallback products
];

const ProductSlider = ({ products = [] }) => {
  const location = useLocation(); // Get current route location
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
    return ["You may also like", "Offer", "Recommended for you"]; // Default
  };

  const tabs = getTabs();
  // Use passed products or fallback to default if empty
  const allProducts =
    products.length > 0
      ? products.map((product, index) => ({
        ...product,
        // Ensure products have all required fields
        image: product.image || fallbackImages[index % fallbackImages.length],
        rating: product.rating || 4,
        reviewCount: product.reviewCount || 15,
        tag: "BUY NOW",
        tags: "Add to cart",
      }))
      : fallbackProducts;

  // Filter products based on active tab
  const getFilteredProducts = () => {
    if (activeTab === "Offers" || activeTab === "Offer") {
      // Filter products with higher discount and sort by discount percentage
      return allProducts
        .filter(product => product.discount && product.discount > 0)
        .sort((a, b) => (b.discount || 0) - (a.discount || 0))
        .slice(0, 5);
    }

    if (activeTab === "New Arrivals") {
      // Sort by creation date (newest first) or updated date
      return allProducts
        .sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at);
          const dateB = new Date(b.updated_at || b.created_at);
          return dateB - dateA; // Newest first
        })
        .slice(0, 5);
    }

    if (activeTab === "Recommended for you") {
      // Filter products with high ratings
      return allProducts
        .sort((a, b) => (b.review_stars || 0) - (a.review_stars || 0))
        .slice(0, 5);
    }

    // Trending Products or default - return products as they are
    return allProducts.slice(0, 5);
  };

  const filteredProducts = getFilteredProducts();

  // Handle add to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent the card click event
    addToCart(product);
  };

  // Handle buy now - adds to cart and navigates to cart page
  const handleBuyNowClick = (e, product) => {
    e.stopPropagation(); // Prevent the card click event
    handleBuyNow({
      product,
      quantity: 1,
      navigate,
      setLoadingBuyNow: (loading) => {
        setLoadingBuyNow(prev => ({ ...prev, [product._id]: loading }));
      },
      customShippingFee: 5,
    });
  };

  const handleBuyNow2 = async (e, product) => {
    e.stopPropagation()
    toast.dismiss()
    window.location.href = `/checkout`;

    // console.log("Product:", product);

    // const amount = product.discounted_single_product_price

    // // console.log("Amount:", amount);

    // try {
    //   // Create order on backend
    //   const orderResponse = await axios.post(`${backend}/payment/create-magic-checkout-payment`, {
    //     amount
    //   }, {
    //     headers: {
    //       "Authorization": `Bearer ${localStorage.getItem("token")}`
    //     },
    //   });

    //   // console.log("Order Response:", orderResponse);

    //   const order = orderResponse.data.data.response;

    //   // Magic Checkout options with form fields
    //   const options = {
    //     key: 'rzp_live_VYPdZDe9pDrS0A',
    //     one_click_checkout: true,
    //     name: "BharatroniX",
    //     order_id: order.id,
    //     show_coupons: false,
    //     redirect: false,
    //     prefill: {
    //       name: "",
    //       email: "",
    //       contact: ""
    //     },
    //     theme: {
    //       color: "#3399cc"
    //     },
    //     handler: function (response) {
    //       handlePaymentSuccess(response);
    //     },
    //     modal: {
    //       ondismiss: function () {
    //         setLoading(false);
    //       }
    //     }
    //   };

    //   // Load Razorpay Magic Checkout
    //   const rzp = new window.Razorpay(options);
    //   rzp.open();

    // } catch (error) {
    //   console.error('Error creating order:', error);
    //   toast.error(error.response.data.message);
    // }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // console.log("Payment Response:", response);
      // Verify payment on backend
      const verifyResponse = await axios.post(`${backend}/verify-magic-checkout-payment`, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      });

      if (verifyResponse.data.success) {
        alert('Payment successful!');
        // Redirect to success page or update UI
      } else {
        alert('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed');
    }
  };


  // Handle product click to view product details
  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
    localStorage.setItem("selectedProduct", JSON.stringify(product));
  };

  return (
    <div className="h-auto xl:h-[500px]   ">
      {/* Tabs */}
      <div className="border-b border-[#797979] flex items-center justify-between mb-4 ">
        <div className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium cursor-pointer lg:text-[20px] md:text-[13px]  text-[13px] relative ${activeTab === tab ? "text-[#333333]  " : "text-gray-500 "
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute left-0 -bottom-0.5 w-full h-1 bg-orange-400 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* <Link to="/product"
          className="lg:text-[16px] md:text-[13px] text-[10px]  text-[#333333] hover:text-black flex items-center"
        >
          View All Products <span className="ml-1">›</span>
        </Link> */}
      </div>

      {/* Products Grid */}
      <div className=" w-full grid  grid-cols-1 md:grid-cols-2  lg:grid-cols-3  xl:grid-cols-5 gap-8 pb-4 scrollbar-hide">
        {filteredProducts.slice(0, 5).map((product, index) => (
          <div
            key={product._id || index}
            onClick={() => handleProductClick(product)}
            className="group border rounded-2xl shadow-sm hover:shadow-lg transition-all scale-100 border-[#f3f3f3] hover:border-2 hover:border-[#c2c2c2] duration-700 lg:h-[330px] hover:h-[380px] h-[350px] cursor-pointer"
          >
            <div className="p-4 flex flex-col items-start relative">
              <p className="text-[14px] font-semibold text-[#D9D3D3] mb-1 group-hover:hidden  block">
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
                <p className="text-[14px] font-semibold text-[#D9D3D3] mb-1 group-hover:block hidden ">
                  {product.brand}
                </p>

                <div className=" items-center group-hover:flex hidden my-3">
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

                <div className=" items-center gap-2 group-hover:flex hidden">
                  <p className="lg:text-[17px] text-[12px]  font-bold text-[#000000]">
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
              <div className=" w-full flex  justify-between items-center  mb-2">
                <div className="flex items-center gap-2 group-hover:hidden mb-2">
                  <p className="lg:text-[17px] text-[12px]  font-bold text-[#000000]">
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
              <div className=" absolute -bottom-8 gap-1 left-0 w-full bg-white text-[#5D5D5D] px-2 py-2 flex justify-between items-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-900 rounded-b-2xl">
                <div className="  text-[14px] text-[#ABA1A1] font-[outfit]">
                  Get it <span className="text-black"> Friday,</span> Jan 18
                  <br />
                  <span className="mr-1"> FREE Delivery</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
