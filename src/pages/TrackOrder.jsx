import React from 'react';
import { FaShippingFast } from 'react-icons/fa';

const TrackOrder = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <FaShippingFast className="text-[#1E3473] text-6xl" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E3473] mb-4">
          Order Tracking
        </h1>
        <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
          Our order tracking system is coming soon! You'll be able to track your orders in real-time.
        </p>
        <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-[#F7941D] font-medium">
            Stay tuned for updates! We're working hard to bring you this feature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder; 