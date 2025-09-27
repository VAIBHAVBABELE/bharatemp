import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentFallback = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Check for pending payment
    const pendingPayment = sessionStorage.getItem('pendingPayment');
    
    if (pendingPayment) {
      try {
        const paymentData = JSON.parse(pendingPayment);
        const { orderId, timestamp } = paymentData;
        
        // Check if payment is recent (within 30 minutes)
        const isRecent = Date.now() - timestamp < 30 * 60 * 1000;
        
        if (isRecent && orderId) {
          // Redirect to payment status page
          navigate(`/payment-status/${orderId}?fallback=true`);
          return;
        }
      } catch (error) {
        console.error('Error parsing pending payment:', error);
      }
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Gateway Issue</h1>
        
        <p className="text-gray-600 mb-6">
          We're experiencing technical difficulties with the payment gateway. 
          This might be due to network issues or temporary service unavailability.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What you can do:</h3>
          <ul className="text-sm text-blue-800 text-left space-y-1">
            <li>• Try refreshing the page</li>
            <li>• Check your internet connection</li>
            <li>• Try again in a few minutes</li>
            <li>• Contact support if issue persists</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full bg-[#1e3473] text-white py-3 px-4 rounded-lg hover:bg-[#162554] transition-colors"
          >
            Try Payment Again
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go to Home ({countdown}s)
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          If you continue to face issues, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentFallback;