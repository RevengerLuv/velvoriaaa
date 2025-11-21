// Settings.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Settings = () => {
  const { axios } = useAppContext();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      storeName: "Velvoria Craft Store",
      storeEmail: "hello@velvoriastore.com",
      storePhone: "+1 (555) 123-4567",
      currency: "USD",
      timezone: "America/New_York",
      maintenanceMode: false
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: true,
      codEnabled: true,
      stripePublicKey: "",
      stripeSecretKey: "",
      paypalClientId: ""
    },
    shipping: {
      freeShippingThreshold: 50,
      domesticShipping: 5.99,
      internationalShipping: 15.99,
      processingTime: "2-3 business days"
    },
    notifications: {
      emailOrders: true,
      emailInventory: true,
      emailReviews: true,
      pushNotifications: true,
      lowStockAlert: 5
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    }
  });

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get("/api/admin/settings");
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Settings fetch error:", error);
      toast.error("Error loading settings");
    }
  };

  const saveSettings = async (section) => {
    try {
      setLoading(true);
      const { data } = await axios.put("/api/admin/settings", {
        section,
        settings: settings[section]
      });
      
      if (data.success) {
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
      }
    } catch (error) {
      console.error("Settings save error:", error);
      toast.error("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Name
          </label>
          <input
            type="text"
            value={settings.general.storeName}
            onChange={(e) => handleInputChange("general", "storeName", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Email
          </label>
          <input
            type="email"
            value={settings.general.storeEmail}
            onChange={(e) => handleInputChange("general", "storeEmail", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Phone
          </label>
          <input
            type="text"
            value={settings.general.storePhone}
            onChange={(e) => handleInputChange("general", "storePhone", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleInputChange("general", "currency", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={settings.general.maintenanceMode}
          onChange={(e) => handleInputChange("general", "maintenanceMode", e.target.checked)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <label className="text-sm font-medium text-gray-700">
          Enable Maintenance Mode
        </label>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Payment Methods</h4>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">Stripe</p>
            <p className="text-sm text-gray-600">Credit card payments</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payment.stripeEnabled}
              onChange={(e) => handleInputChange("payment", "stripeEnabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">PayPal</p>
            <p className="text-sm text-gray-600">PayPal payments</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payment.paypalEnabled}
              onChange={(e) => handleInputChange("payment", "paypalEnabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">Cash on Delivery</p>
            <p className="text-sm text-gray-600">Pay when you receive</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payment.codEnabled}
              onChange={(e) => handleInputChange("payment", "codEnabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {settings.payment.stripeEnabled && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-800">Stripe Configuration</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key
              </label>
              <input
                type="password"
                value={settings.payment.stripePublicKey}
                onChange={(e) => handleInputChange("payment", "stripePublicKey", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                placeholder="pk_..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key
              </label>
              <input
                type="password"
                value={settings.payment.stripeSecretKey}
                onChange={(e) => handleInputChange("payment", "stripeSecretKey", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                placeholder="sk_..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Free Shipping Threshold ($)
          </label>
          <input
            type="number"
            value={settings.shipping.freeShippingThreshold}
            onChange={(e) => handleInputChange("shipping", "freeShippingThreshold", parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domestic Shipping ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.shipping.domesticShipping}
            onChange={(e) => handleInputChange("shipping", "domesticShipping", parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            International Shipping ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.shipping.internationalShipping}
            onChange={(e) => handleInputChange("shipping", "internationalShipping", parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Processing Time
          </label>
          <input
            type="text"
            value={settings.shipping.processingTime}
            onChange={(e) => handleInputChange("shipping", "processingTime", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., 2-3 business days"
          />
        </div>
      </div>
    </div>
  );

  const tabContent = {
    general: renderGeneralSettings(),
    payment: renderPaymentSettings(),
    shipping: renderShippingSettings(),
    notifications: <div>Notifications settings coming soon...</div>,
    security: <div>Security settings coming soon...</div>
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Settings</h1>
          <p className="text-gray-600 mt-1">Manage your store configuration and preferences</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: "general", name: "General", icon: "⚙️" },
              { id: "payment", name: "Payment", icon: "💳" },
              { id: "shipping", name: "Shipping", icon: "🚚" },
              { id: "notifications", name: "Notifications", icon: "🔔" },
              { id: "security", name: "Security", icon: "🔒" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {tabContent[activeTab]}
          
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => saveSettings(activeTab)}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;