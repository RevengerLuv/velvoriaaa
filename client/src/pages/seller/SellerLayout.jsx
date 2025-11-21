// SellerLayout.jsx - Fixed
import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const SellerLayout = () => {
  const { isSeller, setIsSeller, axios, navigate } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [adminData, setAdminData] = useState({ name: "Admin", unreadNotifications: 0 });

  const sidebarLinks = [
    { name: "Dashboard", path: "/seller", icon: "📊", badge: 0 },
    { name: "Accounts", path: "/seller/accounts", icon: "👥", badge: 0 },
    { name: "Orders", path: "/seller/orders", icon: "📦", badge: 0 },
    { name: "Products", path: "/seller/products", icon: "🧶", badge: 0 },
    { name: "Add Product", path: "/seller/add-product", icon: "➕", badge: 0 },
    { name: "Customers", path: "/seller/customers", icon: "👤", badge: 0 },
    { name: "Analytics", path: "/seller/analytics", icon: "📈", badge: 0 },
    { name: "Inventory", path: "/seller/inventory", icon: "📋", badge: 2 },
    { name: "Reviews", path: "/seller/reviews", icon: "⭐", badge: 5 },
    { name: "FundUsage", path: "/seller/FundUsage", icon: "💀", badge: 0 },
    { name: "AdsManagement", path: "/seller/AdsManagement", icon: "🎁", badge: 0 },
    { name: "Invoices", path: "/seller/Invoices", icon: "✅", badge: 0 },
    { name: "Settings", path: "/seller/settings", icon: "⚙️", badge: 0 },
    
  ];

// In SellerLayout.jsx - Fix the profile fetch
const fetchAdminData = async () => {
  try {
    const { data } = await axios.get("/api/admin/profile");
    if (data.success) {
      setAdminData(data.admin);
    }
  } catch (error) {
    console.error("Failed to fetch admin data, using default");
    // Use default data if API fails
    setAdminData({ 
      name: "Admin", 
      unreadNotifications: 3,
      email: "admin@velvoriastore.com"
    });
  }
};

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        setIsSeller(false);
        toast.success("👋 Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <>
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white transition-all duration-300 shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-purple-500 transition duration-300"
          >
            ☰
          </button>
          <Link to={"/"} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">🧶</span>
            </div>
            <h1 className="text-2xl font-bold">Velvoria Admin</h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-purple-500 transition duration-300">
              <span className="text-xl">🔔</span>
              {adminData.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {adminData.unreadNotifications}
                </span>
              )}
            </button>
          </div>
          
          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="font-semibold">{adminData.name?.charAt(0) || 'A'}</span>
            </div>
            <div className="hidden md:block">
              <p className="font-medium">Hi! {adminData.name || 'Admin'}</p>
              <p className="text-purple-200 text-sm">Admin</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition duration-300 flex items-center gap-2"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>

      <div className="flex bg-gray-50 min-h-screen">
        {/* Enhanced Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative inset-y-0 left-0 z-30 w-72 bg-white shadow-2xl border-r border-gray-200 transition duration-300 ease-in-out transform`}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">🧵</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Admin Panel</h2>
                <p className="text-sm text-gray-600">Velvoria Store</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/seller"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `flex items-center justify-between py-3 px-4 rounded-xl transition duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                }`}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isActive ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-gray-800">Need Help?</p>
              <p className="text-xs text-gray-600 mt-1">Contact support</p>
              <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition duration-300">
                Get Help
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto transition-all duration-300">
          <Outlet />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SellerLayout;