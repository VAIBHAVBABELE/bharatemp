import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
          navigate("/");
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

  return (
    <>
      <ToastContainer />
      <div className="flex">
        {/* Left side - Dark background */}
        <div className="w-[55%] md:flex items-center justify-center hidden py-8">
          {/* This is the dark left side */}
          <div className="w-[90%] h-[650px] rounded-2xl bg-[#32333b]"></div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-[45%] py-8 flex items-center justify-center">
          <div className="w-[85%] h-[550px] md:h-[650px] flex flex-col justify-between p-6 md:p-8 lg:p-12 bg-[#1E3473] rounded-[35px]">
            <div>
              <h1 className="text-4xl font-bold text-white mb-10">Login</h1>
              
              {error && (
                <div className="mb-3 p-2 flex justify-center items-center bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="mb-8">
                <label className="block text-white mb-1 text-sm">Email address</label>
                <input
                  type="email"
                  className="w-full px-3 py-3 rounded-lg bg-white text-sm"
                  placeholder="Sample@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="mb-8">
                <label className="block text-white mb-1 text-sm">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-3 rounded-lg bg-white pr-10 text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
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

              <div className="flex items-center mb-4">
                <p className="text-white text-sm">Don't have an account?</p>
                <Link to="/signup" className="ml-2 text-[#ff6b33] font-medium text-sm">
                  Sign up
                </Link>
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="w-full bg-[#f7941d] text-white py-3 cursor-pointer rounded-lg font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="text-center">
                <Link to="/forgot-password" className="text-white text-xs hover:text-[#ff6b33]">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login; 