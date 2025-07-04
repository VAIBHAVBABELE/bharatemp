import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import thanku from "../../assets/thanku.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const OrderSuccess2 = () => {
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [userId, setUserId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const backend = import.meta.env.VITE_BACKEND;

  // Get payment details from location state
  const paymentId = location.state?.paymentId || id;
  const gatewayOrderId = location.state?.gatewayOrderId || `order_${id}`;

  useEffect(() => {
    window.scrollTo(0, 0);
    verifyPayment();
  }, []);

  const fetchUserDetails = async (userId, token) => {
    try {
      const response = await axios.get(`${backend}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        const userData = response.data.data.user;
        setUserData(userData);
        return userData; // Return the user data
      }
      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  const verifyPayment = async () => {
    try {
      // Check if we have the required payment details
      if (!paymentId || !gatewayOrderId) {
        console.error("Missing payment details:", {
          paymentId,
          gatewayOrderId,
        });
        setVerificationStatus("failed");
        toast.error("Payment verification failed: Missing payment details");
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setVerificationStatus("failed");
        toast.error("Authentication failed");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      // Parse token if stored as JSON string
      const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;


      // Verify payment using Cashfree endpoint
      const response = await axios.post(
        `${backend}/payment/verify-cashfree-payment`,
        {
          paymentId: paymentId,
          gateway_orderId: gatewayOrderId,
        },
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            "Content-Type": "application/json",
          },
        }
      );


      if (response.data.status === "Success") {
        const paymentData = response.data.data.response.data;
        setPaymentDetails(paymentData);

        // Check if payment is actually paid
        if (paymentData.order_status === "PAID") {
          setVerificationStatus("success");
          localStorage.removeItem("cart");
          toast.success("Payment successful! 🎉");
        } else {
          setVerificationStatus("failed");
          toast.error("Payment was not completed successfully");
          return;
        }


        const orderId = response.data.data.response.orderId;
        setOrderId(orderId);

        // Check if order exists
        if (orderId) {
          // Get user data first
          const decoded = jwtDecode(parsedToken);
          const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;
          const userDataResult = await fetchUserDetails(userId, parsedToken);

          if (!userDataResult) {
            console.error("Failed to fetch user details");
            toast.error("Failed to fetch user details. Please contact support.");
            return;
          }

          try {
            const orderResponse = await axios.get(`${backend}/order/${orderId}`, {
              headers: {
                Authorization: `Bearer ${parsedToken}`,
              },
            });

            if (orderResponse.data.status === "Success") {
              const orderData = orderResponse.data.data.order;

              // Use userDataResult instead of userDataParam
              if (orderData && userDataResult) {
                const address = orderData.shippingAddress
                  .split(",")
                  .map((part) => part.trim());
                const postalCode =
                  address.find((part) => /^\d{6}$/.test(part)) || "000000";
                const city = address[address.length - 2] || "City";

                const shipmentData = {
                  shipments: [
                    {
                      waybill: "",
                      order: orderId,
                      sub_order: "A1",
                      order_date: new Date().toLocaleDateString("en-GB"),
                      total_amount: orderData.totalPrice.toString(),
                      name: userDataResult.name || "Customer",
                      company_name: "Demo Corp",
                      add: orderData.shippingAddress.split(",")[0] || "",
                      add2: orderData.shippingAddress.split(",")[1] || "",
                      add3: "",
                      pin: postalCode,
                      city: city,
                      state: "Uttar Pradesh",
                      country: "India",
                      phone: userDataResult.phone || "",
                      alt_phone: "",
                      email: userDataResult.email || "",
                      is_billing_same_as_shipping: "yes",
                      billing_name: "Bharatronix",
                      billing_company_name: "Anantakarma Technologies Pvt Ltd",
                      billing_add:
                        "Sector 10, A-Block, A-36 Noida Gautam Buddha Nagar UttarPradesh India 201301",
                      billing_add2: "",
                      billing_add3: "",
                      billing_pin: "201301",
                      billing_city: "Noida",
                      billing_state: "Uttar Pradesh",
                      billing_country: "India",
                      billing_phone: "7982748787",
                      billing_alt_phone: "",
                      billing_email: "johndoe@example.com",
                      products: orderData.products.map((item) => ({
                        product_name: item?.product_id?.product_name || "",
                        product_sku: item?.product_id?.SKU || "",
                        product_quantity: item?.quantity?.toString(),
                        product_price:
                          item?.product_id?.discounted_single_product_price?.toString(),
                        product_tax_rate: "0",
                        product_hsn_code: "0",
                        product_discount: "0",
                        product_img_url:
                          item?.product_id?.product_image_main || "",
                      })),
                      shipment_length: "30",
                      shipment_width: "20",
                      shipment_height: "10",
                      weight: "1.2",
                      shipping_charges: "0",
                      giftwrap_charges: "0",
                      transaction_charges: "0",
                      total_discount: "0",
                      first_attemp_discount: "0",
                      cod_charges: "0",
                      advance_amount: "0",
                      cod_amount: "0",
                      payment_mode: "Prepaid",
                      reseller_name: "",
                      eway_bill_number: "",
                      gst_number: "",
                      what3words: "",
                      return_address_id: "1293",
                      api_source: "1",
                      store_id: "1",
                    },
                  ],
                  pickup_address_id: "1293",
                  logistics: "Delhivery",
                  s_type: "",
                  order_type: "",
                };

                toast.info("Creating your shipment...", { autoClose: false, toastId: 'creating-shipment' });

                try {
                  const shipmentResponse = await axios.post(
                    `${backend}/order/shipment`,
                    shipmentData,
                    {
                      headers: {
                        Authorization: `Bearer ${parsedToken}`,
                        "Content-Type": "application/json",
                        accept: "application/json, text/plain, */*",
                        "accept-language": "en-US,en;q=0.9",
                        priority: "u=1, i",
                      },
                    }
                  );


                  // Dismiss the creating shipment toast
                  toast.dismiss('creating-shipment');

                  if (shipmentResponse.data?.status === "Success") {
                    setOrderDetails(orderData);
                    toast.success("Shipment created successfully! Your order is being processed. 📦");
                  } else {
                    console.error("Failed to create shipment");
                    toast.error("Failed to create shipment. Our team will process it manually.");
                  }
                } catch (shipmentError) {
                  console.error("Error creating shipment:", shipmentError);
                  toast.dismiss('creating-shipment');
                  toast.error("Error creating shipment. Our team will process it manually.");
                }
              } else {
                console.error("Missing order data or user data");
                toast.error("Failed to create shipment: Missing required data. Please contact support.");
              }
            } else {
              toast.error("Failed to fetch order details. Please contact support.");
            }
          } catch (orderError) {
            console.error("Error fetching order:", orderError);
            toast.error("Failed to fetch order details. Please contact support.");
          }
        } else {
          toast.error("Order ID not found. Please contact support.");
        }
      } else {
        setVerificationStatus("failed");
        localStorage.removeItem("cart");
        toast.error(response.data.message || "Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setVerificationStatus("failed");
      toast.error(
        error.response?.data?.message || "Payment verification failed. Please try again or contact support."
      );
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[510px] bg-white px-4 py-8">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
      <div className="text-center max-w-2xl w-full">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-52 h-52 flex items-center justify-center">
            {verificationStatus === "verifying" ? (
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#F7941D]"></div>
            ) : (
              <img
                src={thanku}
                alt="Thank you"
                className={verificationStatus === "failed" ? "opacity-50" : ""}
              />
            )}
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-xl md:text-[30px] font-semibold text-[#383838] mb-4">
          {verificationStatus === "verifying" && "Verifying your payment..."}
          {verificationStatus === "success" &&
            "Your Order is successfully Placed"}
          {verificationStatus === "failed" && "Payment Verification Failed"}
        </h1>

        {/* Payment Details */}
        {paymentDetails && verificationStatus === "success" && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Order ID</p>
                <p className="font-semibold">{paymentDetails.order_id}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount Paid</p>
                <p className="font-semibold text-green-600">
                  {formatCurrency(paymentDetails.order_amount)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Payment Date</p>
                <p className="font-semibold">
                  {formatDate(paymentDetails.created_at)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold text-green-600">
                  {paymentDetails.order_status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subtext */}
        <p className="text-[#383838] mt-2 text-sm sm:text-[24px] mb-6">
          {verificationStatus === "verifying" &&
            "Please wait while we confirm your payment"}
          {verificationStatus === "success" &&
            "Your product will be delivered in 3–5 working days"}
          {verificationStatus === "failed" &&
            "Please contact support if payment was deducted"}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-[#e88a1a] transition-colors"
          >
            Continue Shopping
          </button>
          {verificationStatus === "success" && (
            <button
              onClick={() => navigate("/track-order")}
              className="px-6 py-2 bg-[#1e3473] text-white rounded-lg hover:bg-[#162554] transition-colors"
            >
              View Orders
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess2;
