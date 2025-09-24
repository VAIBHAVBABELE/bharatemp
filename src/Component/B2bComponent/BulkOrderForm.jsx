import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const backend = import.meta.env.VITE_BACKEND;

const BulkOrderForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    productName: '',
    quantity: '',
    description: '',
    expectedPrice: '',
    deliveryTimeline: '',
    gstNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backend}/bulk-enquiry/bulk-order-request`, {
        ...formData,
        requestDate: new Date().toISOString(),
        status: 'Pending'
      });

      if (response.data.status === 'Success') {
        toast.success('Bulk order request submitted successfully! We will contact you soon.');
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          productName: '',
          quantity: '',
          description: '',
          expectedPrice: '',
          deliveryTimeline: '',
          gstNumber: '',
          address: ''
        });
      } else {
        toast.error('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting bulk order request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1E3473] mb-4">
          Request Bulk Order Quote
        </h2>
        <p className="text-gray-600">
          Get customized pricing for bulk orders. Fill out the form below and our team will contact you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Contact Person *
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
              placeholder="Enter contact person name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Product Name/Category *
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
              placeholder="Enter product name or category"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Quantity Required *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Expected Price Range
            </label>
            <input
              type="text"
              name="expectedPrice"
              value={formData.expectedPrice}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
              placeholder="e.g., ₹100-200 per unit"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Delivery Timeline
            </label>
            <select
              name="deliveryTimeline"
              value={formData.deliveryTimeline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
            >
              <option value="">Select timeline</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="2-4 weeks">2-4 weeks</option>
              <option value="1-2 months">1-2 months</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              GST Number
            </label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
              placeholder="Enter GST number (optional)"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Delivery Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent resize-none"
            placeholder="Enter complete delivery address"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Additional Requirements/Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent resize-none"
            placeholder="Describe your specific requirements, technical specifications, or any other details..."
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-[#1E3473] mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Our team will review your request within 24 hours</li>
            <li>• We'll contact you with a customized quote</li>
            <li>• Negotiate terms and finalize the order</li>
            <li>• Fast delivery with dedicated support</li>
          </ul>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#f7941d] hover:bg-[#e88a1a] cursor-pointer'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Bulk Order Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkOrderForm;