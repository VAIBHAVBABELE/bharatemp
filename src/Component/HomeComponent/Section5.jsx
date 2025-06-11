import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import image1 from '../../assets/elect.png'
import image2 from '../../assets/rasperrybi.svg'
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
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const navigate = useNavigate();
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);
 
  const slide = slides[current];

  // Handle add to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent propagation
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.img,
      reviews: product.reviews,
      rating: product.rating
    });
  };

  // Handle shop now / buy now
  const handleShopNow = (e) => {
    e.preventDefault();
    // Add the current slide's product to cart
    addToCart({
      id: slide.product.id,
      name: slide.product.title,
      price: slide.product.price,
      originalPrice: slide.product.originalPrice,
      image: slide.product.img,
      reviews: slide.product.reviews,
      rating: slide.product.rating
    });
    // Navigate to cart
    navigate('/cart');
  };

  // Handle view product details
  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
    localStorage.setItem('selectedProduct', JSON.stringify({
      id: product.id,
      name: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.img,
      reviews: product.reviews,
      rating: product.rating
    }));
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
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full w-36 text-sm"
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
          <div 
            className="border border-gray-200 rounded-xl shadow-sm w-full p-4 cursor-pointer"
            onClick={() => handleViewProduct(slide.product)}
          >
            <div className="flex justify-between">
              <button className="w-[160px] border border-gray-300 rounded-3xl p-2 flex items-center justify-center gap-1 text-sm font-medium hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Add to Wishlist
              </button>
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center border ${isInCart(slide.product.id) ? 'bg-[#f7941d] border-[#f7941d] text-white' : 'border-gray-300 text-gray-600'} hover:bg-gray-50`}
                onClick={(e) => handleAddToCart(e, slide.product)}
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
                src={slide.product.img}
                alt="Product"
                className="max-h-[120px] object-contain"
              />
            </div>
            
            <div className="flex flex-col">
              <h3 className="font-medium text-lg ">Rasberry Pie 4<br />With Wifi</h3>
              
              <div className="flex items-center mb-3">
                <div className="flex text-lg font-bold text-blue-600">
                  {'★'.repeat(slide.product.rating)}
                  {'☆'.repeat(5 - slide.product.rating)}
                </div>
                <span className="ml-2 text-gray-600 text-sm">({slide.product.reviews})</span>
              </div>
              
              <div className="mb-3">
                <span className="text-xl font-bold text-gray-900">
                  ₹{slide.product.price.toLocaleString()}
                </span>
                <span className="text-sm line-through text-gray-400 ml-2">
                  ₹{slide.product.originalPrice.toLocaleString()}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-1 bg-orange-500 rounded-full" 
                    style={{ width: `${(slide.product.sold / slide.product.total) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center mt-3">
                  <span className="text-sm text-gray-600">Sold: {slide.product.sold} / {slide.product.total}</span>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>
      </div>
     
      {/* Slider indicators */}
      <div className="flex gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-8 h-2 rounded-full ${index === current ? 'bg-[#002F6C]' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}
 