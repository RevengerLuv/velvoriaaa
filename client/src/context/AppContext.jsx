import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Set up axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Create the context
export const AppContext = createContext(null);

// Context Provider Component
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [backendConnected, setBackendConnected] = useState(true);
 
// Add these functions to your existing AppContext.jsx

// Google Login Function
const googleLogin = async (credentialResponse) => {
  try {
    const { data } = await axios.post("/api/user/google-auth", {
      token: credentialResponse.credential
    });
    
    if (data.success) {
      setUser(data.user);
      setCartItems(data.user.cart || {});
      toast.success("Google login successful!");
      return true;
    } else {
      toast.error(data.message);
      return false;
    }
  } catch (error) {
    console.error("Google login error:", error);
    toast.error("Google login failed");
    return false;
  }
};

// Add to your context value:

  // Fetch products function
  const fetchProducts = async () => {
    try {
      console.log("🔄 Attempting to fetch products from backend...");
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
        setBackendConnected(true);
        console.log("✅ Products loaded from backend");
      }
    } catch (error) {
      console.log("❌ Backend not available, using demo data");
      setBackendConnected(false);
      
      // Use dummy data as fallback
      const fallbackProducts = [
        {
          _id: "1",
          name: "Demo Product 1",
          description: "This is a demo product",
          price: 9.99,
          offerPrice: 7.99,
          image: "https://via.placeholder.com/150"
        },
        {
          _id: "2", 
          name: "Demo Product 2",
          description: "Another demo product",
          price: 12.99,
          offerPrice: 10.99,
          image: "https://via.placeholder.com/150"
        }
      ];
      setProducts(fallbackProducts);
      toast.success("Using demo mode - Backend not available");
    }
  };

  // Fetch user function
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cart || {});
      }
    } catch (error) {
      console.log("Failed to fetch user:", error);
    }
  };

  // Fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
        console.log("✅ Seller is authenticated");
      }
    } catch (error) {
      setIsSeller(false);
      console.log("❌ Seller not authenticated");
    }
  };

  // Seller login function
  const sellerLogin = async (email, password) => {
    try {
      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });
      
      if (data.success) {
        setIsSeller(true);
        toast.success("Seller login successful!");
        return { success: true };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Seller login error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        return { success: false, message: error.response.data.message };
      } else {
        toast.error("Seller login failed");
        return { success: false, message: "Seller login failed" };
      }
    }
  };

  // Add to cart function
  const addToCart = (itemId) => {
    if (!user) {
      setShowUserLogin(true);
      toast.error("Please login to add items to cart");
      return;
    }

    let cartData = { ...cartItems };
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = { ...cartItems };
    cartData[itemId] = quantity;
    setCartItems(cartData);
  };

  // Remove from cart
  const removeFromCart = (itemId) => {
    let cartData = { ...cartItems };
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
      setCartItems(cartData);
      toast.success("Removed from cart");
    }
  };

  // Cart count
  const cartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // Total cart amount
  const totalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += cartItems[itemId] * itemInfo.offerPrice;
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // Initialize
  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  // Update cart in database when it changes
  useEffect(() => {
    const updateCart = async () => {
      try {
        if (user && backendConnected) {
          await axios.post("/api/cart/update", { cartItems });
        }
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    };

    updateCart();
  }, [cartItems, user, backendConnected]);

  // Context value - MAKE SURE ALL FUNCTIONS ARE DEFINED ABOVE THIS LINE
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
      googleLogin,
    cartCount,
    totalCartAmount,
    axios,
    fetchProducts,
    setCartItems,
    backendConnected,
    sellerLogin, // Now this is defined above
    fetchSeller, // Now this is defined above
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};