
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
    <div className="relative w-full h-auto flex flex-col bg-[#1e3473] overflow-hidden px-4 sm:px-6 md:px-8 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:justify-between mt-6 sm:mt-8 lg:mt-10 w-full h-auto">
        {/* Left side - Company Info */}
        <div className="w-full lg:w-[30%] flex flex-col text-white z-10 py-4 sm:py-6 lg:py-8">
          <img src={logobottom} alt="Bharatronix Logo" className="w-[70%] sm:w-[60%] lg:w-[80%] max-w-[200px]" />
          <p className="text-xs sm:text-sm lg:text-base leading-5 sm:leading-6 mt-4 sm:mt-6 text-gray-200">
            India's first one-stop platform for sourcing and manufacturing
            electronic components, complete with an integrated supply chain and
            logistics network.
          </p>

          {/* Social Media Icons */}
          <div className="w-full flex flex-wrap gap-2 sm:gap-3 py-4 sm:py-6">
            <Link
              to="https://www.facebook.com/profile.php?id=61579174892065#"
              className="text-white p-2 sm:p-3 border-2 border-transparent hover:border-white rounded-full transition-all duration-300 ease-in-out"
              aria-label="Facebook"
            >
              <img src={icon1} alt="Facebook" className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              to="https://x.com/bharatroni68370"
              className="text-white p-2 sm:p-3 border-2 border-transparent hover:border-white rounded-full transition-all duration-300 ease-in-out"
              aria-label="Twitter"
            >
              <FaSquareXTwitter className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              to="https://www.instagram.com/bharatronix/?hl=en"
              className="text-white p-2 sm:p-3 border-2 border-transparent hover:border-white rounded-full transition-all duration-300 ease-in-out"
              aria-label="Instagram"
            >
              <FaInstagramSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              to="https://www.youtube.com/@BharatroniX2024"
              className="text-white p-2 sm:p-3 border-2 border-transparent hover:border-white rounded-full transition-all duration-300 ease-in-out"
              aria-label="YouTube"
            >
              <img src={icon5} alt="YouTube" className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              to="https://www.linkedin.com/company/bharatronix/"
              className="text-white p-2 sm:p-3 border-2 border-transparent hover:border-white rounded-full transition-all duration-300 ease-in-out"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </div>
        </div>

        {/* Right side - Links and Contact */}
        <div className="w-full lg:w-[70%] py-4 sm:py-6 lg:py-8 text-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Services Column */}
            <div className="">
              <h3 className="mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg xl:text-xl font-semibold">
                SERVICES
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base">
                <li>
                  <Link to="/b2bpage" className="hover:text-[#F7941D] transition-colors">
                    B2B
                  </Link>
                </li>
                <li>
                  <Link to="/coming-soon" className="hover:text-[#F7941D] transition-colors">
                    Manufacturing
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://www.youtube.com/@BharatroniX2024"
                    className="hover:text-[#F7941D] transition-colors"
                  >
                    Videos
                  </Link>
                </li>
                <li>
                  <Link to="/product" className="hover:text-[#F7941D] transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/shopbybrand" className="hover:text-[#F7941D] transition-colors">
                    Brands
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div className="">
              <h3 className="mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg xl:text-xl font-semibold">
                ABOUT
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base">
                <li>
                  <Link to="/b2bpage#customer-section" className="hover:text-[#F7941D] transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#F7941D] transition-colors">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link to="/coming-soon" className="hover:text-[#F7941D] transition-colors">
                    Financing
                  </Link>
                </li>
                <li>
                  <Link to="/coming-soon" className="hover:text-[#F7941D] transition-colors">
                    Patents
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="hover:text-[#F7941D] transition-colors">
                    Our Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies Column */}
            <div className="">
              <h3 className="mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg xl:text-xl font-semibold">
                POLICIES
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base">
                <li>
                  <Link
                    to="/orders-and-payment-policy"
                    className="hover:text-[#F7941D] transition-colors"
                  >
                    Orders & Payment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cancellation-policy"
                    className="hover:text-[#F7941D] transition-colors"
                  >
                    Cancellation
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="hover:text-[#F7941D] transition-colors">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" className="hover:text-[#F7941D] transition-colors">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link to="/warranty-policy" className="hover:text-[#F7941D] transition-colors">
                    Warranty
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Newsletter Column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <h3 className="mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg xl:text-xl font-semibold">
                CONTACT US
              </h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6">
                <p>Email: support@Bharatronix.com</p>
                <p>Phone: +91 94038 93115</p>
              </div>
              
              <h4 className="mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg font-semibold">
                Newsletter
              </h4>
              <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-gray-200">
                Stay updated with our latest offers, products, and news – straight to your inbox.
              </p>
              
              {/* Newsletter Signup */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 rounded-full px-3 sm:px-4 py-2 sm:py-3 text-gray-800 bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7941D] text-sm"
                />
                <button className="bg-[#e91e63] hover:bg-pink-600 p-2 sm:p-3 rounded-full text-white flex items-center justify-center transition-colors flex-shrink-0">
                  <FaCheck size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
              
              {/* Payment Methods */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <img src={img1} alt="Google Pay" className="w-12 sm:w-14 lg:w-16 h-auto" />
                <img src={img2} alt="Stripe" className="w-12 sm:w-14 lg:w-16 h-auto" />
                <img src={img3} alt="Mastercard" className="w-12 sm:w-14 lg:w-16 h-auto" />
                <img src={img4} alt="Visa" className="w-12 sm:w-14 lg:w-16 h-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Copyright Section */}
      <div className="w-full border-t border-gray-600 mt-6 sm:mt-8 pt-4 sm:pt-6 pb-4 flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4 text-white text-xs sm:text-sm">
        <span className="text-center sm:text-left">© Copyright 2024, All Rights Reserved</span>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 lg:gap-10 text-center">
          <Link to="/terms-and-conditions" className="hover:text-[#F7941D] transition-colors">
            Terms and Conditions
          </Link>
          <Link to="/privacy-policy" className="hover:text-[#F7941D] transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
