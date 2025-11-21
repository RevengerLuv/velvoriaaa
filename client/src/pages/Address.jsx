// Address.jsx - UPDATED VERSION
import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Address = () => {
  const [address, setAddress] = React.useState({
    fullName: "",
    phoneNumber: "",
    alternatePhone: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "home"
  });
  
  const { axios, user, navigate } = useContext(AppContext);
  
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const submitHanlder = async (e) => {
    try {
      e.preventDefault();
      console.log("Submitting address:", address); // Debug log
      
      const { data } = await axios.post("/api/address/add", { address });
      console.log("Response data:", data);
      
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, []);

  return (
    <div className="mt-12 flex flex-col md:flex-row gap-6 p-6 bg-purple-50 rounded-lg shadow-md">
      {/* Left Side: Address Fields */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Shipping Address
        </h2>
        <p className="text-gray-600 mb-4">Where should we send your handmade Velvoria creations?</p>
        
        <form onSubmit={submitHanlder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="col-span-2">
            <label className="block text-gray-600">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-600">Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={address.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Alternate Phone */}
          <div>
            <label className="block text-gray-600">Alternate Phone (Optional)</label>
            <input
              type="tel"
              name="alternatePhone"
              value={address.alternatePhone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* House/Building Number */}
          <div>
            <label className="block text-gray-600">House/Building No *</label>
            <input
              type="text"
              name="houseNo"
              value={address.houseNo}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Street */}
          <div>
            <label className="block text-gray-600">Street *</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Landmark */}
          <div className="col-span-2">
            <label className="block text-gray-600">Landmark (Optional)</label>
            <input
              type="text"
              name="landmark"
              value={address.landmark}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Nearby famous place, building, etc."
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-600">City *</label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-600">State *</label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-gray-600">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Address Type */}
          <div>
            <label className="block text-gray-600">Address Type *</label>
            <select
              name="addressType"
              value={address.addressType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md transition duration-300 font-semibold"
            >
              Save Shipping Address
            </button>
          </div>
        </form>
      </div>

      {/* Right Side: Image */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={assets.add_address_iamge}
          alt="Velvoria Shipping Illustration"
          className="w-full max-w-xs rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Address;