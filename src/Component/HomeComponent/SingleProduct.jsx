import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSpinner,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import shop from "../../assets/shop.webp";
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
// Cashfree import removed - using backend payment integration
import secure from "../../assets/secure.gif";
import shield from "../../assets/shield.gif";
import wallet from "../../assets/wallet.gif";
import cargo from "../../assets/cargo.gif";
import pincodes from "../../utils/pincode.json";
import { handleBuyNow } from "../../utils/paymentUtils";
import "../../styles/mobile-responsive.css";
const backend = import.meta.env.VITE_BACKEND;

// Function to calculate dynamic bulk prices based on product price
const calculateBulkPrices = (basePrice) => {
  return [
    {
      range: "5-10",
      price: parseFloat((basePrice * 0.95).toFixed(2)), // 5% discount
      key: "multiple_quantity_price_5_10",
      discount: parseFloat((basePrice * 0.05).toFixed(2)),
      minQuantity: 5,
      maxQuantity: 10
    },
    {
      range: "10-20",
      price: parseFloat((basePrice * 0.9).toFixed(2)), // 10% discount
      key: "multiple_quantity_price_10_20",
      discount: parseFloat((basePrice * 0.1).toFixed(2)),
      minQuantity: 10,
      maxQuantity: 20
    },
    {
      range: "20-50",
      price: parseFloat((basePrice * 0.85).toFixed(2)), // 15% discount
      key: "multiple_quantity_price_20_50",
      discount: parseFloat((basePrice * 0.15).toFixed(2)),
      minQuantity: 20,
      maxQuantity: 50
    },
    {
      range: "50-100",
      price: parseFloat((basePrice * 0.8).toFixed(2)), // 20% discount
      key: "multiple_quantity_price_50_100",
      discount: parseFloat((basePrice * 0.2).toFixed(2)),
      minQuantity: 50,
      maxQuantity: 100
    },
    {
      range: "100+",
      price: parseFloat((basePrice * 0.75).toFixed(2)), // 25% discount
      key: "multiple_quantity_price_100_plus",
      discount: parseFloat((basePrice * 0.25).toFixed(2)),
      minQuantity: 100,
      maxQuantity: null
    },
  ];
};

