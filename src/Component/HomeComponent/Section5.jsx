import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import image1 from '../../assets/elect.webp'
import image2 from '../../assets/rasperrybi.svg'
import axios from 'axios';

const backend = import.meta.env.VITE_BACKEND;

const slides = [
  {
    id: 'raspberry1',
    title: 'RasBerry Pie Parts',
    subtitle: 'Rasberry Pie 3–7',
    price: '₹4,000',
    image: image1, // Replace with your real image URL
    product: {
      id: 'raspberry-pie-4',
      title: 'Rasberry Pie 4 With Wifi',
      rating: 4,
      reviews: 15,
      price: 4029.5,
      originalPrice: 4999,
      sold: 24,
      total: 80,
      img: image2, // Replace with product card image
    },
  },
  {
    id: 'raspberry2',
    title: 'RasBerry Pie Parts',
    subtitle: 'Rasberry Pie 3–7',
    price: '₹4,000',
    image: image1, // Replace with your real image URL
    product: {
      id: 'raspberry-pie-4-model2',
      title: 'Rasberry Pie 4 With Wifi',
      rating: 4,
      reviews: 15,
      price: 4029.5,
      originalPrice: 4999,
      sold: 24,
      total: 80,
      img: image2, // Replace with product card image
    },
  },
  {
    id: 'raspberry3',
    title: 'RasBerry Pie Parts',
    subtitle: 'Rasberry Pie 3–7',
    price: '₹4,000',
    image: image1, // Replace with your real image URL
    product: {
      id: 'raspberry-pie-4-model3',
      title: 'Rasberry Pie 4 With Wifi',
      rating: 4,
      reviews: 15,
      price: 4029.5,
      originalPrice: 4999,
      sold: 24,
      total: 80,
      img: image2, // Replace with product card image
    },
  },
  {
    id: 'raspberry4',
    title: 'RasBerry Pie Parts',
    subtitle: 'Rasberry Pie 3–7',
    price: '₹4,000',
    image:image1, // Replace with your real image URL
    product: {
      id: 'raspberry-pie-4-model4',
      title: 'Rasberry Pie 4 With Wifi',
      rating: 4,
      reviews: 15,
      price: 4029.5,
      originalPrice: 4999,
      sold: 24,
      total: 80,
      img: image2, // Replace with product card image
    },
  }
  // Add more slides if needed
];
 
export default function RaspberrySlider() {
  const [current, setCurrent] = useState(0);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const navigate = useNavigate();
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backend}/product/687cfe189236a645209627ab`);
        if (response.data) {
          setFeaturedProduct(response.data.data.product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, []);

 
  const slide = slides[current];

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (featuredProduct) {
      addToCart({
        id: featuredProduct._id,
        name: featuredProduct.product_name,
        price: featuredProduct.discounted_single_product_price,
        originalPrice: featuredProduct.non_discounted_price,
        image: featuredProduct.product_image_main,
        reviews: featuredProduct.no_of_reviews,
        rating: featuredProduct.review_stars
      });
    }
  };

  // Handle shop now / buy now
  const handleShopNow = (e) => {
    e.preventDefault();
    navigate(`/product`);
  };

  // Handle view product details
  const handleViewProduct = () => {
    if (featuredProduct) {
      navigate(`/product/${featuredProduct._id}`);
      localStorage.setItem('selectedProduct', JSON.stringify(featuredProduct));
    }
  };
 
  return (
    <div className="flex flex-col items-center justify-center bg-white font-[outfit] ">
      <div className="w-full flex gap-10 lg:h-[410px] h-auto items-center">
        {/* Left Slide */}
        <div className="w-full h-full bg-[#002F6C] rounded-xl p-4 text-white flex flex-col relative">
          <div className='px-6 pt-2'>
            <h2 className="lg:text-[57.11px] md:text-[40px] font-bold mb-1">{slide.title}</h2>
            <p className="text-xl text-cyan-400 mb-6">{slide.subtitle}</p>
            <p className="text-base font-medium mb-1">Starting From</p>
            <p className="text-4xl font-bold text-white mb-6">{slide.price}</p>
            <button 
              className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full w-36 text-sm"
              onClick={handleShopNow}
            >
              Shop Now
            </button>
          </div>
          <img
            src={slide.image}
            alt="Raspberry Slide"
            className="absolute rotate-360 tranform scale-x-[-1] right-0 object-contain bottom-0 rounded-2xl xl:w-[600px] sm:w-[400px] w-[200px]"
          />
        </div>
 
        {/* Right Product Card */}
        <div className="w-[25%] h-full lg:flex items-center justify-center hidden ">
          {featuredProduct && (
            <div 
              className="border border-gray-200 rounded-xl shadow-sm w-full p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={handleViewProduct}
            >
              <div className="flex justify-between">
                <button className="w-[160px] border cursor-pointer border-gray-300 rounded-3xl p-2 flex items-center justify-center gap-1 text-sm font-medium hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  Add to Wishlist
                </button>
                <button 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border ${isInCart(featuredProduct._id) ? 'bg-[#f7941d] cursor-pointer border-[#f7941d] text-white' : 'border-gray-300 text-gray-600'}`}
                  onClick={handleAddToCart}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </button>
              </div>
              <div className="relative flex justify-center items-center mb-6 py-4">
                <img
                  src={featuredProduct.product_image_main}
                  alt={featuredProduct.product_name}
                  className="max-h-[120px] object-contain"
                />
              </div>
              
              <div className="flex flex-col">
                <h3 className="font-medium text-lg text-[#1E3473]">{featuredProduct.product_name}</h3>
                <p className="text-sm text-gray-500">{featuredProduct.brand_name}</p>
                
                <div className="flex items-center mb-3">
                  <div className="flex text-lg font-bold text-blue-600">
                    {'★'.repeat(Math.floor(featuredProduct.review_stars || 0))}
                    {'☆'.repeat(5 - Math.floor(featuredProduct.review_stars || 0))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">
                    ({featuredProduct.no_of_reviews || 0})
                  </span>
                </div>
                
                <div className="mb-3">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{featuredProduct.discounted_single_product_price?.toLocaleString()}
                  </span>
                  <span className="text-sm line-through text-gray-400 ml-2">
                    ₹{featuredProduct.non_discounted_price?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
     
      {/* Slider indicators */}
      {/* <div className="flex gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-8 h-2 rounded-full ${index === current ? 'bg-[#002F6C]' : 'bg-gray-300'}`}
          />
        ))}
      </div> */}
    </div>
  );
}
 