import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userPincode, setUserPincode] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    axios,
  } = useAppContext();

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user's live location with pincode
  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get address with pincode
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          const data = await response.json();
          
          let locationText = "";
          let pincode = "";

          if (data.city && data.countryName) {
            locationText = `${data.city}, ${data.countryName}`;
            
            // Try to get pincode from locality info or postcode
            if (data.postcode) {
              pincode = data.postcode;
              locationText = `${data.city} - ${data.postcode}, ${data.countryName}`;
            } else if (data.localityInfo && data.localityInfo.administrative) {
              // Try alternative method to get pincode
              const adminInfo = data.localityInfo.administrative.find(
                admin => admin.postcode
              );
              if (adminInfo && adminInfo.postcode) {
                pincode = adminInfo.postcode;
                locationText = `${data.city} - ${adminInfo.postcode}, ${data.countryName}`;
              } else {
                locationText = `${data.city}, ${data.countryName}`;
              }
            } else {
              locationText = `${data.city}, ${data.countryName}`;
            }
            
            setUserLocation(locationText);
            setUserPincode(pincode);
            toast.success(`📍 Location detected: ${data.city}${pincode ? ` (${pincode})` : ''}`);
            
            // Save location to user preferences if logged in
            if (user) {
              try {
                await axios.post('/api/user/location', {
                  latitude,
                  longitude,
                  address: locationText,
                  pincode: pincode
                });
              } catch (error) {
                console.error('Error saving location:', error);
              }
            }
          } else {
            setUserLocation("Location detected");
            toast.success("📍 Location detected successfully!");
          }
        } catch (error) {
          console.error('Error getting address:', error);
          
          // Fallback: Use coordinates and try Indian pincode API
          try {
            const { latitude, longitude } = position.coords;
            setUserLocation("Location detected");
            toast.success("📍 Location detected! (Precise address loading...)");
            
            // Try Indian-specific pincode API
            const indiaResponse = await fetch(
              `https://api.postalpincode.in/pincode/${Math.round(latitude)}/${Math.round(longitude)}`
            ).catch(() => null);
            
            if (indiaResponse && indiaResponse.ok) {
              const indiaData = await indiaResponse.json();
              if (indiaData[0] && indiaData[0].PostOffice && indiaData[0].PostOffice[0]) {
                const pincode = indiaData[0].PostOffice[0].Pincode;
                setUserPincode(pincode);
                setUserLocation(`India - ${pincode}`);
                toast.success(`📍 Location detected: Pincode ${pincode}`);
              }
            }
          } catch (fallbackError) {
            console.error('Fallback location error:', fallbackError);
            setUserLocation("Location detected");
          }
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("📍 Location access denied. Please enable location permissions in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("📍 Location information unavailable. Please check your GPS connection.");
            break;
          case error.TIMEOUT:
            toast.error("📍 Location request timed out. Please try again.");
            break;
          default:
            toast.error("📍 An unknown error occurred while getting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 600000 // 10 minutes cache
      }
    );
  };

  // Load saved location on component mount
  useEffect(() => {
    if (user && user.savedLocation) {
      setUserLocation(user.savedLocation);
      setUserPincode(user.savedPincode);
    }
  }, [user]);

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        navigate("/");
        toast.success("👋 Successfully logged out");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Shop", path: "/products", icon: "🛍️" },
    { name: "Custom Orders", path: "/custom-orders", icon: "🎨" },
  ];

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200" 
          : "bg-white/80 backdrop-blur-lg border-b border-white/20"
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo with Velvoria Branding */}
            {/* /* Logo with Velvoria Branding - No Background, Bigger Logo * */}
<div className="flex items-center space-x-4">
  <Link to="/" className="flex items-center space-x-3 group">
    {/* Velvoria Logo - No Background, Bigger Size */}
    <div className="relative">
      <img 
        src={assets.logo} 
        alt="Velvoria" 
        className="w-12 h-12 lg:w-16 lg:h-16 object-contain transition-transform duration-200 group-hover:scale-105"
      />
      
      {/* Live location indicator */}
      {userLocation && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      )}
    </div>
    <div className="flex flex-col">
      <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Velvoria
      </span>
      <span className="text-xs text-gray-500 hidden sm:block">
        Luxury Handmade Creations
      </span>
    </div>
  </Link>
              {/* Location Display with Pincode */}
              <div className="hidden lg:block">
                <button
                  onClick={getLiveLocation}
                  disabled={locationLoading}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 transition-all duration-200 group min-w-52"
                >
                  {locationLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-left">
                        <p className="text-xs text-gray-500">Detecting your</p>
                        <p className="text-sm font-medium text-purple-600">Location & Pincode...</p>
                      </div>
                    </>
                  ) : userLocation ? (
                    <>
                      <span className="text-green-600 text-lg">📍</span>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-xs text-gray-500">
                          {userPincode ? `Pincode: ${userPincode}` : 'Your location'}
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-40">
                          {userLocation}
                        </p>
                      </div>
                      <span className="text-gray-400 group-hover:text-purple-600 transition-colors text-xs" title="Update location">
                        🔄
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-400 text-lg">📍</span>
                      <div className="text-left">
                        <p className="text-xs text-gray-500">Tap to detect</p>
                        <p className="text-sm font-medium text-gray-900">Location & Pincode</p>
                      </div>
                      <span className="text-gray-400 group-hover:text-purple-600 transition-colors">📍</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
              {/* Navigation Links */}
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                      ${location.pathname === item.path
                        ? "text-purple-600 bg-purple-50 shadow-sm"
                        : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Velvoria creations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder-gray-400"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors">
                  <span className="text-xl">🛒</span>
                </div>
                {cartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount()}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <img
                      src={user.profilePicture || assets.profile_icon}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl border-2 border-gray-200"
                    />
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                      <p className="text-gray-500 text-xs">My Account</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profilePicture || assets.profile_icon}
                          alt={user.name}
                          className="w-12 h-12 rounded-xl"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                          {userPincode && (
                            <p className="text-xs text-purple-600 mt-1">
                              📍 Pincode: {userPincode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => navigate("/my-orders")}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">📦</span>
                        <span>My Orders</span>
                      </button>
                      <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">👤</span>
                        <span>Profile Settings</span>
                      </button>
                      <button
                        onClick={getLiveLocation}
                        disabled={locationLoading}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <span className="text-lg">📍</span>
                        <span>
                          {locationLoading ? "Detecting Location..." : "Update Location"}
                        </span>
                      </button>
                    </div>
                    
                    <div className="p-2 border-t border-gray-200">
                      <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="text-lg">🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowUserLogin(true)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`w-6 h-6 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
                <div className={`w-6 h-0.5 bg-gray-600 mb-1.5 transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-600 mb-1.5 transition-all duration-200 ${open ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`
          lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl
          transition-all duration-300 transform origin-top
          ${open ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}
        `}>
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            {/* Mobile Location with Pincode */}
            <div className="p-3 border-b border-gray-200">
              <button
                onClick={getLiveLocation}
                disabled={locationLoading}
                className="flex items-center space-x-3 w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
              >
                {locationLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Detecting your</p>
                      <p className="text-sm font-medium text-purple-600">Location & Pincode...</p>
                    </div>
                  </>
                ) : userLocation ? (
                  <>
                    <span className="text-green-600 text-xl">📍</span>
                    <div className="text-left flex-1">
                      <p className="text-xs text-gray-500">
                        {userPincode ? `Pincode: ${userPincode}` : 'Your location'}
                      </p>
                      <p className="text-sm font-medium text-gray-900">{userLocation}</p>
                    </div>
                    <span className="text-gray-400 text-xs">🔄</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400 text-xl">📍</span>
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Tap to detect</p>
                      <p className="text-sm font-medium text-gray-900">Location & Pincode</p>
                    </div>
                    <span className="text-gray-400">📍</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center space-x-3 p-3 rounded-xl font-medium transition-colors
                  ${location.pathname === item.path
                    ? "text-purple-600 bg-purple-50"
                    : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Mobile Search */}
            <div className="p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Velvoria creations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="p-3 border-t border-gray-200 space-y-3">
              <button
                onClick={() => {
                  navigate("/cart");
                  setOpen(false);
                }}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🛒</span>
                  <span className="font-medium">Shopping Cart</span>
                </div>
                {cartCount() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartCount()}
                  </span>
                )}
              </button>

              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/my-orders");
                      setOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">📦</span>
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">👤</span>
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="text-xl">🚪</span>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowUserLogin(true);
                    setOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;