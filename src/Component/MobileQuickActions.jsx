import { Link } from "react-router-dom";
import { FaShoppingBag, FaTags, FaBuilding, FaTruck, FaPhone, FaWhatsapp } from "react-icons/fa";

const MobileQuickActions = () => {
  const quickActions = [
    {
      icon: <FaShoppingBag className="text-[#F7941D]" size={20} />,
      title: "All Products",
      subtitle: "Browse catalog",
      link: "/product",
      bgColor: "bg-orange-50",
    },
    {
      icon: <FaTags className="text-blue-600" size={20} />,
      title: "Shop by Brand",
      subtitle: "Top brands",
      link: "/shopbybrand",
      bgColor: "bg-blue-50",
    },
    {
      icon: <FaBuilding className="text-green-600" size={20} />,
      title: "B2B Enquiry",
      subtitle: "Bulk orders",
      link: "/b2bpage",
      bgColor: "bg-green-50",
    },
    {
      icon: <FaTruck className="text-purple-600" size={20} />,
      title: "Track Order",
      subtitle: "Order status",
      link: "/track-order",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="md:hidden bg-white border-b border-gray-100">
      {/* Quick Actions Grid */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#F7941D] transition-all duration-200 hover:shadow-sm"
            >
              <div className={`p-2 rounded-lg ${action.bgColor}`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {action.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Contact Actions */}
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          <a
            href="tel:+919403893115"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <FaPhone size={16} />
            <span className="text-sm font-medium">Call Us</span>
          </a>
          <a
            href="https://wa.link/594khg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
          >
            <FaWhatsapp size={16} />
            <span className="text-sm font-medium">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileQuickActions;