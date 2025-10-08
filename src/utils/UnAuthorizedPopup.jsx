import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnAuthorizedPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignup = () => {
    onClose();
    navigate('/signup');
  };

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up Required</h3>
          <p className="text-gray-600 mb-6">
            You need to sign up first. Please create your account to continue.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={handleLogin}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={handleSignup}
              className="flex-1 px-4 py-2 bg-[#f7941d] text-white rounded-lg hover:bg-[#e88a1a] transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorizedPopup;