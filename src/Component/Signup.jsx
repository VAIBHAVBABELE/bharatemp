import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Use and Privacy Policy");
      return;
    }

    if (!name || !email || !password || !phone) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      setError("Name should only contain alphabets and spaces");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${backend}/auth/signup`, {
        name,
        email,
        password,
        phone,
      });

      if (response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        toast.success("Signup successful");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred during signup";
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
          <div className="w-[90%] h-[650px] rounded-2xl bg-[#32333b]"></div>
        </div>

        {/* Right side - Signup form */}
        <div className="w-full md:w-[45%] py-8 flex items-center justify-center">
          <div className="w-[85%] h-[550px] md:h-[650px] flex flex-col justify-between p-6 md:p-8 lg:p-12 bg-[#1E3473] rounded-[35px]">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Sign Up</h1>

              {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-white mb-1 text-sm">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-white text-sm"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(input)) {
                      setName(input);
                    }
                  }}
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-white mb-1 text-sm">Email address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded-lg bg-white text-sm"
                  placeholder="Sample@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-white mb-1 text-sm">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 rounded-lg bg-white text-sm"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (/^\d*$/.test(input)) {
                      setPhone(input);
                    }
                  }}
                  maxLength={10}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-white mb-1 text-sm">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 rounded-lg bg-white pr-10 text-sm"
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

              {/* Already have an account */}
              <div className="flex items-center mb-4">
                <p className="text-white text-sm">Already have an account?</p>
                <Link
                  to="/login"
                  className="ml-2 text-[#ff6b33] font-medium text-sm"
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* Submit + Terms */}
            <div>
              <button
                onClick={handleSubmit}
                className="w-full bg-[#f7941d] text-white py-3 cursor-pointer rounded-lg font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-2 mt-1 h-3 w-3 accent-[#f7941d]"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                  disabled={loading}
                />
                <label htmlFor="terms" className="text-white text-xs">
                  By clicking Create account, I agree that I have read and
                  accepted the Terms of Use and Privacy Policy.
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
