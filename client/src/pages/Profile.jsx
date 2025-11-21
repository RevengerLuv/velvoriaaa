import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser, axios, navigate } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put('/api/user/profile', {
        name: formData.name.trim(),
        phone: formData.phone.trim()
      });

      if (data.success) {
        setUser(data.user);
        toast.success('Profile updated successfully! 🎉');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Add these state variables to your Profile component
const [currentLocation, setCurrentLocation] = useState(null);

// Add these functions to your Profile component
const detectCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation is not supported by your browser");
    return;
  }

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
          toast.success('📍 Location detected successfully!');
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        toast.error('Failed to detect location');
      }
    },
    (error) => {
      toast.error('Location detection failed. Please check permissions.');
    }
  );
};

const openGoogleMaps = () => {
  if (currentLocation) {
    window.open(`https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`, '_blank');
  } else {
    window.open('https://www.google.com/maps', '_blank');
  }
};

// Auto-detect location when profile loads
useEffect(() => {
  detectCurrentLocation();
}, []);

  const changePassword = async (e) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put('/api/user/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (data.success) {
        toast.success('Password changed successfully! 🔒');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-gray-600 text-lg">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg mb-6">
            <span className="text-2xl text-white">👤</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Settings</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your personal information, security settings, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* User Card */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{user.name}</h3>
                    <p className="text-purple-100 text-sm truncate">{user.email}</p>
                    {user.isGoogleAuth && (
                      <span className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs mt-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                        Google Account
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'bg-purple-50 text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">👤</span>
                  <span>Profile</span>
                </button>

                {!user.isGoogleAuth && (
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === 'password'
                        ? 'bg-purple-50 text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">🔒</span>
                    <span>Security</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/my-orders')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                >
                  <span className="text-lg">📦</span>
                  <span>My Orders</span>
                </button>

                <button
                  onClick={() => navigate('/add-address')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                >
                  <span className="text-lg">🏠</span>
                  <span>Addresses</span>
                </button>

                <button
  onClick={() => setActiveTab('location')}
  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
    activeTab === 'location'
      ? 'bg-purple-50 text-purple-600 shadow-sm'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  }`}
>
  <span className="text-lg">📍</span>
  <span>Location</span>
</button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      <p className="text-gray-600 mt-1">Update your personal details and contact information</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                  </div>
                  

                  <form onSubmit={updateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50/50"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full p-4 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Email address cannot be changed
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50/50"
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Account Type
                        </label>
                        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${user.isGoogleAuth ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                            <span className="font-medium text-gray-700">
                              {user.isGoogleAuth ? "Google Account" : "Email Account"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          'Update Profile'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                      <p className="text-gray-600 mt-1">Change your password to keep your account secure</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">🔒</span>
                    </div>
                  </div>

                  <form onSubmit={changePassword} className="space-y-6 max-w-2xl">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50/50"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        New Password *
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50/50"
                        placeholder="Enter new password (min. 6 characters)"
                        required
                        minLength="6"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50/50"
                        placeholder="Confirm your new password"
                        required
                        minLength="6"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-500 text-lg">💡</span>
                        <div>
                          <p className="font-medium text-blue-800">Password Requirements</p>
                          <ul className="text-blue-700 text-sm mt-1 space-y-1">
                            <li>• Minimum 6 characters long</li>
                            <li>• Should not match current password</li>
                            <li>• Use a combination of letters and numbers</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Changing...</span>
                          </div>
                        ) : (
                          'Change Password'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

{/* Location Management Tab */}
{activeTab === 'location' && (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">
      Location Management
    </h2>
    
    <div className="space-y-6">
      {/* Current Location Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-blue-600 mr-2">📍</span>
          Current Location
        </h4>
        {currentLocation ? (
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Location:</span> {currentLocation.displayText}
            </p>
            <p className="text-sm text-gray-600">
              Coordinates: {currentLocation.latitude?.toFixed(4)}, {currentLocation.longitude?.toFixed(4)}
            </p>
            <button
              onClick={detectCurrentLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Refresh Location
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">No location detected</p>
            <button
              onClick={detectCurrentLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Detect My Location
            </button>
          </div>
        )}
      </div>

      {/* Location Selection Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="text-green-600 mr-2">🗺️</span>
            Google Maps
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Select your precise location using Google Maps
          </p>
          <button
            onClick={openGoogleMaps}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>🗺️</span>
            <span>Open Google Maps</span>
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="text-purple-600 mr-2">🏠</span>
            Saved Addresses
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Manage your delivery addresses
          </p>
          <button
            onClick={() => navigate('/add-address')}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>🏠</span>
            <span>Manage Addresses</span>
          </button>
        </div>
      </div>

      {/* Location History */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-gray-600 mr-2">📋</span>
          Location Preferences
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Default Delivery Location</p>
              <p className="text-sm text-gray-600">Used for quick ordering</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Set Current
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Auto-location Detection</p>
              <p className="text-sm text-gray-600">Automatically detect location on app open</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;