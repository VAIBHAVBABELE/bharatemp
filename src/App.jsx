import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./Component/Navbar";
import Ouronline from "./Component/B2bComponent/Ouronline.jsx";
import Footer from "./Component/Footer";
import Product from "./Component/HomeComponent/Product";
import SingleProduct from "./Component/HomeComponent/SingleProduct";
import Cart from "./Component/Cart/Cart";
import Checkout from "./Component/Cart/Checkout";
import Thanku from "./Component/HomeComponent/Thankyou.jsx";
import Profile from "./Component/HomeComponent/Profile";
import TrackOrder from "./pages/TrackOrder";
import { CartProvider } from "./context/CartContext.jsx";
import Login from "./Component/Login";
import Signup from "./Component/Signup";
import ForgotPassword from "./Component/ForgotPassword";
import VerifyOTP from "./Component/VerifyOTP";
import ResetPassword from "./Component/ResetPassword";
import AdminLogin from "./Component/AdminDashboardComponent/AdminLogin.jsx";
import AdminDashboard from "./Component/AdminDashboardComponent/AdminDashboard.jsx";
import Admin from "./Admin.jsx";
import AddProduct from "./Component/AdminDashboardComponent/ProductsRelatedComponents/AddProductComplete.jsx";
import AllProducts from "./Component/AdminDashboardComponent/ProductsRelatedComponents/AllProducts.jsx";
import AllOrders from "./Component/AdminDashboardComponent/OrdersRelatedComponents/AllOrders.jsx";
import DiscountCoupon from "./Component/AdminDashboardComponent/DiscountCoupan/DiscountCoupon.jsx";
import WholesaleProducts from "./Component/AdminDashboardComponent/WholesaleProducts/WholesaleProducts.jsx";
import WholesaleBulkProductsOrders from "./Component/AdminDashboardComponent/WholesaleBulkOrders/WholesaleBulkOrders.jsx";
import AreaOfServices from "./Component/AdminDashboardComponent/AreaOfServices/AreaOfServices.jsx";
import InventoryManagement from "./Component/AdminDashboardComponent/InventoryManagement/Inventory.jsx";
import Invoice from "./Component/AdminDashboardComponent/InvoiceComponents/Invoice.jsx";
import AllComplaintRaised from "./Component/AdminDashboardComponent/ComplaintRaisedComponents/AllComplaintRaised.jsx";
import Complaints from "./Component/AdminDashboardComponent/Complaints.jsx";
import ReturnRequest from "./Component/AdminDashboardComponent/ReturnRequestComponents/ReturnRequest.jsx";
import NewsUpdates from "./Component/AdminDashboardComponent/NewsAndUpdatesComponents/NewsUpdates.jsx";
import ContactUs from "./Component/AdminDashboardComponent/ContactUsComponent/contactus.jsx";
import BlogManagement from "./Component/AdminDashboardComponent/BlogManagement/BlogManagement.jsx";
import BulkOrderEnquiry from "./Component/AdminDashboardComponent/BulkOrderEnquiry.jsx";
// import ImageManagement from "./Component/AdminDashboardComponent/ImageUpload/ImageManagement.jsx"; // Removed - functionality integrated
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import OrdersAndPaymentPolicy from "./pages/OrdersAndPaymentPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import WarrantyPolicy from "./pages/WarrantyPolicy";
import Subcategory from "./pages/Subcategory.jsx";
import SubCategories from "./pages/SubCategories";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import ComingSoon from "./pages/ComingSoon";
import { FaWhatsapp } from "react-icons/fa";
import OrderSuccess2 from "./Component/HomeComponent/CashThankyou.jsx";
import ShopByBrand from "./pages/ShopByBrand.jsx";
import PaymentCancelled from "./pages/PaymentCancelled.jsx";
import PhonePePaymentStatus from "./pages/PhonePePaymentStatus.jsx";
import PhonePayCancel from "./pages/PhonePayCancel.jsx";
import PaymentRetry from "./pages/PaymentRetry.jsx";
import PaymentFallback from "./pages/PaymentFallback.jsx";
import AuthSuccess from "./pages/AuthSuccess.jsx";
import AuthError from "./pages/AuthError.jsx";

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="overflow-hidden">
      {!isAdmin && <Navbar />}
      <Routes>
        {/* Route Definitions */}
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/allproducts" element={<Product />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-status/:id" element={<Thanku />} />
        <Route path="/cash-payment-status/:id" element={<OrderSuccess2 />} />
        <Route path="/phonepe-payment-status/:paymentId" element={<PhonePePaymentStatus />} />
        <Route path="/phonepe-payment-cancel/:paymentId?" element={<PhonePayCancel />} />
        <Route path="/payment-cancelled/:orderId?" element={<PaymentCancelled />} />
        <Route path="/payment-retry/:orderId" element={<PaymentRetry />} />
        <Route path="/payment-fallback" element={<PaymentFallback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/b2bpage" element={<Ouronline />} />
        <Route path="/subcategory" element={<Subcategory />} />
        <Route path="/subcategories" element={<SubCategories />} />
        <Route path="/shopbybrand" element={<ShopByBrand />} />
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/auth/error" element={<AuthError />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/coming-soon" element={<ComingSoon />} />

        {/* dashboard */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<Admin />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/addproduct" element={<AddProduct />} />
          <Route path="/admin-dashboard/allproduct" element={<AllProducts />} />
          <Route path="/admin-dashboard/orders" element={<AllOrders />} />
          <Route path="/admin-dashboard/coupon" element={<DiscountCoupon />} />
          <Route
            path="/admin-dashboard/wholesale"
            element={<WholesaleProducts />}
          />
          <Route
            path="/admin-dashboard/wholesale-bulk-orders"
            element={<WholesaleBulkProductsOrders />}
          />
          <Route
            path="/admin-dashboard/area-of-services"
            element={<AreaOfServices />}
          />
          <Route path="/admin-dashboard/invoices" element={<Invoice />} />
          <Route
            path="/admin-dashboard/return-requests"
            element={<ReturnRequest />}
          />
          <Route
            path="/admin-dashboard/news-updates"
            element={<NewsUpdates />}
          />
          <Route
            path="/admin-dashboard/blog-management"
            element={<BlogManagement />}
          />
          <Route
            path="/admin-dashboard/bulk-order-enquiry"
            element={<BulkOrderEnquiry />}
          />

          <Route
            path="/admin-dashboard/inventory"
            element={<InventoryManagement />}
          />
          <Route
            path="/admin-dashboard/complaints"
            element={<Complaints />}
          />
          <Route path="/admin-dashboard/contactus" element={<ContactUs />} />
        </Route>

        {/* Policy Routes */}
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/orders-and-payment-policy"
          element={<OrdersAndPaymentPolicy />}
        />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/warranty-policy" element={<WarrantyPolicy />} />
      </Routes>
      {!isAdmin && <Footer />}
      {/* Floating WhatsApp Icon - Responsive */}
      {!isAdmin && (
        <a
          href="https://wa.link/594khg"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-3 sm:p-4 flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Chat with us on WhatsApp"
        >
          <FaWhatsapp className="text-2xl sm:text-3xl" />
        </a>
      )}
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
};

export default App;