export default function ProductCard() {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBuyNow, setLoadingBuyNow] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showBulkOrder, setShowBulkOrder] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBulkRange, setSelectedBulkRange] = useState(null);
  const [selectedBulkPrice, setSelectedBulkPrice] = useState(null);
  const [bulkQuantity, setBulkQuantity] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [bulkPrices, setBulkPrices] = useState([]);
  const [wholesaleData, setWholesaleData] = useState(null);
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, buyNow, isInCart, getItemQuantity } = useCart();
  const actionButtonsRef = useRef(null);
  const [selectedMainImage, setSelectedMainImage] = useState(product?.product_image_main);

  // Update the state when product changes
  useEffect(() => {
    setSelectedMainImage(product?.product_image_main);
  }, [product?.product_image_main]);

  // Fetch wholesale data for product
  const fetchWholesaleData = async (productId, productData) => {
    try {
      const response = await axios.post(`${backend}/wholesale/list`, {
        pageNum: 1,
        pageSize: 1000,
        filters: {}
      });
      
      if (response.data.status === "Success") {
        const wholesaleProducts = response.data.data.wholesaleProductsList || [];
        const productWholesale = wholesaleProducts.find(
          wp => wp.product_id._id === productId
        );
        
        if (productWholesale) {
          setWholesaleData(productWholesale);
          // Convert wholesale data to bulk prices format
          const wholesalePrices = productWholesale.priceBreaks.map((breakItem, index) => {
            const basePrice = productData?.discounted_single_product_price || 0;
            const discountedPrice = Math.max(0, basePrice - breakItem.discount);
            
            return {
              range: breakItem.maxQuantity 
                ? `${breakItem.minQuantity}-${breakItem.maxQuantity}`
                : `${breakItem.minQuantity}+`,
              price: discountedPrice,
              key: `wholesale_price_${index}`,
              discount: breakItem.discount,
              minQuantity: breakItem.minQuantity,
              maxQuantity: breakItem.maxQuantity
            };
          });
          setBulkPrices(wholesalePrices);
        } else {
          // Use product's built-in bulk pricing if no wholesale data
          generateBulkPricesFromProduct(productData);
        }
      } else {
        // Fallback to product pricing
        generateBulkPricesFromProduct(productData);
      }
    } catch (error) {
      console.error('Error fetching wholesale data:', error);
      // Fallback to product pricing on error
      generateBulkPricesFromProduct(productData);
    }
  };

  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backend}/product/${id}`);

        if (response.data.status === "Success" && response.data.data.product) {
          const productData = response.data.data.product;
          setProduct(productData);
          setError(null);
          
          // Fetch wholesale data for this product
          await fetchWholesaleData(productData._id, productData);
        } else {
          throw new Error("Product not found in API");
        }
      } catch (err) {
        // Try to get from localStorage as fallback
        const selectedProduct = localStorage.getItem("selectedProduct");
        if (selectedProduct) {
          const parsedProduct = JSON.parse(selectedProduct);
          setProduct(parsedProduct);
          setError(null);
          await fetchWholesaleData(parsedProduct._id, parsedProduct);
        } else {
          setError("Product not found");
          setProduct(null);
        }
        console.error("Error fetching product:", err);
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
        console.log("Fetched products:", data);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    getProducts();

    // Listen for real-time product updates
    const handleProductUpdate = (event) => {
      console.log('Product updated in SingleProduct:', event.detail);
      // If current product was updated, refetch its data
      if (event.detail.productId === id) {
        const fetchProductData = async () => {
          try {
            const response = await axios.get(`${backend}/product/${id}`);
            if (response.data.status === "Success" && response.data.data.product) {
              setProduct(response.data.data.product);
              await fetchWholesaleData(response.data.data.product._id, response.data.data.product);
            }
          } catch (err) {
            console.error("Error refetching product:", err);
          }
        };
        fetchProductData();
      }
      // Also refresh the products list
      getProducts();
    };

    window.addEventListener('productUpdated', handleProductUpdate);

    return () => {
      window.removeEventListener('productUpdated', handleProductUpdate);
    };
  }, [id]);

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
    toast.dismiss()
    if (product) {
      const regularItem = {
        ...product,
        quantity: quantity,
        price: product.discounted_single_product_price,
        total: product.discounted_single_product_price * quantity,
        isBulkOrder: false,
      };
      addToCart(regularItem);
      setQuantity(1);
      toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart`);
      setShowCart(true);
    }
  };

  // Update the handleBuyNow function to use the utility
  const handleBuyNowClick = () => {
    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Check if product is in stock
    if (!product.product_instock) {
      toast.error("Product is out of stock");
      return;
    }

    // Check if product is available (Buy Now always uses quantity 1)
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
    toast.success("Ready to checkout with 1 item");
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  const incrementQuantity = () => {
    if (
      product.no_of_product_instock &&
      quantity >= product.no_of_product_instock
    ) {
      toast.error(
        `Only ${product.no_of_product_instock} items available in stock`
      );
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

  const handleCustomQuoteRequest = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        // Logged-in user - use token data
        const parsedToken = storedToken.startsWith('"') ? JSON.parse(storedToken) : storedToken;
        const decoded = jwtDecode(parsedToken);
        const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;
        
        const userResponse = await axios.get(`${backend}/user/${userId}`, {
          headers: { Authorization: `Bearer ${parsedToken}` }
        });
        
        const userData = userResponse.data.data.user;
        
        const customPriceData = {
          productId: product._id,
          productName: product.product_name,
          customerName: userData.name,
          customerEmail: userData.email,
          customerPhone: userData.phone || 'Not provided',
          requestedQuantity: bulkQuantity || 'Not specified',
          currentPrice: product.discounted_single_product_price,
          requestType: 'bulk_pricing_inquiry'
        };
        
        const response = await axios.post(`${backend}/wholesale/custom-price-request`, customPriceData);
        
        if (response.data.status === 'Success') {
          toast.success('Your custom quote request has been submitted! We will contact you within 24 hours.');
          setShowBulkOrder(false);
        }
      } else {
        // Guest user - redirect to login
        toast.info('Please login to request custom pricing');
        navigate('/login');
      }
    } catch (error) {
      console.error('Custom quote request error:', error);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleBulkRangeSelect = (range, price, priceBreak) => {
    setSelectedBulkRange(range);
    setSelectedBulkPrice(price);
    // Set initial quantity to minimum of range
    const minQuantity = priceBreak.minQuantity || (range.includes("+") 
      ? parseInt(range.split("+")[0]) 
      : parseInt(range.split("-")[0]));
    setBulkQuantity(minQuantity);
  };

  // Calculate real-time pricing based on quantity
  const calculateRealTimePrice = (quantity) => {
    if (!bulkPrices.length || !quantity) return null;
    
    // Find the appropriate price break for the quantity
    const applicablePriceBreak = bulkPrices.find(priceBreak => {
      const minQty = priceBreak.minQuantity;
      const maxQty = priceBreak.maxQuantity || Infinity;
      return quantity >= minQty && quantity <= maxQty;
    });
    
    return applicablePriceBreak || null;
  };

  // Handle quantity change with real-time price update
  const handleBulkQuantityChange = (quantity) => {
    setBulkQuantity(quantity);
    const priceBreak = calculateRealTimePrice(quantity);
    if (priceBreak) {
      setSelectedBulkPrice(priceBreak.price);
      setSelectedBulkRange(priceBreak.range);
    }
  };

  // Generate bulk prices from product's built-in pricing fields
  const generateBulkPricesFromProduct = (productData) => {
    if (!productData || !productData.discounted_single_product_price) {
      console.log('No product data or price available');
      return;
    }
    
    const bulkPriceFields = [
      { key: 'multiple_quantity_price_5_10', range: '5-10', minQty: 5, maxQty: 10 },
      { key: 'multiple_quantity_price_10_20', range: '10-20', minQty: 10, maxQty: 20 },
      { key: 'multiple_quantity_price_20_50', range: '20-50', minQty: 20, maxQty: 50 },
      { key: 'multiple_quantity_price_50_100', range: '50-100', minQty: 50, maxQty: 100 },
      { key: 'multiple_quantity_price_100_plus', range: '100+', minQty: 100, maxQty: null }
    ];
    
    const prices = [];
    const basePrice = parseFloat(productData.discounted_single_product_price);
    
    console.log('Base price:', basePrice);
    console.log('Product bulk price fields:', {
      field1: productData.multiple_quantity_price_5_10,
      field2: productData.multiple_quantity_price_10_20,
      field3: productData.multiple_quantity_price_20_50,
      field4: productData.multiple_quantity_price_50_100,
      field5: productData.multiple_quantity_price_100_plus
    });
    
    bulkPriceFields.forEach(field => {
      const fieldValue = productData[field.key];
      if (fieldValue && parseFloat(fieldValue) > 0) {
        const bulkPrice = parseFloat(fieldValue);
        const discount = basePrice - bulkPrice;
        
        prices.push({
          range: field.range,
          price: bulkPrice,
          key: field.key,
          discount: discount > 0 ? discount : 0,
          minQuantity: field.minQty,
          maxQuantity: field.maxQty
        });
      }
    });
    
    console.log('Generated prices from product fields:', prices);
    
    // If no bulk prices set by admin, use calculated fallback prices
    if (prices.length === 0) {
      console.log('No admin bulk prices found, using calculated prices');
      const fallbackPrices = calculateBulkPrices(basePrice);
      setBulkPrices(fallbackPrices);
    } else {
      console.log('Using admin-set bulk prices');
      setBulkPrices(prices);
    }
  };

  const handleBulkAddToCart = () => {
    if (selectedBulkRange && selectedBulkPrice && product && bulkQuantity > 0) {
      // Find the selected price break
      const selectedPriceBreak = bulkPrices.find(bp => bp.range === selectedBulkRange);
      
      if (selectedPriceBreak) {
        const minQty = selectedPriceBreak.minQuantity;
        const maxQty = selectedPriceBreak.maxQuantity || Infinity;

        // Validate quantity
        if (bulkQuantity >= minQty && (maxQty === Infinity || bulkQuantity <= maxQty)) {
          const bulkItem = {
            ...product,
            quantity: bulkQuantity,
            price: selectedBulkPrice,
            total: selectedBulkPrice * bulkQuantity,
            isBulkOrder: true,
            bulkRange: selectedBulkRange,
            originalPrice: product.discounted_single_product_price,
            discount: selectedPriceBreak.discount || 0
          };
          addToCart(bulkItem);
          setShowBulkOrder(false);
          setShowCart(true);
          toast.success(`Added ${bulkQuantity} items to cart with bulk pricing`);
        } else {
          toast.error(
            `Please enter a quantity between ${minQty} and ${maxQty === Infinity ? "∞" : maxQty}`
          );
        }
      }
    }
  };

  const handleBulkBuyNow = async () => {
    if (selectedBulkRange && selectedBulkPrice && product && bulkQuantity > 0) {
      // Find the selected price break
      const selectedPriceBreak = bulkPrices.find(bp => bp.range === selectedBulkRange);
      
      if (selectedPriceBreak) {
        const minQty = selectedPriceBreak.minQuantity;
        const maxQty = selectedPriceBreak.maxQuantity || Infinity;

        // Validate quantity
        if (bulkQuantity >= minQty && (maxQty === Infinity || bulkQuantity <= maxQty)) {
          const bulkItem = {
            ...product,
            quantity: bulkQuantity,
            price: selectedBulkPrice,
            total: selectedBulkPrice * bulkQuantity,
            isBulkOrder: true,
            bulkRange: selectedBulkRange,
            originalPrice: product.discounted_single_product_price,
            discount: selectedPriceBreak.discount || 0
          };
          
          // Add bulk item to cart and navigate to checkout
          addToCart(bulkItem);
          setShowBulkOrder(false);
          toast.success(`Added ${bulkQuantity} items to cart with bulk pricing`);
          
          // Navigate to checkout for payment
          navigate('/checkout');
        } else {
          toast.error(
            `Please enter a quantity between ${minQty} and ${maxQty === Infinity ? "∞" : maxQty}`
          );
        }
      }
    }
  };

  // PhonePe payment integration
  const initiatePhonePePayment = async (orderItem) => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        toast.error('Please login to continue with payment');
        navigate('/login');
        return;
      }

      // Parse token if stored as JSON string
      const parsedToken = storedToken.startsWith('"') ? JSON.parse(storedToken) : storedToken;
      const decoded = jwtDecode(parsedToken);
      const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;

      if (!userId) {
        toast.error('Authentication failed');
        navigate('/login');
        return;
      }

      // Get user details
      const userResponse = await axios.get(`${backend}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${parsedToken}`,
        },
      });

      if (!userResponse.data?.data?.user) {
        throw new Error('Failed to fetch user details');
      }

      const userData = userResponse.data.data.user;

      // Calculate expected delivery date
      const expectedDelivery = new Date();
      expectedDelivery.setDate(expectedDelivery.getDate() + 4);

      // Prepare order item for backend
      const backendOrderItem = {
        product_id: orderItem._id,
        quantity: orderItem.quantity,
        product_name: orderItem.product_name,
        product_sku: orderItem.SKU,
        product_price: orderItem.price,
        product_tax_rate: "0",
        product_hsn_code: "0",
        product_discount: orderItem.discount || "0",
        product_img_url: orderItem.product_image_main,
      };

      // Create order first with proper user details
      const userAddress = userData.address && userData.address.length > 0 ? userData.address[0] : "";
      const addressParts = userAddress.split(",").map(part => part.trim());
      const pincode = userAddress.match(/\b\d{6}\b/)?.[0] || "000000";
      const city = addressParts.length > 1 ? addressParts[addressParts.length - 2] : "City";
      const state = addressParts.length > 2 ? addressParts[addressParts.length - 1] : "State";
      
      const orderData = {
        user_id: userId,
        products: [backendOrderItem],
        totalPrice: orderItem.total,
        shippingAddress: userAddress || `${userData.name || 'Customer'}, ${userData.phone || ''}, ${city}, ${state}, ${pincode}`,
        shippingCost: 0, // Free shipping for bulk orders
        email: userData.email,
        pincode: pincode,
        name: userData.name || "Customer",
        phone: userData.phone || "",
        city: city,
        state: state,
        expectedDelivery: expectedDelivery,
        orderType: 'bulk',
        status: 'pending'
        // payment_status will be set by backend to UNPAID constant
      };

      console.log('Sending order data to backend:', JSON.stringify(orderData, null, 2));
      
      const orderResponse = await axios.post(
        `${backend}/order/new`,
        orderData, // Send directly, not wrapped in { order: orderData }
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log('Order creation response:', orderResponse.data);

      if (!orderResponse.data?.data?.order?._id) {
        console.error('Order creation failed:', orderResponse.data);
        throw new Error(orderResponse.data?.data?.message || 'Failed to create order');
      }

      const createdOrderId = orderResponse.data.data.order._id;
      console.log('Order created successfully with ID:', createdOrderId);

      // Prepare PhonePe payment data
      const paymentData = {
        orderId: createdOrderId,
        userId: userId,
        FRONTEND_URL: window.location.origin + "/phonepe-payment-status/",
        CANCEL_URL: window.location.origin + "/phonepe-payment-cancel/",
        cart_items: [
          {
            item_id: backendOrderItem.product_id,
            item_name: backendOrderItem.product_name,
            item_description: orderItem.product_description || "Bulk Order Product",
            item_details_url: orderItem.product_image_main,
            item_image_url: backendOrderItem.product_img_url,
            item_original_unit_price: orderItem.originalPrice || orderItem.price,
            item_discounted_unit_price: backendOrderItem.product_price,
            item_quantity: backendOrderItem.quantity,
            item_currency: "INR"
          }
        ]
      };

      // Initialize PhonePe payment
      const paymentResponse = await axios.post(
        `${backend}/payment/create-phonepe-payment`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (paymentResponse.data?.status === "Success" && paymentResponse.data?.data?.response) {
        const { response } = paymentResponse.data.data;
        
        // Check multiple possible PhonePe response structures
        let redirectUrl = null;
        
        if (response.phonepeResponse?.redirectUrl) {
          redirectUrl = response.phonepeResponse.redirectUrl;
        } else if (response.phonePeResponse?.redirectUrl) {
          redirectUrl = response.phonePeResponse.redirectUrl;
        } else if (response.phonepeResponse?.data?.instrumentResponse?.redirectInfo?.url) {
          redirectUrl = response.phonepeResponse.data.instrumentResponse.redirectInfo.url;
        } else if (response.phonePeResponse?.data?.instrumentResponse?.redirectInfo?.url) {
          redirectUrl = response.phonePeResponse.data.instrumentResponse.redirectInfo.url;
        } else if (response.redirectUrl) {
          redirectUrl = response.redirectUrl;
        }
        
        if (redirectUrl) {
          // Redirect to PhonePe payment page
          window.location.href = redirectUrl;
        } else {
          console.error('PhonePe response structure:', response);
          throw new Error('PhonePe redirect URL not found in response');
        }
      } else {
        throw new Error('Failed to initialize PhonePe payment');
      }
    } catch (error) {
      console.error('PhonePe payment error:', error);
      let errorMessage = 'Payment initiation failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
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
      // Check if the zipcode exists in the pincodes array
      const deliveryLocation = pincodes.find(
        location => location.Pincode === zipcode && location["SFX status"] === "Active"
      );

      if (deliveryLocation) {
        setDeliveryStatus(true);
        toast.success(`Delivery available in ${deliveryLocation.City}, ${deliveryLocation.state}!`);
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


  // Update scroll event listener to use button position
  useEffect(() => {
    const handleScroll = () => {
      if (actionButtonsRef.current) {
        const buttonPosition = actionButtonsRef.current.offsetTop;
        const scrollPosition = window.scrollY;
        setShowFloatingCart(scrollPosition > buttonPosition);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  // console.log("Product:", product);

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 font-[outfit] relative pb-[100px] mobile-success-container">
      {/* Breadcrumb Navigation */}
      <nav className="w-full font-[outfit] pb-6 flex flex-wrap items-center gap-2 text-[#2F294D] text-sm md:text-base font-medium px-4 py-4 mt-4">
        <button
          onClick={handleBack}
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer bg-[#f7941d] text-white rounded-full hover:bg-[#e88a1a] transition-colors"
        >
          <FaArrowLeft size={12} />
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-[#f7941d] transition-colors">
            Home
          </Link>
          <FaChevronRight className="text-gray-400" size={12} />

          <Link
            to="/allproducts"
            className="hover:text-[#f7941d] transition-colors"
          >
            All Products
          </Link>
          <FaChevronRight className="text-gray-400" size={12} />

          <span className="text-[#f7941d] truncate max-w-[200px] md:max-w-[300px]">
            {product?.product_name || "Loading..."}
          </span>
        </div>
      </nav>
      {/* Main Content */}
      <div className="flex flex-col gap-10 justify-between lg:flex-row">
        {/* Left: Product Images */}
        <div className="w-full lg:w-[45%] mobile-padding">
          <div className="bg-white rounded-lg mb-4">
            <img
              src={selectedMainImage}
              alt={product.product_name}
              className="w-full h-[400px] object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-4">
            {/* Main image thumbnail */}
            <div
              className={`border rounded-lg p-2 cursor-pointer transition-colors ${selectedMainImage === product.product_image_main
                ? 'border-[#1e3473] border-2'
                : 'border-gray-200 hover:border-[#1e3473]'
                }`}
              onClick={() => setSelectedMainImage(product.product_image_main)}
            >
              <img
                src={product.product_image_main}
                alt={`${product.product_name} main`}
                className="w-full h-[100px] object-contain"
              />
            </div>

            {/* Sub images thumbnails */}
            {product.product_image_sub?.map((img, index) => (
              <div
                key={index}
                className={`border rounded-lg p-2 cursor-pointer transition-colors ${selectedMainImage === img
                  ? 'border-[#1e3473] border-2'
                  : 'border-gray-200 hover:border-[#1e3473]'
                  }`}
                onClick={() => setSelectedMainImage(img)}
              >
                <img
                  src={img}
                  alt={`${product.product_name} thumbnail ${index + 1}`}
                  className="w-full h-[100px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full lg:w-[45%] space-y-6 mobile-padding">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2F294D]">
              {product.product_name}
              <span className="ml-4 inline-block px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-full">
                {product.product_instock ? "In stock" : "Out of stock"}
              </span>
            </h1>
          </div>
          
          {/* Product Quantity Display */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7"></path>
                </svg>
              </div>
              <div>
                <span className="text-blue-800 font-semibold text-lg">
                  {product.no_of_product_instock || 0} units available
                </span>
                <p className="text-blue-600 text-sm">Current stock quantity</p>
              </div>
            </div>
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
              ₹{(product.discounted_single_product_price * 1.18).toFixed(2)}{" "}
              (incl. of all taxes)
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#162554]">
                ₹
                {product.discounted_single_product_price?.toLocaleString(
                  "en-IN"
                )}
              </span>
              {/* <span className="text-sm text-gray-500">+₹41 Shipping</span> */}
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
                className="px-6 md:px-8 py-3 md:py-3 bg-[#F7941D] cursor-pointer text-white rounded-3xl font-medium hover:bg-[#e88a1a] transition-colors mobile-checkout-button text-base"
                disabled={!product.product_instock || product.no_of_product_instock === 0}
              >
                Add to Cart
              </button>
              
              <button
                onClick={() => {
                  if (product.no_of_product_instock > 10) {
                    handleBulkOrderClick();
                  } else {
                    setShowStockModal(true);
                  }
                }}
                className={`px-4 md:px-6 py-3 border rounded-3xl font-medium transition-colors mobile-checkout-button text-base ${
                  product.no_of_product_instock > 10
                    ? "border-[#1e3473] text-[#1e3473] hover:bg-[#1e3473] hover:text-white cursor-pointer"
                    : "border-gray-300 text-gray-400 cursor-pointer"
                }`}
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
                  className={`w-10 h-10 flex border border-gray-300 items-center justify-center rounded-full text-xl font-bold transition-colors ${quantity <= 1
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
          <div className="flex flex-col gap-4" ref={actionButtonsRef}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-stretch sm:items-center">
              {/* <button
                onClick={handleBuyNowClick}
                className="w-full sm:w-[200px] bg-[#1e3473] text-white py-4 md:py-3 rounded-2xl cursor-pointer font-medium hover:bg-[#162554] transition-colors flex items-center justify-center gap-2 mobile-checkout-button text-base"
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

                {loadingBuyNow ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#F7941D]"></div>
                ) : (
                  "Buy Now (1 item)"
                )}
              </button> */}

              {/* Add Zipcode Check Section */}
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <div className="relative flex-1 sm:flex-none">
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
                    className="w-full sm:w-[150px] px-3 sm:px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#1e3473] text-sm"
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
                  className={`px-3 sm:px-4 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 flex-1 sm:flex-none whitespace-nowrap ${zipcode.length === 6 && !checkingDelivery
                    ? "bg-[#f7941d] text-white hover:bg-[#e88a1a]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } transition-colors`}
                >
                  {checkingDelivery ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span className="hidden sm:inline">Checking...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Check Delivery</span>
                      <span className="sm:hidden">Check</span>
                    </>
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
          <div className="flex items-center justify-between py-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <img src={shield} alt="Transparent" className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="font-medium">Transparent</span>
                <span>100% Genuine Products </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <img src={cargo} alt="Shipping" className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="font-medium">Shipping</span>
                <span>One Day delivery </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <img src={secure} alt="Secure" className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="font-medium">Secure</span>
                <span>24*7 Technical support </span>
              </div>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="flex items-center gap-2">
            {/* <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://randomuser.me/api/portraits/thumb/men/${i}.webp`}
                  alt="user"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div> */}
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
              className="bg-[#1E3473] text-white px-5 py-3 rounded-lg mb-6"
            >
              More Details

            </button>
          </div>
        </div>
      </div>

      {/* Stock Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Insufficient Stock</h3>
              <p className="text-gray-600 mb-6">
                This product has only <span className="font-semibold text-orange-600">{product.no_of_product_instock || 0} units</span> available.
                <br />Bulk orders require minimum <span className="font-semibold">10+ units</span> in stock.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStockModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Got it
                </button>
                <button
                  onClick={() => {
                    setShowStockModal(false);
                    navigate('/product');
                  }}
                  className="flex-1 px-4 py-2 bg-[#f7941d] text-white rounded-lg hover:bg-[#e88a1a] transition-colors"
                >
                  Browse Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Order Sidebar */}
      {showBulkOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
            onClick={handleCloseBulkOrder}
          />

          <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white z-[9999] shadow-xl rounded-l-3xl transform transition-transform duration-300 ease-in-out">
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
                {wholesaleData && (
                  <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full inline-block">
                    ✓ Wholesale rates available
                  </div>
                )}
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
                {bulkPrices.map((item, index) => {
                  const isSelected = selectedBulkRange === item.range;
                  const totalPrice = item.price * (item.minQuantity || 1);
                  const originalTotal = product.discounted_single_product_price * (item.minQuantity || 1);
                  const savings = originalTotal - totalPrice;
                  
                  return (
                    <div
                      key={index}
                      onClick={() =>
                        handleBulkRangeSelect(item.range, item.price, item)
                      }
                      className={`grid grid-cols-4 items-center py-3 border-b border-gray-100 cursor-pointer transition-all ${isSelected
                        ? "bg-blue-50 border border-[#1e3473] rounded-xl px-6 shadow-sm"
                        : "px-6 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${isSelected
                            ? "border-[#f7941d] bg-[#f7941d]"
                            : "border-gray-300"
                            } flex items-center justify-center`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-700 text-center font-medium">
                        {item.range}
                      </span>
                      <div className="col-span-2 text-center">
                        <div className="text-[#1e3473] font-bold text-lg">
                          ₹{item.price.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        {item.discount && (
                          <div className="text-xs text-green-600 font-medium">
                            Save ₹{item.discount} per unit
                          </div>
                        )}
                        {savings > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            Total savings: ₹{savings.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Real-time Quantity Input and Pricing */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Enter Quantity:
                    </label>
                    <input
                      type="number"
                      value={bulkQuantity}
                      onChange={(e) => {
                        const quantity = Math.max(0, parseInt(e.target.value) || 0);
                        handleBulkQuantityChange(quantity);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#1e3473] focus:border-transparent"
                      min="1"
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  {bulkQuantity > 0 && selectedBulkPrice && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="text-[#1e3473] font-bold text-lg">
                          ₹{selectedBulkPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="text-gray-800 font-medium">{bulkQuantity} units</span>
                      </div>
                      
                      <div className="border-t border-gray-300 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 font-medium">Subtotal:</span>
                          <span className="text-[#1e3473] font-bold text-xl">
                            ₹{(selectedBulkPrice * bulkQuantity).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Savings Calculation */}
                      {(() => {
                        const originalTotal = product.discounted_single_product_price * bulkQuantity;
                        const discountedTotal = selectedBulkPrice * bulkQuantity;
                        const totalSavings = originalTotal - discountedTotal;
                        
                        return totalSavings > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-green-700 font-medium">You Save:</span>
                              <span className="text-green-600 font-bold text-lg">
                                ₹{totalSavings.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              {((totalSavings / originalTotal) * 100).toFixed(1)}% discount on bulk order
                            </div>
                          </div>
                        );
                      })()}
                      
                      {/* GST Information */}
                      <div className="text-xs text-gray-500 text-center">
                        *GST will be added at checkout
                      </div>
                    </div>
                  )}
                </div>

                <div className="py-4 border-t border-gray-200">
                  <div className="flex justify-between gap-10">
                    <button
                      onClick={handleBulkAddToCart}
                      disabled={!selectedBulkRange || bulkQuantity === 0}
                      className={`flex-1 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 ${selectedBulkRange && bulkQuantity > 0
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
                      disabled={!selectedBulkRange || bulkQuantity === 0 || loadingBuyNow}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${selectedBulkRange && bulkQuantity > 0 && !loadingBuyNow
                        ? "bg-gradient-to-r from-[#1e3473] to-[#2a4a8a] text-white hover:from-[#162554] hover:to-[#1e3473] shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        } transition-all duration-200`}
                    >
                      {loadingBuyNow ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2" />
                          </svg>
                          Buy Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      {/* Add Floating Cart with smooth transition */}
      {product && showFloatingCart && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.1)] p-3 sm:p-4 z-50 transition-transform duration-300 transform translate-y-0">
          <div className="container mx-auto max-w-7xl">
            {/* Mobile Layout */}
            <div className="flex flex-col sm:hidden gap-3">
              {/* Row 1: Product Info */}
              <div className="flex items-center gap-3">
                <img
                  src={product.product_image_main}
                  alt={product.product_name}
                  className="w-12 h-12 object-contain rounded-lg border border-gray-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#2F294D] font-semibold text-sm truncate">
                    {product.product_name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#162554]">
                      ₹{product.discounted_single_product_price?.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      ₹{product.non_discounted_price?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Row 2: Controls and Buttons */}
              <div className="flex items-center gap-2">
                {/* Quantity Controls */}
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className={`w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors ${quantity <= 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-[#1e3473] hover:bg-gray-100 cursor-pointer"
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
                    className="w-10 text-center py-1 text-sm font-bold bg-transparent border-none focus:outline-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="w-8 h-8 flex items-center justify-center text-lg font-bold text-[#1e3473] hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-3 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-[#e88a1a] transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 20a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2zm-7-3h7a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" strokeWidth="2" />
                  </svg>
                  Add
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNowClick}
                  className="flex-1 px-3 py-2 bg-[#1e3473] text-white rounded-lg hover:bg-[#162554] transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                  disabled={loadingBuyNow}
                >
                  {!loadingBuyNow && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 11h16M4 11a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7z" strokeWidth="2" />
                      <path d="M8 11V7a4 4 0 018 0v4" strokeWidth="2" />
                    </svg>
                  )}
                  {loadingBuyNow ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    "Buy"
                  )}
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={product.product_image_main}
                  alt={product.product_name}
                  className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                />
                <div>
                  <h3 className="text-[#2F294D] font-semibold text-lg line-clamp-1">
                    {product.product_name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#162554]">
                      ₹{product.discounted_single_product_price?.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.non_discounted_price?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className={`w-10 h-10 flex items-center justify-center text-xl font-bold transition-colors ${quantity <= 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-[#1e3473] hover:bg-gray-100 cursor-pointer"
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
                    className="w-12 text-center py-1 text-lg font-bold bg-transparent border-none focus:outline-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 flex items-center justify-center text-xl font-bold text-[#1e3473] hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-[#e88a1a] transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 20a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2zm-7-3h7a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" strokeWidth="2" />
                  </svg>
                  Add to Cart
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNowClick}
                  className="px-6 py-2 bg-[#1e3473] text-white rounded-lg hover:bg-[#162554] transition-colors flex items-center gap-2"
                  disabled={loadingBuyNow}
                >
                  {!loadingBuyNow && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 11h16M4 11a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7z" strokeWidth="2" />
                      <path d="M8 11V7a4 4 0 018 0v4" strokeWidth="2" />
                    </svg>
                  )}
                  {loadingBuyNow ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    "Buy Now (1 item)"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-2">
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
                    className={`text-2xl md:text-3xl focus:outline-none cursor-pointer ${star <= (rating || 0) ? "text-[#FFB800]" : "text-gray-300"
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
