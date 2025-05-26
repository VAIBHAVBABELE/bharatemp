import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import thanku from '../../assets/thanku.png';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderSuccess = () => {
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, success, failed
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL path
  const backend = import.meta.env.VITE_BACKEND;

  useEffect(() => {
    window.scrollTo(0, 0);
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Get payment ID from URL path
      const paymentId = id;      
      if (!paymentId) {
        setVerificationStatus("failed");
        toast.error("Payment verification failed: No payment ID found");
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

      // Verify payment
      const response = await axios.post(
        `${backend}/payment/verify-payment`,
        {
          paymentId: paymentId
        },
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        setVerificationStatus("success");
        localStorage.removeItem("cart");
        toast.success("Payment successful!", {
          onClose: () => {
            // Redirect to home page after toast is closed
            window.location.href = "/";
          }
        });
      } else {
        setVerificationStatus("failed");
        localStorage.removeItem("cart");
        toast.error(response.data.message || "Payment verification failed", {
          onClose: () => {
            // Redirect to home page after toast is closed
            window.location.href = "/";
          }
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setVerificationStatus("failed");
      toast.error(error.response?.data?.message || "Payment verification failed", {
        onClose: () => {
          // Redirect to home page after toast is closed
          window.location.href = "/";
        }
      });
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
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-52 h-52 flex items-center justify-center">
            {verificationStatus === "verifying" ? (
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#F7941D]"></div>
            ) : (
              <img src={thanku} alt="Thank you" className={verificationStatus === "failed" ? "opacity-50" : ""} />
            )}
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-xl md:text-[30px] font-semibold text-[#383838]">
          {verificationStatus === "verifying" && "Verifying your payment..."}
          {verificationStatus === "success" && "Your Order is successfully Placed"}
          {verificationStatus === "failed" && "Payment Verification Failed"}
        </h1>

        {/* Subtext */}
        <p className="text-[#383838] mt-2 text-sm sm:text-[24px]">
          {verificationStatus === "verifying" && "Please wait while we confirm your payment"}
          {verificationStatus === "success" && "Your product will be delivered in 3–5 working days"}
          {verificationStatus === "failed" && "Please contact support if payment was deducted"}
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
