import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import loginVideo from "../assets/Loginvideo.mp4";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const comingFromCart = location.state?.from === "cart";

  const backend = import.meta.env.VITE_BACKEND;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${backend}/auth/login`, {
        email,
        password
      });

      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        toast.success("Login successful");
        setTimeout(() => {
          if (comingFromCart) {
            navigate("/cart");
          } else {
            navigate("/");
          }
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.data?.message || "Invalid email or password";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      // Redirect to backend Google OAuth endpoint
      const redirectUrl = `${backend}/auth/google`;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to initiate Google sign-in');
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Video background */}  
        <div className="w-full lg:w-3/5 h-48 sm:h-64 lg:h-auto lg:flex items-center justify-center relative">
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <video 
            src={loginVideo} 
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 z-20 text-white">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Welcome to Bharatronix</h2>
            <p className="text-sm sm:text-base lg:text-lg opacity-90">Your trusted electronics partner</p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-2/5 flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-lg">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-sm sm:text-base text-gray-600">Please sign in to your account</p>
            </div>

            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                <p className="text-xs sm:text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f7941d] focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f7941d] focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash size={16} className="sm:w-[18px] sm:h-[18px]" /> : <FaEye size={16} className="sm:w-[18px] sm:h-[18px]" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#f7941d] hover:bg-[#e8851a] text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    <span className="text-sm sm:text-base">Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-4 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="mt-3 sm:mt-4 w-full flex items-center justify-center px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || googleLoading}
              >
                {googleLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-gray-600 mr-2"></div>
                ) : (
                  <FaGoogle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />
                )}
                {googleLoading ? "Connecting..." : "Sign in with Google"}
              </button>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#f7941d] hover:text-[#e8851a] font-medium transition-colors duration-200">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-3 sm:mt-4 text-center">
              <Link to="/forgot-password" className="text-xs sm:text-sm text-gray-500 hover:text-[#f7941d] transition-colors duration-200">
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login; 