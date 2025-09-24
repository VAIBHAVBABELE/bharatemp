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
    toast.info('Google Sign-In will be available soon!');
    // TODO: Backend Google OAuth endpoint needs to be implemented
    // window.location.href = `${backend}/auth/google`;
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex">
        {/* Left side - Video background   isse implement kar diya hu*/}  
        <div className="w-3/5 lg:flex items-center justify-center hidden relative">
          <div className="absolute inset-0 bg-black/10 z-10"></div>
          <video 
            src={loginVideo} 
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-8 z-20 text-white">
            <h2 className="text-3xl font-bold mb-2">Welcome to Bharatronix</h2>
            <p className="text-lg opacity-90">Your trusted electronics partner</p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-2/5 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Please sign in to your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f7941d] focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f7941d] focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#f7941d] hover:bg-[#e8851a] text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || googleLoading}
              >
                {googleLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                ) : (
                  <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                )}
                {googleLoading ? "Connecting..." : "Sign in with Google"}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#f7941d] hover:text-[#e8851a] font-medium transition-colors duration-200">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-[#f7941d] transition-colors duration-200">
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