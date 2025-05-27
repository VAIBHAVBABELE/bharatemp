import {  CreditCard, Headset } from 'lucide-react';
import Marquee from "react-fast-marquee";
import cart1 from '../../assets/cart1.png';
import cart2 from '../../assets/cart2.png';
import cart3 from '../../assets/cart3.png';
import img1 from '../../assets/newlogo.png';
import img2 from '../../assets/newlogo2.png';
import img3 from '../../assets/newlogo3.png';
const features = [
  {
    img: cart1,
    title: "100% Original Products",
    subtitle: "We Only sell genuine Products",
  },
  {
    img: cart2,
    title: "Secure Payment",
    subtitle: "We Only sell genuine Products",
  },
  {
    img: cart3,
    title: "24×7 Technical support available",
    subtitle: "We Only sell genuine Products",
  },
];

const brands = [
 { img: img1 },
  { img: img2 },
  { img: img2 },
  { img: img3 },
];

export default function B2BIndustriesSection() {
  return (
    <div>
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold lg:text-[57px] text-[#1E3473] mb-10">
        B2B Industries we serve
      </h2>

      {/* Feature Cards */}
      <div className="flex flex-wrap justify-center gap-8 mb-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex  gap-4 p-5 items-center bg-[#1b2c6b] rounded-2xl text-left w-full sm:w-[400px]"
          >
            <img src= {feature.img} className="  p-2 rounded-lg"
              
            />
            <div>
              <h3 className="text-white font-semibold">{feature.title}</h3>
              <p className="text-[#fdb714] text-sm">{feature.subtitle}</p>
            </div>
          </div>
        ))}
        {/* Repeating for second row (as per image) */}
        {features.slice(0, 2).map((feature, index) => (
          <div
            key={`row2-${index}`}
            className="flex items-start gap-4 p-5 bg-[#1b2c6b] rounded-xl text-left w-full sm:w-[400px]"
          >
           <img src= {feature.img} className="  p-2 rounded-lg"/>
            <div>
              <h3 className="text-white font-semibold">{feature.title}</h3>
              <p className="text-[#fdb714] text-sm">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
  </section>
      {/* Brands */}
     <Marquee pauseOnHover gradient={false} speed={50}>
      <div className="flex gap-8 items-center py-4 w-full ">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="text-gray-700 font-semibold text-lg flex items-center gap-2 mr-8"
          >
            <img src={brand.img} className="" />
            
          </div>
        ))}
      </div>
    </Marquee>
  
     </div>
  );
}
