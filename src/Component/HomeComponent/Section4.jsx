import { useState } from 'react';
import { IoBagOutline } from "react-icons/io5";
import image1 from '../../assets/homepage1.png'
import image2 from '../../assets/homepage2.png'
import image3 from '../../assets/homepage3.png'
import image4 from '../../assets/homepage4.png'
import image5 from '../../assets/homepage5.png'
import image6 from '../../assets/homepage6.png'
import { CiHeart } from "react-icons/ci";
import { Link } from 'react-router-dom';
const tabs = ['Featured', 'On Sale', 'Top Rated'];

const products = [
  {
    title: "Mark 34",
    brand: "Battery",
    price: 4029.5,
    oldPrice: 8029.5,
    tag: "NEW",
    tags: "BEST SELLER",
    image: image1,
  },
  {
    title: "RedBoard Plus",
    brand: "Spark Fun",
    price: 73529.5,
    oldPrice: 8029.5,
    tag: "NEW",
    tags: "BEST SELLER",
    image: image2,
  },
  {
    title: "Distance Sensor",
    brand: "Ultrasonic",
    price: 3529.5,
    oldPrice: 6029.5,
    tag: "New",
    tags: "BEST SELLER",
    image: image3,
  },
  {
    title: "Flight Controller",
    brand: "APM 2.8",
    price: 3529.5,
    oldPrice: 6029.5,
    tag: "NEW",
    tags: "2024 Edition",
    image: image4,
  },
  {
    title: "BLDC Motor",
    brand: "1800 KV",
    price: 32529.5,
    oldPrice: 6029.5,
    tag: "NEW",
    tags: "2024 Edition",
    image: image5,
  },
  {
    title: "Flight Controller",
    brand: "APM 3.1",
    price: 52529.5,
    oldPrice: 8029.5,
    tag: "NEW",
    tags: "BESTAirPods",
    image: image6,
  },
];

const ProductSlider = () => {
  const [activeTab, setActiveTab] = useState('Featured');

  // Filter products based on active tab
  const getFilteredProducts = () => {
    if (activeTab === 'On Sale') return products.slice(0, 4);
    if (activeTab === 'Top Rated') return products.slice(0, 3);
    return products; // Featured
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="h-auto  ">
      {/* Tabs */}
      <div className="border-b border-[#797979] flex items-center justify-between mb-4 ">
        <div className="flex   space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium lg:text-[23px] md:text-[13px]  text-[10px] relative ${activeTab === tab ? 'text-[#333333] font-bold ' : 'text-gray-500'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute left-0 -bottom-0.5 w-full h-1 bg-orange-400 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        <Link to="/product"
          className="lg:text-[23px] md:text-[13px]  text-[10px]  text-[#333333] hover:text-black flex items-center"
        >
          View All Products <span className="ml-1">›</span>
        </Link>
      </div>

      {/* Products Grid */}
      <div className=" w-full grid  grid-cols-1 md:grid-cols-2  lg:grid-cols-3  xl:grid-cols-6  gap-6   pb-6 scrollbar-hide">
        {filteredProducts.map((product, index) => (
          <div
            key={index}
            className="group border border-[#c2c2c2] rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 lg:h-[300px] hover:h-[320px] h-[330px] cursor-pointer">
            <div className="p-4 flex flex-col items-start relative">
              <p className="text-[14px] font-semibold text-[#D9D3D3] mb-1">{product.brand}</p>
              <h2 className="text-[18px] font-bold text-[#1E3473] mb-2">
                {product.title}
              </h2>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-32 object-contain mb-4"
              />
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="bg-[#f7941d] text-white md:text-[14px]  lg:text-[10px] font-semibold px-3 py-1 rounded-full">
                  {product.tag}
                </span>
                <span className="bg-gray-200 px-3 rounded-full">{product.tags}</span>
              </div>
              <div className=" w-full flex  justify-between items-center  mb-2">

                <div className="flex items-center gap-2">
                  <p className="lg:text-[15px] text-[12px]  font-bold text-[#000000]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm line-through text-gray-400">
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex justify-end items-end">
                  <span className="rounded-full group-hover:bg-[#336570] justify-between py-3 px-3  bg-white border border-[#797979]">
                    <IoBagOutline
                      size={15}
                      className="group-hover:text-white text-black"
                    />
                  </span>
                </div>
              </div>
              <hr />
              <div className=" absolute -bottom-5 gap-1 left-0 w-full border-t border-gray-200 bg-white text-[#5D5D5D] px-2 py-2 flex justify-between items-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-900 rounded-b-2xl">
                <button className="flex items-center text-sm hover:text-black">
                  <span className="mr-1"><CiHeart size={16} /></span> Add to Wishlist
                </button>
                <button className="flex items-center text-sm hover:text-black">
                  <span className="mr-1">🛒</span> Buy Now
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
