import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Authentication failed. Please try again.');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
        <p className="text-gray-600 mb-4">Something went wrong during authentication.</p>
        <p className="text-sm text-gray-500">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default AuthError;