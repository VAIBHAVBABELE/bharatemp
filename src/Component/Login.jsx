import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your login logic here
    console.log("Login with:", { email, password });
    
    // For demo purposes, navigate to home after login
    navigate("/");
  };

  return (
    <div className="flex ">
      {/* Left side - Dark background */}
      <div className="w-[55%] md:flex items-center justify-center hidden py-8">
        {/* This is the dark left side */}
        <div className="w-[90%] h-[650px] rounded-2xl bg-[#32333b]"></div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-[45%] py-8 flex items-center justify-center">
        <div className="w-[85%] h-[550px] md:h-[650px] flex flex-col justify-between p-6 md:p-10 lg:p-16 bg-[#1E3473]  rounded-[35px]">
            <div>
          <h1 className="text-4xl font-bold text-white mb-8">Login</h1>
          
          <div className="mb-6">
            <label className="block text-white mb-2">Email address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-white"
              placeholder="Sample@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg bg-white pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex items-center mb-8">
            <p className="text-white">Don't have an account?</p>
            <Link to="/signup" className="ml-2 text-[#ff6b33] font-medium">
              Sign in
            </Link>
          </div>
          </div>
           <div>
         

          <button
            className="w-full bg-[#f7941d] text-white py-3 rounded-lg font-medium mb-6"
          >
            Sign Up
          </button>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mr-2 mt-1 h-4 w-4 accent-[#f7941d]"
              checked={agreedToTerms}
              onChange={() => setAgreedToTerms(!agreedToTerms)}
            />
            <label htmlFor="terms" className="text-white text-sm">
              By clicking Create account, I agree that I have read and accepted the Terms of Use and Privacy Policy.
            </label>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 