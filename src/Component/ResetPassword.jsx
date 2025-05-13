import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND || 'http://localhost:8080';

  // Check if user is allowed to be on this page
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    const otpVerified = sessionStorage.getItem('otpVerified');
    
    if (!storedEmail || !otpVerified) {
      // Redirect to forgot password if no email is stored or OTP isn't verified
      navigate('/forgot-password');
      return;
    }
    
    setEmail(storedEmail);
  }, [navigate]);

  // Handle password reset
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Password strength validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special character");
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(`${backend}/auth/change-password`, {
        email,
        newPassword: password,
      });

      if (response.data.status === "Success") {
        toast.success("Password reset successfully");
        // Clear session storage
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('otpVerified');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = 
        error.response?.data?.data?.message || 
        error.response?.data?.message || 
        "Failed to reset password. Please try again later.";
      
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
              <h1 className="text-4xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-gray-300 mb-10 text-sm">
                Create a new password for your account
              </p>
              
              {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-white mb-1 text-sm">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-3 rounded-lg bg-white pr-10 text-sm"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-white mb-1 text-sm">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-3 py-3 rounded-lg bg-white pr-10 text-sm"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="mb-6 text-white text-xs">
                <p className="mb-1">Password must contain:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li className={password.length >= 8 ? "text-green-400" : ""}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? "text-green-400" : ""}>
                    One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(password) ? "text-green-400" : ""}>
                    One lowercase letter
                  </li>
                  <li className={/[0-9]/.test(password) ? "text-green-400" : ""}>
                    One number
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-400" : ""}>
                    One special character
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <button
                onClick={handleReset}
                className="w-full bg-[#f7941d] text-white py-3 cursor-pointer rounded-lg font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={loading}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-white text-xs hover:text-[#ff6b33]">
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword; 