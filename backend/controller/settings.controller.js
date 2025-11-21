// controller/settings.controller.js
import Setting from "../models/Setting.model.js";

// Get all settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    
    // Convert to object format for frontend
    const settingsObj = {
      general: {},
      payment: {},
      shipping: {},
      notifications: {},
      security: {}
    };

    settings.forEach(setting => {
      if (settingsObj[setting.category]) {
        settingsObj[setting.category][setting.key] = setting.value;
      }
    });

    // Set defaults if no settings exist
    if (settings.length === 0) {
      settingsObj.general = {
        storeName: "Crochet Craft Store",
        storeEmail: "hello@crochetstore.com",
        storePhone: "+1 (555) 123-4567",
        currency: "USD",
        timezone: "America/New_York",
        maintenanceMode: false
      };
      settingsObj.payment = {
        stripeEnabled: true,
        paypalEnabled: true,
        codEnabled: true,
        stripePublicKey: "",
        stripeSecretKey: "",
        paypalClientId: ""
      };
      settingsObj.shipping = {
        freeShippingThreshold: 50,
        domesticShipping: 5.99,
        internationalShipping: 15.99,
        processingTime: "2-3 business days"
      };
      settingsObj.notifications = {
        emailOrders: true,
        emailInventory: true,
        emailReviews: true,
        pushNotifications: true,
        lowStockAlert: 5
      };
      settingsObj.security = {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        loginAttempts: 5
      };
    }

    res.json({ success: true, settings: settingsObj });
  } catch (error) {
    console.error("Settings fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching settings" });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const { section, settings } = req.body;

    // Update or create each setting in the section
    const updates = Object.keys(settings).map(async (key) => {
      await Setting.findOneAndUpdate(
        { key, category: section },
        { value: settings[key], category: section },
        { upsert: true, new: true }
      );
    });

    await Promise.all(updates);

    res.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Settings update error:", error);
    res.status(500).json({ success: false, message: "Error updating settings" });
  }
};