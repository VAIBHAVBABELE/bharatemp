import React from 'react';

const ShimmerUI = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div key={item} className="border rounded-lg p-4 h-[300px]">
          {/* Image shimmer */}
          <div className="w-full h-40 bg-gray-200 rounded-lg animate-shimmer"></div>
          
          {/* Title shimmer */}
          <div className="w-3/4 h-4 mt-4 bg-gray-200 rounded animate-shimmer"></div>
          
          {/* Price shimmer */}
          <div className="w-1/4 h-4 mt-4 bg-gray-200 rounded animate-shimmer"></div>
          
          {/* Button shimmer */}
          <div className="w-full h-8 mt-4 bg-gray-200 rounded-full animate-shimmer"></div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerUI; 