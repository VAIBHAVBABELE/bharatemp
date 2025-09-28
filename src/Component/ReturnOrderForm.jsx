import React, { useState } from 'react';
import { X, Package, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const backend = import.meta.env.VITE_BACKEND;

const ReturnOrderForm = ({ order, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    return_reason: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const returnReasons = [
    'Defective/Damaged Product',
    'Wrong Item Received',
    'Size/Specification Issue',
    'Product Not as Described',
    'Quality Issues',
    'Changed Mind',
    'Other'
  ];

  const isReturnEligible = (orderDate) => {
    const orderTime = new Date(orderDate);
    const currentTime = new Date();
    const daysDiff = Math.floor((currentTime - orderTime) / (1000 * 60 * 60 * 24));
    return daysDiff <= 15; // 15 days return policy
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.return_reason) {
      toast.error('Please select a return reason');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
      const decoded = jwtDecode(parsedToken);
      const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;

      const returnData = {
        user_id: userId,
        order_id: order._id,
        return_reason: formData.return_reason + (formData.description ? ` - ${formData.description}` : ''),
        refund_amount: order.totalPrice
      };

      const response = await axios.post(
        `${backend}/returnRequest/create`,
        returnData,
        {
          headers: {
            'Authorization': `Bearer ${parsedToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'Success') {
        toast.success('Return request submitted successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to submit return request');
      }
    } catch (error) {
      console.error('Return request error:', error);
      toast.error(error.response?.data?.data?.message || 'Failed to submit return request');
    } finally {
      setLoading(false);
    }
  };

  if (!isReturnEligible(order.created_at)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-red-600">Return Not Available</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              This order is not eligible for return. Returns are only available within 15 days of delivery.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Return Order</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-medium text-green-600">₹{order.totalPrice?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Items to Return</h4>
          <div className="space-y-3">
            {order.products.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <img
                  src={item.product_id.product_image_main}
                  alt={item.product_id.product_name}
                  className="w-12 h-12 object-contain rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product_id.product_name}</p>
                  <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Return *
            </label>
            <select
              value={formData.return_reason}
              onChange={(e) => setFormData({...formData, return_reason: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a reason</option>
              {returnReasons.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Please provide additional details about the issue..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Return Policy</p>
                <ul className="space-y-1 text-xs">
                  <li>• Returns accepted within 15 days of delivery</li>
                  <li>• Items must be in original condition</li>
                  <li>• Refund will be processed within 5-7 business days</li>
                  <li>• Return pickup will be arranged after approval</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnOrderForm;