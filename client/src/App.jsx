import { Routes, Route, useLocation } from "react-router-dom";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Auth from "./modals/Auth";
import ProductCategory from "./pages/ProductCategory";
import Address from "./pages/Address";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import Dashboard from "./pages/seller/Dashboard";
import Accounts from "./pages/seller/Accounts";
import Analytics from "./pages/seller/Analytics";
import Inventory from "./pages/seller/Inventory";
import Customers from "./pages/seller/Customers";
import Settings from "./pages/seller/Settings";
import Reviews from "./pages/seller/Reviews";
import Invoices from "./pages/seller/Invoices";
import FundUsage from "./pages/seller/FundUsage";
import AdsManagement from "./pages/seller/AdsManagement";
import { GoogleOAuthProvider } from '@react-oauth/google';
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import CustomOrders from "./pages/CustomOrders";

const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext(); // This might be undefined
  
  return (
    <GoogleOAuthProvider clientId="233054564282-9bkk084dbqombdtinrbpdn9utmd1636k.apps.googleusercontent.com">
      <div className="min-h-screen bg-gray-50 font-inter">
        {isSellerPath ? null : <Navbar />}
        {showUserLogin ? <Auth /> : null}
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid #374151',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <main className={isSellerPath ? "bg-gray-50" : ""}>
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:category" element={<ProductCategory />} />
            <Route path="/product/:category/:id" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-address" element={<Address />} />
            <Route path="/my-orders" element={<MyOrders />} />
            {/* Custom Orders route should be outside seller routes */}
            <Route path="/custom-orders" element={<CustomOrders />} />
            
            {/* Seller routes */}
            <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
              <Route index element={<Dashboard />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="orders" element={<Orders />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="customers" element={<Customers />} />
              <Route path="products" element={<ProductList />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="settings" element={<Settings />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="FundUsage" element={<FundUsage />} />
              <Route path="AdsManagement" element={<AdsManagement />} />
            </Route>
          </Routes>
        </main>
        
        {isSellerPath ? null : <Footer />}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;