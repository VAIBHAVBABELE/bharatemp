import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const backend = import.meta.env.VITE_BACKEND || 'http://localhost:8080';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${backend}/auth/test-mail`, {
        email
      });

      if (response.data.status === "Success") {
        setSuccess(true);
        toast.success("OTP sent to your email address");
        // Store email in sessionStorage to use in verification page
        sessionStorage.setItem('resetEmail', email);
        setTimeout(() => {
          navigate("/verify-otp");
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMessage = error.response?.data?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex">
        {/* Left side - Dark background */}
        <div className="w-[55%] md:flex items-center justify-center hidden py-8">
          {/* This is the dark left side */}
          <div className="w-[90%] h-[650px] rounded-2xl bg-[#32333b]"></div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-[45%] py-8 flex items-center justify-center">
          <div className="w-[85%] h-[550px] md:h-[650px] flex flex-col justify-between p-6 md:p-8 lg:p-12 bg-[#1E3473] rounded-[35px]">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Forgot Password</h1>
              <p className="text-gray-300 mb-10 text-sm">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
              
              {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
                  OTP has been sent to your email address. Redirecting to verification page...
                </div>
              )}

              <div className="mb-8">
                <label className="block text-white mb-1 text-sm">Email address</label>
                <input
                  type="email"
                  className="w-full px-3 py-3 rounded-lg bg-white text-sm"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                />
              </div>

              <div className="flex items-center mb-4">
                <p className="text-white text-sm">Remember your password?</p>
                <Link to="/login" className="ml-2 text-[#ff6b33] font-medium text-sm">
                  Login
                </Link>
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="w-full bg-[#f7941d] text-white py-3 cursor-pointer rounded-lg font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={loading || success}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              <div className="text-center">
                <Link to="/signup" className="text-white text-xs hover:text-[#ff6b33]">
                  Don't have an account? Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword; 