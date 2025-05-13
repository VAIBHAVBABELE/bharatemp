import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown
  const [resendDisabled, setResendDisabled] = useState(true);
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND || 'http://localhost:8080';

  // Set up references for OTP inputs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Get email from session storage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      // Redirect to forgot password if no email is stored
      navigate('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  // Countdown timer for resend option
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  // Handle OTP input change
  const handleChange = (index, e) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1); // Only take the first character
    setOtp(newOtp);
    
    // Auto-focus to next input after filling current one
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key press for backspace to go to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event to distribute across inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) return; // Only allow numbers
    
    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex].focus();
    } else {
      inputRefs.current[5].focus();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const fullOtp = otp.join('');
    
    if (fullOtp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${backend}/auth/verify-email-otp`, {
        email,
        otp: fullOtp
      });

      if (response.data.status === "Success") {
        toast.success("OTP verified successfully");
        // Store verification status in session
        sessionStorage.setItem('otpVerified', 'true');
        setTimeout(() => {
          navigate("/reset-password");
        }, 1500);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error.response?.data?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend}/auth/test-mail`, {
        email
      });

      if (response.data.status === "Success") {
        toast.success("New OTP sent to your email address");
        setOtp(["", "", "", "", "", ""]);
        setCountdown(120);
        setResendDisabled(true);
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      const errorMessage = error.response?.data?.data?.message || "Failed to resend OTP. Please try again.";
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
              <h1 className="text-4xl font-bold text-white mb-2">Verify OTP</h1>
              <p className="text-gray-300 mb-10 text-sm">
                Enter the 6-digit code sent to {email || "your email"}
              </p>
              
              {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="mb-8">
                <label className="block text-white mb-3 text-sm">Enter verification code</label>
                <div className="flex justify-between space-x-2 md:space-x-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => inputRefs.current[index] = el}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center text-xl font-bold border rounded-lg"
                      value={digit}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-white text-sm mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={resendOtp}
                  disabled={resendDisabled || loading}
                  className="text-[#ff6b33] font-medium text-sm disabled:text-gray-400"
                >
                  {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={verifyOtp}
                className="w-full bg-[#f7941d] text-white py-3 cursor-pointer rounded-lg font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={loading || otp.some(digit => !digit)}
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              <div className="text-center">
                <Link to="/forgot-password" className="text-white text-xs hover:text-[#ff6b33]">
                  Go back to forgot password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOTP; 