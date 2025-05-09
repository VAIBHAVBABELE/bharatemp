import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import raspberry from '../../assets/rasperrybi.png';
import filtericon from '../../assets/filtericon.png';
import { IoFilter } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useCart } from '../../context/CartContext';

const Product = () => {
  const [activeTab, setActiveTab] = useState('Featured');
  const [price, setPrice] = useState(9999);
  const [showSidebar, setShowSidebar] = useState(false);

  const min = 50;
  const max = 9999;

  const products = [
    {
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  {
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  
  {
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  {
  id: 1,
  name: 'Raspberry Pi 4',
  description: 'With Wifi',
  image: raspberry,
  rating: 4.5,
  reviewCount: 15,
  price: 4029.5,
  originalPrice: 5029.5,
  deliveryDate: 'Friday, Jan 18',
  deliveryType: 'FREE Delivery',
},
{
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  {
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  {
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  {
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  {
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  {
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  {
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  {
    id: 1,
    name: 'Raspberry Pi 4',
    description: 'With Wifi',
    image: raspberry,
    rating: 4.5,
    reviewCount: 15,
    price: 4029.5,
    originalPrice: 5029.5,
    deliveryDate: 'Friday, Jan 18',
    deliveryType: 'FREE Delivery',
  },
  ];

  const tabs = ['Featured', 'On Sale', 'Top Rated'];

  const getFilteredProducts = () => {
    if (activeTab === 'On Sale') return products.slice(0, 4);
    if (activeTab === 'Top Rated') return products.slice(0, 3);
    return products;
  };

  const filteredProducts = getFilteredProducts();
  const percentage = ((price - min) / (max - min)) * 100;

  const handleSliderChange = (e) => {
    setPrice(Number(e.target.value));
  };

  const handleApply = () => {
    alert(`Filtering products below ₹${price}`);
  };

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden  top-5  left-6 z-50 bg-[#555d70] text-white px-4 py-2 rounded-full"
        onClick={() => setShowSidebar(true)}
      >
   <IoFilter size={20} />
      </button>

      {/* Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0  bg-opacity-40 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-4 py-6 lg:px-12 md:px-10 px-4 mx-auto">
        {/* Sidebar */}
        <div
          className={`
            fixed top-0 left-0 z-50 bg-white w-3/4 max-w-xs h-full p-4 rounded-r-3xl shadow-lg transition-transform duration-300
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            lg:static lg:translate-x-0 lg:w-1/4 lg:rounded-3xl h-[calc(150vh-3rem)]  space-y-6
          `}
        >
          <div className="flex justify-between items-center lg:hidden mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-[#132D6A] text-sm"
            >
             ✕
            </button>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold mb-2">Filter by Price</h3>
            <div className="flex items-center space-x-4 relative w-full">
              <input
                type="range"
                min={min}
                max={max}
                value={price}
                onChange={handleSliderChange}
                className="w-full appearance-none h-2 rounded-full"
                style={{
                  background: `linear-gradient(to right, #F97316 0%, #F97316 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
                  WebkitAppearance: 'none',
                  height: '6px',
                  borderRadius: '9999px',
                  outline: 'none',
                }}
              />
              <style>
                {`
                  input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 9999px;
                    background: #F97316;
                    cursor: pointer;
                    margin-top: -5px;
                  }
                  input[type="range"]::-moz-range-thumb {
                    height: 16px;
                    width: 16px;
                    border-radius: 9999px;
                    background: #F97316;
                    cursor: pointer;
                  }
                `}
              </style>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm font-semibold">Price: ₹{price} – ₹{max}</p>
              <button
                onClick={handleApply}
                className="px-4 py-1 text-sm bg-[#132D6A] rounded-3xl text-white hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Filter Sections */}
          {[
            {
              title: 'Filter by Price',
              items: ['Under ₹500', '₹500 - ₹999', '₹1000 - ₹1999', '₹2000 - ₹4999', '₹5000 - ₹9999', 'Over ₹10000']
            },
            {
              title: 'Filter by Categories',
              items: Array(6).fill('Drone Parts')
            },
            {
              title: 'Filter by Color',
              items: ['White', 'Black', 'Grey', 'Brown', 'Blue', 'Green']
            }
          ].map((filter, i) => (
            <div key={i}>
              <h3 className="bg-[#f7941d] rounded-3xl text-white px-4 py-1 lg:text-[20px] text-sm font-bold mb-2">
                {filter.title}
              </h3>
              <ul className="space-y-1  ">
                {filter.items.map((label, index) => (
                  <li key={index} className="flex justify-between  ">
                    <label className='text-sm text-[#000000] '>
                      <input type="checkbox" className="mr-2" />
                      {label}
                    </label>
                    <span className='text-[#F7941D] bg-[#F8F8F8] rounded-full px-2 '>4</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Filter by Brand */}
          <div>
            <h3 className="bg-[#f7941d] rounded-3xl text-white px-4 py-1 lg:text-[20px] text-sm font-bold my-2">
              Filter by Brand
            </h3>
            <div className="grid md:grid-cols-3 grid-cols-2 gap-1 my-2">
              {Array(6).fill('Raspberry Pi').map((brand, index) => (
                <span key={index} className="flex items-center gap-1 bg-gray-200 text-[10px] font-semibold px-3 py-2 rounded-3xl">
                  <img src={filtericon} className="w-2 h-2" alt="icon" />
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid Section */}
        <div className="lg:w-3/4 w-full">
          <div className="border-b border-[#797979] flex items-center justify-between mb-4">
            <div className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 font-medium text-sm md:text-base lg:text-lg relative ${
                    activeTab === tab ? 'text-[#333333] font-bold' : 'text-gray-500'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute left-0 -bottom-0.5 w-full h-1 bg-orange-400 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
            <Link
              to="/product"
              className="text-sm md:text-base lg:text-lg text-[#333333] hover:text-black flex items-center"
            >
              View All Products <span className="ml-1">›</span>
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-contain mb-4"
                />
                <h2 className="text-sm font-semibold text-[#1E3473]">{product.name}</h2>
                <p className="text-sm text-[#D9D3D3]">{product.description}</p>
                <div className="flex items-center text-[#F7941D] text-sm mt-2">
                  {Array(5).fill().map((_, i) =>
                    i < Math.floor(product.rating) ? (
                      <FaStar key={i} />
                    ) : i < product.rating ? (
                      <FaStarHalfAlt key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    )
                  )}
                  <span className="text-gray-500 ml-2 text-xs">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-[16px] font-semibold text-[#000000]">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm line-through text-gray-400 ml-2">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-700">
                  Get it <strong>{product.deliveryDate}</strong>
                  <p className="text-[#ABA1A1]">{product.deliveryType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
