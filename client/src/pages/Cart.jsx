import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { dummyAddress } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

// Enhanced Payment Component with COD Advance
const PaymentModal = ({ amount, onSuccess, onClose, isCODAdvance = false, totalAmount = 0 }) => {
  const { axios: axiosInstance, user } = useAppContext();
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

// In your Cart.jsx, look for the handlePayment function and update it:

const handlePayment = async () => {
  try {
    setLoading(true);

    // Debug: Check amounts before payment
    console.log("💰 Payment Debug in Modal:", {
      amount,
      isCODAdvance,
      totalAmount
    });

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    // Create order with amount in rupees
    const { data } = await axiosInstance.post("/api/payment/create-order", {
      amount: amount, // This should be in rupees
      currency: "INR",
    });

    if (!data.success) {
      console.error("Order creation failed:", data);
      toast.error(data.message || "Failed to create payment order");
      return;
    }

    console.log("✅ Order created:", data);

    const options = {
      key: "rzp_test_ROG7kfTcj6YdM3", // FIXED: Use key directly instead of process.env
      amount: data.amountInPaise, // Use the paise amount from server
      currency: data.currency || "INR",
      name: "Velvoria - Fiber ART",
      description: isCODAdvance 
        ? `17% Advance for COD Order - ₹${amount} of ₹${totalAmount}`
        : `Full Payment - ₹${amount}`,
      order_id: data.orderId,
      handler: async function (response) {
        try {
          console.log("Payment response received:", response);
          
          const verifyResponse = await axiosInstance.post("/api/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          console.log("Verification response:", verifyResponse.data);

          if (verifyResponse.data.success) {
            toast.success(isCODAdvance ? "17% Advance payment successful!" : "Payment successful!");
            if (onSuccess) {
              onSuccess(response.razorpay_payment_id, isCODAdvance);
            }
          } else {
            toast.error("Payment verification failed: " + (verifyResponse.data.message || "Unknown error"));
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: user?.name || "Customer",
        email: user?.email || "customer@example.com",
        contact: user?.phone || "9999999999",
      },
      theme: {
        color: "#a855f7",
      },
      modal: {
        ondismiss: function() {
          onClose();
          toast.error("Payment cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Payment error:", error);
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Payment failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">
          {isCODAdvance ? "Pay 17% Advance" : "Complete Payment"}
        </h2>
        <div className="space-y-4">
          {isCODAdvance && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800 font-medium">COD with 17% Advance</p>
              <p className="text-xs text-blue-700 mt-1">
                Pay ₹{amount} now, remaining ₹{totalAmount - amount} on delivery
              </p>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount to Pay:</span>
            <span className="text-xl font-bold">₹{amount}</span>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              You will be redirected to Razorpay secure payment gateway.
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition duration-300"
            >
              {loading ? "Processing..." : `Pay ₹${amount}`}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Location Selection Modal Component
const LocationModal = ({ isOpen, onClose, onLocationSelect, currentLocation }) => {
  const [locationLoading, setLocationLoading] = useState(false);
  const [manualAddress, setManualAddress] = useState({
    fullName: "",
    phoneNumber: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "home"
  });

  // Get user's live location
  const getLiveLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get address
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          const data = await response.json();
          
          if (data.city && data.countryName) {
            const locationData = {
              type: 'auto',
              latitude,
              longitude,
              city: data.city,
              state: data.principalSubdivision,
              country: data.countryName,
              pincode: data.postcode || '',
              fullAddress: `${data.city}, ${data.principalSubdivision}, ${data.countryName}${data.postcode ? ` - ${data.postcode}` : ''}`,
              displayText: `${data.city}, ${data.principalSubdivision}${data.postcode ? ` - ${data.postcode}` : ''}`
            };
            
            onLocationSelect(locationData);
            toast.success('📍 Location detected automatically!');
            
            // Pre-fill manual form
            setManualAddress(prev => ({
              ...prev,
              city: data.city,
              state: data.principalSubdivision,
              pincode: data.postcode || ''
            }));
          }
        } catch (error) {
          console.error('Error getting address:', error);
          toast.error('Failed to get precise location. Please enter manually.');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        toast.error('Auto-location failed. Please select location manually.');
      }
    );
  };

  // Open Google Maps for location selection
  const openGoogleMaps = () => {
    const mapsUrl = currentLocation 
      ? `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`
      : 'https://www.google.com/maps';
    window.open(mapsUrl, '_blank');
  };

  // Handle manual address input
  const handleManualAddressChange = (e) => {
    setManualAddress({
      ...manualAddress,
      [e.target.name]: e.target.value
    });
  };

  // Save manual address
  const saveManualAddress = () => {
    if (!manualAddress.fullName || !manualAddress.phoneNumber || !manualAddress.houseNo || 
        !manualAddress.street || !manualAddress.city || !manualAddress.state || !manualAddress.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    const addressData = {
      type: 'manual',
      fullName: manualAddress.fullName,
      phoneNumber: manualAddress.phoneNumber,
      houseNo: manualAddress.houseNo,
      street: manualAddress.street,
      landmark: manualAddress.landmark,
      city: manualAddress.city,
      state: manualAddress.state,
      pincode: manualAddress.pincode,
      addressType: manualAddress.addressType,
      fullAddress: `${manualAddress.houseNo}, ${manualAddress.street}, ${manualAddress.city}, ${manualAddress.state} - ${manualAddress.pincode}`,
      displayText: `${manualAddress.city}, ${manualAddress.state} - ${manualAddress.pincode}`
    };

    onLocationSelect(addressData);
    toast.success('Address saved successfully!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">Select Delivery Location</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Auto Location Detection */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-blue-600 mr-2">📍</span>
              Automatic Location Detection
            </h4>
            <p className="text-gray-600 mb-4 text-sm">
              Let us automatically detect your current location for faster delivery
            </p>
            <button
              onClick={getLiveLocation}
              disabled={locationLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
            >
              {locationLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Detecting Location...</span>
                </>
              ) : (
                <>
                  <span>📍</span>
                  <span>Detect My Location Automatically</span>
                </>
              )}
            </button>
          </div>

          {/* Google Maps Integration */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-green-600 mr-2">🗺️</span>
              Select from Google Maps
            </h4>
            <p className="text-gray-600 mb-4 text-sm">
              Open Google Maps to select your precise delivery location
            </p>
            <button
              onClick={openGoogleMaps}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>🗺️</span>
              <span>Open Google Maps</span>
            </button>
          </div>

          {/* Manual Address Input */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-purple-600 mr-2">✍️</span>
              Enter Address Manually
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={manualAddress.fullName}
                  onChange={handleManualAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={manualAddress.phoneNumber}
                  onChange={handleManualAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">House/Building No *</label>
                <input
                  type="text"
                  name="houseNo"
                  value={manualAddress.houseNo}
                  onChange={handleManualAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="House/Building number"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street *</label>
                <input
                  type="text"
                  name="street"
                  value={manualAddress.street}
                  onChange={handleManualAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Street address"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={manualAddress.landmark}
                  onChange={handleManualAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nearby famous place, building, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={manualAddress.city}
                  onChange={handleManualAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="City"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={manualAddress.state}
                  onChange={handleManualAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="State"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={manualAddress.pincode}
                  onChange={handleManualAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Pincode"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type *</label>
                <select
                  name="addressType"
                  value={manualAddress.addressType}
                  onChange={handleManualAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveManualAddress}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("cod_advance");
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      if (cartItems[key] <= 0) continue;
      
      const product = products.find((product) => product._id === key);
      if (product) {
        if (!product._id || !product.offerPrice) {
          console.warn('Invalid product data:', product);
          continue;
        }
        
        const productCopy = { ...product };
        productCopy.quantity = cartItems[key];
        tempArray.push(productCopy);
      }
    }
    setCartArray(tempArray);
  };

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Auto-detect location when cart loads
  useEffect(() => {
    if (user && Object.keys(cartItems).length > 0) {
      getAddress();
      // Auto-detect location
      detectCurrentLocation();
    }
  }, [user, cartItems]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  // Detect current location
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          if (data.city && data.countryName) {
            setCurrentLocation({
              latitude,
              longitude,
              city: data.city,
              state: data.principalSubdivision,
              pincode: data.postcode || '',
              displayText: `${data.city}, ${data.principalSubdivision}${data.postcode ? ` - ${data.postcode}` : ''}`
            });
          }
        } catch (error) {
          console.error('Error detecting location:', error);
        }
      },
      (error) => {
        console.log('Location detection not available');
      }
    );
  };

  // Handle location selection from modal
  const handleLocationSelect = (locationData) => {
    setSelectedAddress(locationData);
    setShowLocationModal(false);
  };

  // Calculate 17% advance for COD
  const calculateCODAmount = () => {
    const total = totalCartAmount();
    return Math.floor(total * 0.17);
  };

  const totalAmount = totalCartAmount() + (totalCartAmount() * 2) / 100;

  const placeOrderCODAdvance = async (paymentId) => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      
      setProcessing(true);
      
      const advanceAmount = calculateCODAmount();
      const remainingAmount = totalCartAmount() - advanceAmount;

      const orderData = {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.offerPrice,
        })),
        address: selectedAddress._id || selectedAddress, // Handle both saved and new addresses
        paymentId: paymentId,
        advancePaid: advanceAmount,
        remainingAmount: remainingAmount,
        totalAmount: totalCartAmount(),
      };

      console.log("🔄 Sending COD advance order data:", orderData);

      const { data } = await axios.post(
        "/api/orders/cod-advance",
        orderData,
        {
          withCredentials: true,
        }
      );
      
      if (data.success) {
        toast.success(`🎉 Order placed! ₹${advanceAmount} paid now, ₹${remainingAmount} on delivery`);
        setCartItems({});
        navigate("/my-orders");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ COD Advance Order Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        toast.error(`Order Failed: ${error.response.data.message}`);
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  const placeOrderFullPayment = async (paymentId) => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      
      setProcessing(true);
      const { data } = await axios.post("/api/order/razorpay", {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.offerPrice,
        })),
        address: selectedAddress._id || selectedAddress,
        paymentId: paymentId,
        totalAmount: totalCartAmount(),
      });
      
      if (data.success) {
        toast.success("🎉 Your velvoria order has been placed!");
        setCartItems({});
        navigate("/my-orders");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to place order");
      return;
    }

    if (cartArray.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    const invalidItems = cartArray.filter(item => !item._id || !item.offerPrice);
    if (invalidItems.length > 0) {
      toast.error("Some items in your cart are invalid");
      return;
    }

    console.log("Checkout validation passed:", {
      itemCount: cartArray.length,
      address: selectedAddress,
      paymentMethod: paymentOption
    });

    if (paymentOption === "cod_advance") {
      setShowPayment(true);
    } else if (paymentOption === "online") {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = async (paymentId, isCODAdvance = false) => {
    try {
      if (isCODAdvance) {
        await placeOrderCODAdvance(paymentId);
      } else {
        await placeOrderFullPayment(paymentId);
      }
    } catch (error) {
      console.error("Order creation after payment error:", error);
      toast.error("Failed to create order after payment");
    } finally {
      setProcessing(false);
      setShowPayment(false);
    }
  };

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6 text-gray-800">
          Velvoria Cart {" "}
          <span className="text-sm text-purple-500">{cartCount()} Handmade Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b border-gray-200">
          <p className="text-left">Velvoria Item Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3 border-b border-gray-100"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`/product/${product.category}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={`http://localhost:5000/images/${product.image[0]}`}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold text-gray-800">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p className="text-sm">
                    Materials: <span className="text-purple-600">{product.materials?.join(', ') || 'Cotton Yarn'}</span>
                  </p>
                  <div className="flex items-center mt-1">
                    <p className="text-sm">Qty:</p>
                    <select
                      onChange={(e) =>
                        updateCartItem(product._id, Number(e.target.value))
                      }
                      value={cartItems[product._id]}
                      className="outline-none border border-gray-300 rounded px-2 py-1 ml-2"
                    >
                      {Array(
                        cartItems[product._id] > 9 ? cartItems[product._id] : 9
                      )
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center font-semibold text-gray-800">
              ₹{(product.offerPrice * product.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto p-2 hover:bg-red-50 rounded-full transition duration-300"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/products")}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-purple-500 font-medium hover:text-purple-600 transition duration-300"
        >
          <svg
            width="15"
            height="11"
            viewBox="0 0 15 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Continue Velvoria Shopping
        </button>
      </div>
      <div className="max-w-[360px] w-full bg-purple-50/40 p-5 max-md:mt-16 border border-purple-200/70 rounded-lg">
        <h2 className="text-xl md:text-xl font-medium text-gray-800">Order Summary</h2>
        <hr className="border-purple-200 my-5" />
        <div className="mb-6">
          <p className="text-sm font-medium uppercase text-gray-700">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">
                {selectedAddress ? (
                  selectedAddress.displayText || selectedAddress.fullAddress || 
                  `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                ) : (
                  "No Address Selected"
                )}
              </p>
              {currentLocation && (
                <p className="text-xs text-purple-600 mt-1">
                  📍 Current location detected: {currentLocation.displayText}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowLocationModal(true)}
              className="text-purple-500 hover:text-purple-600 cursor-pointer text-sm transition duration-300 ml-2"
            >
              {selectedAddress ? "Change" : "Select"}
            </button>
            
            {/* Saved Addresses Dropdown */}
            {showAddress && address.length > 0 && (
              <div className="absolute top-12 py-1 bg-white border border-purple-300 text-sm w-full z-10 rounded-lg shadow-lg">
                {address.map((address, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-600 p-2 hover:bg-purple-50 cursor-pointer border-b border-purple-100 last:border-b-0"
                  >
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country}
                  </p>
                ))}
                <p
                  onClick={() => setShowLocationModal(true)}
                  className="text-purple-500 text-center cursor-pointer p-2 hover:bg-purple-100 font-medium"
                >
                  + Add new address
                </p>
              </div>
            )}
          </div>

          {/* Show saved addresses button if available */}
          {address.length > 0 && (
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-purple-500 hover:text-purple-600 cursor-pointer text-sm transition duration-300 mt-2"
            >
              {showAddress ? "Hide" : "Show"} saved addresses ({address.length})
            </button>
          )}

          <p className="text-sm font-medium uppercase mt-6 text-gray-700">Payment Method</p>

          <div className="space-y-3 mt-2">
            {/* COD with 17% Advance Option */}
            <label className="flex items-center gap-3 p-3 border border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition duration-300">
              <input
                type="radio"
                name="payment"
                value="cod_advance"
                checked={paymentOption === "cod_advance"}
                onChange={() => setPaymentOption("cod_advance")}
                className="text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Cash on Delivery (17% Advance)</p>
                <p className="text-sm text-gray-600">
                  Pay ₹{calculateCODAmount()} now, remaining ₹{totalCartAmount() - calculateCODAmount()} on delivery
                </p>
              </div>
            </label>

            {/* Full Online Payment Option */}
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-300">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentOption === "online"}
                onChange={() => setPaymentOption("online")}
                className="text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Full Online Payment</p>
                <p className="text-sm text-gray-600">Pay securely with Razorpay</p>
              </div>
            </label>
          </div>

          {paymentOption === "online" && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-700">
                💳 Secure payment via Razorpay. Accepts Credit/Debit Cards, UPI, Net Banking.
              </p>
            </div>
          )}
        </div>

        <hr className="border-purple-200" />

        <div className="text-gray-600 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Items Total</span>
            <span>₹{totalCartAmount().toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600 font-medium">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>₹{((totalCartAmount() * 2) / 100).toFixed(2)}</span>
          </p>
          {paymentOption === "cod_advance" && (
            <>
              <p className="flex justify-between text-green-600">
                <span>17% Advance Payment</span>
                <span>₹{calculateCODAmount()}</span>
              </p>
              <p className="flex justify-between text-orange-600">
                <span>Remaining on Delivery</span>
                <span>₹{totalCartAmount() - calculateCODAmount()}</span>
              </p>
            </>
          )}
          <p className="flex justify-between text-lg font-medium mt-3 pt-3 border-t border-purple-200">
            <span className="text-gray-800">
              {paymentOption === "cod_advance" ? "Total Amount:" : "Amount to Pay:"}
            </span>
            <span className="text-purple-600 font-bold">
              {paymentOption === "cod_advance" ? `₹${totalCartAmount()}` : `₹${totalAmount.toFixed(2)}`}
            </span>
          </p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={processing}
          className={`w-full py-3 mt-6 cursor-pointer bg-purple-500 text-white font-medium hover:bg-purple-600 transition duration-300 rounded-lg ${
            processing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {processing ? "Processing..." : (
            paymentOption === "cod_advance" 
              ? `Pay ₹${calculateCODAmount()} Advance` 
              : `Pay ₹${totalAmount.toFixed(2)}`
          )}
        </button>
        
        <p className="text-xs text-center text-gray-500 mt-3">
          🧶 Each item is handmade with love and care
        </p>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          amount={paymentOption === "cod_advance" ? calculateCODAmount() : totalAmount}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
          isCODAdvance={paymentOption === "cod_advance"}
          totalAmount={totalCartAmount()}
        />
      )}

      {/* Location Selection Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
        currentLocation={currentLocation}
      />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🧶</span>
      </div>
      <h2 className="text-2xl font-medium mb-4 text-gray-800">Your velvoria cart is empty</h2>
      <p className="text-gray-600 mb-6">Add some beautiful handmade creations to your cart!</p>
      <button
        onClick={() => navigate("/products")}
        className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition duration-300"
      >
        Explore Velvoria Collection
      </button>
    </div>
  );
};

export default Cart;