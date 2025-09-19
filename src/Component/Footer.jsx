
import logobottom from "../assets/footerlogo.svg";
import { Link } from "react-router-dom";
import icon1 from "./../assets/Facebook.svg";
import icon5 from "./../assets/YouTube.svg";
import img1 from "./../assets/gpay.svg";
import img2 from "./../assets/stripe.svg";
import img3 from "./../assets/master.svg";
import img4 from "./../assets/visa.svg";
import { FaCheck } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="relative w-full h-auto  flex flex-col bg-[#1e3473] overflow-hidden md:px-8 lg:px-8">
      {/* <p className='w-full border-b border-dashed  border-white mt-10'></p> */}
      <div className="flex flex-col md:flex-row md:justify-between mt-10  w-full h-auto">
        {/* Left side - 40% */}
        <div className="w-full lg:w-[30%] px-4 md:px-8 flex flex-col text-white z-10 py-2 md:py-8">
          <img src={logobottom} alt="logobottom" className="w-[80%]" />
          <p className="text-xs mt-6 sm:text-sm md:text-base leading-5 md:leading-6">
            India's first one-stop platform for sourcing and manufacturing
            electronic components, complete with an integrated supply chain and
            logistics network.
          </p>

          <div className="w-full flex flex-wrap gap-3  py-4">
            <Link
              to="https://www.facebook.com/profile.php?id=61579174892065#"
              className="text-white p-3 border-2 border-transparent hover:border-white rounded-full transition-all duration-300 ease-in-out"
            >
              <img src={icon1} alt="Facebook" className="w-6 h-6" />
            </Link>
            <Link
              to="https://x.com/bharatroni68370"
              className="text-white p-3 border-2 border-transparent hover:border-white rounded-full transition-all duration-300 ease-in-out"
            >
              <FaSquareXTwitter alt="Twitter" className="w-6 h-6" />
            </Link>
            <Link
              to="https://www.instagram.com/bharatronix/?hl=en"
              className="text-white p-3 border-2 border-transparent hover:border-white rounded-full transition-all duration-300 ease-in-out"
            >
              <FaInstagramSquare alt="Instagram" className="w-6 h-6" />
            </Link>
            <Link
              to="https://www.youtube.com/@BharatroniX2024"
              className="text-white p-3 border-2 border-transparent hover:border-white rounded-full transition-all duration-300 ease-in-out"
            >
              <img src={icon5} alt="YouTube" className="w-6 h-6" />
            </Link>
            <Link
              to="https://www.linkedin.com/company/bharatronix/"
              className="text-white p-3 border-2 border-transparent hover:border-white rounded-full transition-all duration-300 ease-in-out"
            >
              <FaLinkedinIn alt="Linkedin" className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Right side - 60% with background image */}
        <div className="w-full lg:w-[70%] px-10 md:px-4 py-6 md:py-8 text-white">
          <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2  gap-2 ">
            {/* Column 1 */}
            <div className="mb-4 md:mb-0 col-span-1">
              <h3 className="mb-2 text-xs md:text-[24px] font-semibold">
                SERVICES{" "}
              </h3>
              <ul className="space-y-2 md:space-y-4 text-xs md:text-[12px] lg:text-[18px]">
                <li>
                  <Link to="/b2bpage" className="hover:text-[#F7941D]">
                    B2B
                  </Link>
                </li>
                <li>
                  <Link to="/coming-soon" className="hover:text-[#F7941D]">
                    Manufacturing
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://www.youtube.com/@BharatroniX2024"
                    className="hover:text-[#F7941D]"
                  >
                    Videos
                  </Link>
                </li>
                <li>
                  <Link to="/product" className="hover:text-[#F7941D]">
                    Products
                  </Link>
                </li>

                <li>
                  <Link to="/shopbybrand" className="hover:text-[#F7941D]">
                    Products Brands
                  </Link>
                </li>

                {/* <li>Trade program</li> */}
              </ul>
            </div>

            {/* Column 2 */}
            <div className="mb-4 md:mb-0 col-span-1">
              <h3 className="mb-2 text-xs md:text-[24px] font-semibold">
                ABOUT
              </h3>
              <ul className="space-y-2 md:space-y-4 text-xs md:text-[12px] lg:text-[18px]">
                <li>
                  <Link to="/b2bpage#customer-section">Reviews</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#F7941D]">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link to="/coming-soon" className="hover:text-[#F7941D]">
                    Financing
                  </Link>
                </li>
                <li>
                  <Link to="/coming-soon" className="hover:text-[#F7941D]">
                    Patents
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="hover:text-[#F7941D]">
                    Our Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="mb-4 md:mb-0 col-span-1">
              <h3 className="mb-2 text-xs md:text-[24px] font-semibold">
                POLICIES
              </h3>
              <ul className="space-y-2 md:space-y-4 text-xs md:text-[12px] lg:text-[18px]">
                <li>
                  <Link
                    to="/orders-and-payment-policy"
                    className="hover:text-[#F7941D]"
                  >
                    Orders & Payment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cancellation-policy"
                    className="hover:text-[#F7941D]"
                  >
                    Cancellation
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="hover:text-[#F7941D]">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" className="hover:text-[#F7941D]">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link to="/warranty-policy" className="hover:text-[#F7941D]">
                    Warranty
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="col-span-2 md:col-span-2 sm:col-span-1 ">
              <h3 className="mb-2 text-xs md:text-[24px] font-semibold">
                CONTACT US
              </h3>
              <ul className="space-y-2 md:space-y-2 text-xs md:text-[12px] lg:text-[18px]">
                <li>Email: support@Bharatronix.com</li>
                <li>Phone: +91 94038 93115</li>
                {/* <li>Hours:</li>
                <li>Mon-Fri — 10am to 8pm</li>
                <li>Sat-Sun — 10am to 2pm</li> */}
                <h3 className="mb-2 text-xs md:text-[20px] font-semibold">
                  Newsletter:-
                </h3>
                <li>
                  Stay updated with our latest , offers, products, and news
                  –straight to your inbox.
                </li>
                <div className="flex items-center space-x-2 py-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="rounded-full px-5 py-2 text-white bg-transparent border border-gray-400 placeholder-gray-400 focus:outline-none"
                  />
                  <button className="bg-[#e91e63] hover:bg-pink-600 p-3 rounded-full text-white flex items-center justify-center">
                    <FaCheck size={16} />
                  </button>
                </div>
              </ul>
              <div className="flex gap-2 mt-4">
                <img src={img1} alt="" className="w-16" />
                <img src={img2} alt="" className="w-16" />
                <img src={img3} alt="" className="w-16" />
                <img src={img4} alt="" className="w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <p className='w-full border-b border-dashed  border-white'></p> */}
      <div className="w-full mb-4  flex flex-col md:flex-row  items-center md:justify-between gap-1 md:gap-4 text-white px-10 text-xs sm:text-sm md:text-base ">
        <span>© Copyright 2024, All Rights Reserved</span>
        <span className="flex gap-10">
          <Link to="/terms-and-conditions" className="hover:text-[#F7941D]">
            Terms and Conditions
          </Link>
          <Link to="/privacy-policy" className="hover:text-[#F7941D]">
            Privacy Policy
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Footer;
