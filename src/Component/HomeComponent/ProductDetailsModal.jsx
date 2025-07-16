import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const [activeTab, setActiveTab] = useState("Features");

  if (!isOpen) return null;

  // Function to get YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Get video ID from product's video URL (you'll need to add this to your product data)
  const videoId = getYouTubeVideoId(product?.product_video_url);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed lg:top-1/2 md:top-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-3xl 
        max-h-[80vh] bg-white rounded-2xl z-50 shadow-xl px-4"
      >
        {/* Scrollable Content Area */}
        <div className="relative max-h-[80vh] overflow-y-auto p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-0 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>

          {/* Tabs */}
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4 mb-8">
            {["Features", "Specification", "Video", "Warranty"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[#F7941D] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "Features" && (
              <div>
                <h2 className="text-2xl font-bold text-[#2F294D] mb-6">
                  Features
                </h2>
                <div className="space-y-4">
                  {product?.product_feature?.split("\n").map(
                    (feature, index) =>
                      feature.trim() && ( // Only render if the line isn't empty
                        <div key={index} className="flex items-start">
                          <span>{feature.trim()}</span>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}

            {activeTab === "Specification" && (
              <div>
                <h2 className="text-2xl font-bold text-[#2F294D] mb-6">
                  Specifications
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {product?.product_specification?.[0]?.data?.map((spec) => (
                    <div key={spec._id} className="space-y-4">
                      <div className="border-b pb-2">
                        <h3 className="text-sm text-gray-500">{spec.key}</h3>
                        <p className="text-gray-700">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Video" && (
              <div>
                <h2 className="text-2xl font-bold text-[#2F294D] mb-6">
                  Product Video
                </h2>
                {videoId ? (
                  <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="Product Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-xl text-center">
                    <p className="text-gray-600">
                      No video available for this product.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Please check back later for product demonstrations and
                      tutorials.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Warranty" && (
              <div>
                <h2 className="text-2xl font-bold text-[#2F294D] mb-6">
                  Warranty Information
                </h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-[#2F294D] mb-2">
                      Warranty Period
                    </h3>
                    <p className="text-gray-600">
                      1 Year Limited Hardware Warranty
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-[#2F294D] mb-2">
                      Coverage
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Manufacturing defects</li>
                      <li>Hardware malfunctions</li>
                      <li>Technical support</li>
                      <li>Parts replacement</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-[#2F294D] mb-2">
                      Support Contact
                    </h3>
                    <p className="text-gray-600">
                      Email: support@bharatronix.com
                    </p>
                    <p className="text-gray-600">Phone: 1-800-123-4567</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsModal;
