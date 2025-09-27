import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const backend = import.meta.env.VITE_BACKEND;

const PaymentRetry = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const parsedToken = token?.startsWith('"') ? JSON.parse(token) : token;

      const response = await axios.get(`${backend}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${parsedToken}`
        }
      });

      if (response.data?.status === 'Success') {
        setOrderDetails(response.data.data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Unable to fetch order details');
    }
  };

  const retryPayment = async () => {
    if (!orderDetails) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const parsedToken = token?.startsWith('"') ? JSON.parse(token) : token;

      // Create new payment for existing order
      const paymentData = {
        orderId: orderDetails._id,
        userId: orderDetails.user_id,
        MUID: "T" + Date.now(),
        FRONTEND_URL: window.location.origin
      };

      const paymentResponse = await axios.post(
        `${backend}/payment/create-phonepe-payment`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (paymentResponse.data?.data?.response?.phonepeResponse?.redirectUrl) {
        window.location.href = paymentResponse.data.data.response.phonepeResponse.redirectUrl;
      } else {
        throw new Error('Payment gateway redirect URL not found');
      }
    } catch (error) {
      console.error('Payment retry error:', error);
      toast.error('Failed to retry payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const parsedToken = token?.startsWith('"') ? JSON.parse(token) : token;

      await axios.post(
        `${backend}/order/${orderId}/update`,
        { status: 'CANCELLED' },
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`
          }
        }
      );

      toast.success('Order cancelled successfully');
      navigate('/');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Pending</h1>
          <p className="text-gray-600">Your order is created but payment is incomplete</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Order Details:</h3>
          <p className="text-sm text-gray-600">Order ID: {orderDetails._id}</p>
          <p className="text-sm text-gray-600">Amount: ₹{orderDetails.totalPrice}</p>
          <p className="text-sm text-gray-600">Status: {orderDetails.status}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={retryPayment}
            disabled={loading}
            className="w-full bg-[#1e3473] text-white py-3 px-4 rounded-lg hover:bg-[#162554] transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Retry Payment'}
          </button>
          
          <button
            onClick={cancelOrder}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel Order
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentRetry;