import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { load } from "@cashfreepayments/cashfree-js";

const backend = import.meta.env.VITE_BACKEND;

// Initialize Cashfree SDK
let cashfree;
const initializeSDK = async () => {
  try {
    cashfree = await load({
      mode: "sandbox", // Change to "production" for production environment
    });
  } catch (error) {
    console.error("Failed to load Cashfree SDK:", error);
  }
};

// Initialize SDK when module loads
initializeSDK();

// Function to initialize Cashfree checkout
const initializeCashfreeCheckout = async (response, navigate) => {
  try {
    if (!cashfree) {
      await initializeSDK();
    }

    const checkoutOptions = {
      paymentSessionId: response.cashfreeResponse.payment_session_id,
      redirectTarget: "_modal", // Use modal popup for better UX
      returnUrl: window.location.origin + "/cash-payment-status/" // Will be appended with payment ID
    };


    const result = await cashfree.checkout(checkoutOptions);

    if (result.error) {
      console.error("Payment error:", result.error);
      toast.error(result.error.message || "Payment failed. Please try again.");
      return;
    }

    if (result.paymentDetails) {
      // Payment successful in modal mode
      const paymentId = response.payment._id;
      const gatewayOrderId = response.cashfreeResponse.order_id;
      
      // Navigate to success page
      navigate(`/cash-payment-status/${paymentId}`, {
        state: { paymentId, gatewayOrderId },
      });
    }

    // Handle redirect case
    if (result.redirect) {
      // The SDK will handle the redirect automatically
    }
  } catch (error) {
    console.error("Cashfree initialization error:", error);
    toast.error("Payment gateway error. Please try again.");
  }
};

// Main handleBuyNow utility function
export const handleBuyNow = async ({
  product,
  quantity,
  navigate,
  setLoadingBuyNow = () => {},
  customShippingFee = 5,
}) => {
  setLoadingBuyNow(true);
  
  try {
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
    if (product.no_of_product_instock && quantity > product.no_of_product_instock) {
      toast.error(`Only ${product.no_of_product_instock} items available in stock`);
      return;
    }

    // Get token from localStorage
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    // Parse token if stored as JSON string
    const parsedToken = storedToken.startsWith('"') ? JSON.parse(storedToken) : storedToken;

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

    if (!userResponse.data?.data?.user) {
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
    const totalPrice = Math.max(
      0,
      product.discounted_single_product_price * quantity + customShippingFee
    );


    // Prepare order data
    const orderData = {
      user_id: userId,
      products: [orderItem],
      totalPrice: totalPrice,
      shippingAddress: userData.address?.[0] || "",
      shippingCost: customShippingFee,
      email: userData.email,
      pincode: userData.address?.[0]?.match(/\b\d{6}\b/)?.[0] || "000000",
      name: userData ? `${userData.name}` : "",
      city: userData.address?.[0]?.split(",").slice(-2, -1)[0]?.trim() || "City",
      expectedDelivery: expectedDelivery,
    };


    // Create the order
    const orderResponse = await axios.post(
      `${backend}/order/new`,
      { order: orderData },
      {
        headers: {
          Authorization: `Bearer ${parsedToken}`,
        },
      }
    );

    if (!orderResponse.data?.data?.order?._id) {
      throw new Error("Failed to create order");
    }

    const createdOrderId = orderResponse.data.data.order._id;

    // Prepare payment data
    const paymentData = {
      orderId: createdOrderId,
      userId: userId,
      FRONTEND_URL: window.location.origin + "/cash-payment-status/",
      cart_items: [
        {
          item_id: orderItem.product_id,
          item_name: orderItem.product_name,
          item_description: product.product_description || "Product Description",
          item_details_url: product.product_image_main,
          item_image_url: orderItem.product_img_url,
          item_original_unit_price: product.non_discounted_price,
          item_discounted_unit_price: orderItem.product_price,
          item_quantity: orderItem.quantity,
          item_currency: "INR"
        }
      ]
    };

    // Initialize payment
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

    if (
      paymentResponse.data?.status === "Success" &&
      paymentResponse.data?.data?.response?.cashfreeResponse?.payment_session_id
    ) {
      const { response } = paymentResponse.data.data;
      await initializeCashfreeCheckout(response, navigate);
    } else {
      throw new Error("Failed to initialize payment");
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
  } finally {
    setLoadingBuyNow(false);
  }
}; 