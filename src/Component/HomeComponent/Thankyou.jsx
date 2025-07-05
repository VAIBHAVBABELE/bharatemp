import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import thanku from '../../assets/thanku.webp';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const OrderSuccess = () => {
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [userId, setUserId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const backend = import.meta.env.VITE_BACKEND;

  // Fetch user details
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

  // Fetch order details
  const fetchOrderDetails = async (orderId, token) => {
    try {
      const response = await axios.get(`${backend}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.data.status === "Success") {
        setOrderDetails(response.data.data.order);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const initializePayment = async () => {
      // Get and verify token
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const parsedToken = storedToken.startsWith('"') ? JSON.parse(storedToken) : storedToken;
          const decoded = jwtDecode(parsedToken);
          const id = decoded.id || decoded.userId || decoded._id || decoded.sub;

          if (id) {
            setUserId(id);
            // Fetch user data first and wait for it
            const userDataResult = await fetchUserDetails(id, parsedToken);
            if (userDataResult) {
              // Only proceed with payment verification after we have user data
              await verifyPayment(parsedToken, userDataResult);
            } else {
              toast.error("Failed to fetch user details");
              navigate("/login");
            }
          } else {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    initializePayment();
  }, []);

  const verifyPayment = async (token, userDataParam) => {
    try {
      if (!id) {
        setVerificationStatus("failed");
        toast.error("Payment verification failed: Missing payment details");
        return;
      }

      const response = await axios.post(
        `${backend}/payment/verify-phonepe-payment`,
        {
          paymentId: id,
          merchantTransactionId: id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        setVerificationStatus("success");
        localStorage.removeItem("cart");
        toast.success("Payment successful!");

        const orderId = response.data.data.response.orderId;
        setOrderId(orderId);
        
        if (orderId) {
          const orderResponse = await axios.get(`${backend}/order/${orderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (orderResponse.data.status === "Success") {
            const orderData = orderResponse.data.data.order;

            // Use userDataParam instead of userData state
            if (orderData && userDataParam) {
              const address = orderData.shippingAddress.split(',').map(part => part.trim());
              const postalCode = address.find(part => /^\d{6}$/.test(part)) || "000000";
              const city = address[address.length - 2] || "City";

              const shipmentData = {
                shipments: [
                  {
                    waybill: "",
                    order: orderId,
                    sub_order: "A1",
                    order_date: new Date().toLocaleDateString('en-GB'), // Format: DD/MM/YYYY
                    total_amount: orderData.totalPrice.toString(),
                    name: userDataParam.name || "Customer",
                    company_name: "Demo Corp",
                    add: orderData.shippingAddress.split(',')[0] || "",
                    add2: orderData.shippingAddress.split(',')[1] || "",
                    add3: "",
                    pin: postalCode,
                    city: city,
                    state: "Uttar Pradesh",
                    country: "India",
                    phone: userDataParam.phone || "",
                    alt_phone: "",
                    email: userDataParam.email || "",
                    is_billing_same_as_shipping: "yes",
                    billing_name: "Bharatronix",
                    billing_company_name: "Anantakarma Technologies Pvt Ltd",
                    billing_add: "Sector 10, A-Block, A-36 Noida Gautam Buddha Nagar UttarPradesh India 201301",
                    billing_add2: "",
                    billing_add3: "",
                    billing_pin: "201301",
                    billing_city: "Noida",
                    billing_state: "Uttar Pradesh",
                    billing_country: "India",
                    billing_phone: "7982748787",
                    billing_alt_phone: "",
                    billing_email: "johndoe@example.com",
                    products: orderData.products.map(item => ({
                      product_name: item?.product_id?.product_name || "",
                      product_sku: item?.product_id?.SKU || "",
                      product_quantity: item?.quantity?.toString(),
                      product_price: item?.product_id?.discounted_single_product_price?.toString(),
                      product_tax_rate: "0",
                      product_hsn_code: "0",
                      product_discount: "0",
                      product_img_url: item?.product_id?.product_image_main || ""
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
                    store_id: "1"
                  }
                ],
                pickup_address_id: "1293",
                logistics: "Delhivery",
                s_type: "",
                order_type: ""
              };


              try {
                const shipmentResponse = await axios.post(
                  `${backend}/order/shipment`,
                  shipmentData,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                      "accept": "application/json, text/plain, */*",
                      "accept-language": "en-US,en;q=0.9",
                      "priority": "u=1, i"
                    },
                  }
                );

                
                if (shipmentResponse.data?.status === "Success") {
                  alert("Shipment created successfully! Your order is being processed. 📦");
                  setOrderDetails(orderData);
                } else {
                  console.error("Failed to create shipment");
                }
              } catch (shipmentError) {
                console.error("Error creating shipment:", shipmentError);
              }
            } else {
              console.error("Missing order data or user data");
              toast.error("Failed to create shipment: Missing required data");
            }
          }
        }
      } else {
        setVerificationStatus("failed");
        localStorage.removeItem("cart");
        toast.error(response.data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setVerificationStatus("failed");
      toast.error(error.response?.data?.message || "Payment verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-[510px] bg-white px-4">
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
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-52 h-52 flex items-center justify-center">
            {verificationStatus === "verifying" ? (
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#F7941D]"></div>
            ) : (
              <img src={thanku} alt="Thank you" className={verificationStatus === "failed" ? "opacity-50" : ""} />
            )}
          </div>
        </div>

        <h1 className="text-xl md:text-[30px] font-semibold text-[#383838]">
          {verificationStatus === "verifying" && "Verifying your payment..."}
          {verificationStatus === "success" && "Your Order is successfully Placed"}
          {verificationStatus === "failed" && "Payment Verification Failed"}
        </h1>

        <p className="text-[#383838] mt-2 text-sm sm:text-[24px]">
          {verificationStatus === "verifying" && "Please wait while we confirm your payment"}
          {verificationStatus === "success" && "Your product will be delivered in 3–5 working days"}
          {verificationStatus === "failed" && "Please contact support if payment was deducted"}
        </p>

        {verificationStatus === "success" && (
          <div className="mt-6">
            <button
              onClick={() => navigate("/profile?section=orders")}
              className="px-6 py-2 bg-[#1e3473] text-white rounded-lg hover:bg-[#162554] transition-colors"
            >
              View Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;
