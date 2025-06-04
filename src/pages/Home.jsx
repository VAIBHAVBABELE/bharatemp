import React, { useEffect, useState } from "react";
import Section1 from "./../Component/HomeComponent/Section1";
import Section2 from "./../Component/HomeComponent/Section2";
import Section3 from "./../Component/HomeComponent/Section3";
import Section4 from "./../Component/HomeComponent/Section4";
import image7 from "./../assets/homepage12.png";
import vector1 from "./../assets/Vector1.png";
import vector2 from "./../assets/Vector2.png";
import image1 from "./../assets/homepage9.png";
import image2 from "./../assets/homepage8.png";
import vector3 from "./../assets/Vector3.png";
import Section5 from "./../Component/HomeComponent/Section5";
import image8 from "../assets/homepage8.png";
import image9 from "../assets/homepage9.png";
import icon4 from "../assets/icon4.png";
import image10 from "../assets/homepage10.png";
import blue from "../assets/green.png";
import top1 from '../assets/generator.png'
import top2  from '../assets/top1.png'
import cart1 from '../assets/Cart4.png';
import cart2 from '../assets/cart5.png';
import cart3 from '../assets/cart6.png';
// import InstagramCarousel from "../Component/HomeComponent/Instagram";
import InstagramSection from "../Component/InstagramSection";
// import Testimonials from "../Component/Testimonials";
import { fetchProducts } from "../utils/api";
import Customers from '../Component/B2bComponent/Customers.jsx'
import Marquee from "../Component/HomeComponent/Marquee.jsx";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch products from the backend
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };
    
    getProducts();
  }, []);

  const cardData = [
  {
    image: top1,
    title: 'Raspberry Pi',
    version: '1.2.3',
  },
  {
    image: top2,
    title: 'Raspberry Pi',
    version: '1.2.3',
  },
  {
  image: top2,
    title: 'Raspberry Pi',
    version: '1.2.3',
  },
  {
  image: top2,
    title: 'Raspberry Pi',
    version: '1.2.3',
  },
  {
    image: top2,
    title: 'Raspberry Pi',
    version: '1.2.3',
  }
];
const features = [
    {
       img: cart1,
      title: '100% Original Products',
      subtitle: 'We Only sell genuine Products',
    },
    { img: cart2,
      title: 'Secure Payment',
      subtitle: 'We Only sell genuine Products',
    },
    {
      img: cart3,
      title: '24×7 Technical support available',
      subtitle: 'We Only sell genuine Products',
    },
  ];

  return (
    <>
    <div className="px-4 md:px-10 pt-6">
{/* top section */}
        <div className=" py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-[#F5F5F5] border-1 border-[#E0E0E0] rounded-2xl shadow px-3 flex flex-col md:flex-row items-center justify-between text-center"
          >
           <div>
            <h2 className="text-lg font-semibold text-blue-900">{card.title}</h2>
            <p className="text-sm text-gray-500">Version {card.version}</p>
             </div>
             <div className="">
             <img
              src={card.image}
              alt={card.title}
              className="w-20 h-20 object-cover mb-2"
            />
            </div>
          </div>
        ))}
      </div>
    </div>
      <div className="bg-[#000127] w-full lg:h-[455px] h-auto lg:px-20 md:px-12 px-6 rounded-2xl p-6 flex flex-col lg:flex-row  gap-10 relative overflow-hidden ">
        {/* Left: Text Section */}
        <div className="flex-1 md:w-1/2 w-full lg:text-left">
          <h2 className="md:text-[33.12px] text-[20px] text-[#FFFFFF] font-semibold">
            Rasberry Pie
          </h2>
          <h1 className="lg:text-[83.69px] text-[40px]  font-bold leading-20 text-[#FFFFFF] ">
           Model 5
          </h1>
          <p className="text-[#999999] text-[16.99px] lg:pt-12 pt-6">
            BE THE FIRST TO OWN
          </p>
          <p className="text-[23px] text-[#FFFFFF] mt-2">From </p>
          <div className="flex  gap-10 items-center leading-3  ">
            <span className="  text-[39.75px] text-[#FFFFFF] ">₹399</span>
            <button className="mt-4 bg-[#1e3473] hover:bg-orange-600 text-white py-4 px-6 rounded-full text-[12px] lg:text-[19.54px] font-medium">
              Discover Now
            </button>
          </div>
          {/* Icons */}
          <div className="flex flex-col md:flex-row gap-6 pt-6  ">
            <div className="flex items-center gap-2 font-[outfit]">
              <img src={vector1} className="text-xl text-[#FFFFFF]" />
              <span className="text-[#FFFFFF] text-[14.42px]">
                Transparent
                <br />
                Customer service
              </span>
            </div>
            <div className="flex items-center gap-2 font-[outfit] ">
              <img src={vector2} className="text-xl text-[#FFFFFF]" />
              <span className="text-[#FFFFFF] text-[14.42px]">
                Shipping <br /> Free,fast and reliable in India
              </span>
            </div>
            <div className="flex items-center gap-2 font-[outfit]">
              <img src={vector3} className="text-xl text-[#FFFFFF]" />
              <span className="text-[#FFFFFF] text-[14.42px]">
                Secure
                <br />
                Certified and trustworthy marketplace
              </span>
            </div>
          </div>
        </div>

        {/* Right: Image Section */}
        <div className="absolute right-0 bottom-0 hidden lg:block">
          <div className="  relative lg:w-[550px] md:w-[350px] w-[150px]  ">
            <img
              src={image7}
              className=" object-contain rounded-2xl relative z-40"
            />
            <img 
              src={blue} 
              className="absolute -top-24 -left-44 w-full h-[480px] z-10 " 
            />
          </div>
        </div>
      </div>

    
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10  py-6 ">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-4  py-2 rounded-2xl bg-[#F5F5F5] border-1 border-[#E0E0E0] shadow-sm"
          >
            <img src= {feature.img} className="  p-2 rounded-lg"
              
            />
            <div>
              <h3 className="text-sm font-bold text-blue-900">{feature.title}</h3>
              <p className="text-sm text-orange-500">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>


      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3473]"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
          <Section1 products={products} />
          <Section2 products={products} />
          <Section3 />
          <Section1 products={products} />
          <Section5 />
          <InstagramSection/>
          {/* <Testimonials/> */}
          <Customers/>
          
        </>
      )}
     
    </div>
     <Marquee/>
     </>
  );
};

export default ProductSlider;
