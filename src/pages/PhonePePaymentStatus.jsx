import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../utils/LoadingSpinner';

const backend = import.meta.env.VITE_BACKEND;

const PhonePePaymentStatus = () => {
  const { paymentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const parsedToken = token?.startsWith('"') ? JSON.parse(token) : token;

        if (!parsedToken) {
          toast.error('Authentication required');
          navigate('/login');
          return;
        }

        // Get transaction ID from URL params
        const transactionId = searchParams.get('transactionId') || searchParams.get('transaction_id');
        const status = searchParams.get('status');
        
        // Check if payment was cancelled
        if (status === 'CANCELLED' || status === 'FAILED') {
          navigate(`/phonepe-payment-cancel/${paymentId}?${searchParams.toString()}`);
          return;
        }
        
        if (!transactionId) {
          throw new Error('Transaction ID not found');
        }

        // Verify payment with backend
        const merchantTransactionId = searchParams.get('merchantTransactionId') || 
                                     searchParams.get('merchant_transaction_id') || 
                                     paymentId;
        
        const verificationData = {
          paymentId: paymentId,
          merchantTransactionId: merchantTransactionId
        };
        
        console.log('Verifying payment with data:', verificationData);

        const response = await axios.post(
          `${backend}/payment/verify-phonepe-payment`,
          verificationData,
          {
            headers: {
              Authorization: `Bearer ${parsedToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Payment verification response:', response.data);
        
        if (response.data?.status === 'Success') {
          const verificationResult = response.data.data;
          
          if (verificationResult.message?.includes('Successfully') || verificationResult.data?.success) {
            setPaymentStatus('SUCCESS');
            setOrderDetails({
              orderId: verificationResult.orderId,
              totalAmount: verificationResult.data?.amount || 'N/A'
            });
            toast.success('Payment successful!');
            
            // Clear any pending payment data
            sessionStorage.removeItem('pendingPayment');
          } else {
            setPaymentStatus('FAILED');
            toast.error('Payment verification failed');
          }
        } else {
          setPaymentStatus('FAILED');
          toast.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('FAILED');
        toast.error('Payment verification failed');
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      verifyPayment();
    } else {
      setLoading(false);
      setPaymentStatus('FAILED');
      toast.error('Invalid payment reference');
    }
  }, [paymentId, searchParams, navigate]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {paymentStatus === 'SUCCESS' ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your bulk order has been placed successfully. You will receive a confirmation email shortly.
            </p>
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Order Details:</h3>
                <p className="text-sm text-gray-600">Order ID: {orderDetails.orderId}</p>
                <p className="text-sm text-gray-600">Amount: ₹{orderDetails.totalAmount}</p>
                <p className="text-sm text-gray-600">Payment Method: PhonePe</p>
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={handleViewOrders}
                className="w-full bg-[#1e3473] text-white py-3 px-4 rounded-lg hover:bg-[#162554] transition-colors"
              >
                View My Orders
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              Unfortunately, your payment could not be processed. Please try again or contact support.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-[#1e3473] text-white py-3 px-4 rounded-lg hover:bg-[#162554] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhonePePaymentStatus;