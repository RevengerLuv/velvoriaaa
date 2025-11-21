// backend/initSettings.js
import mongoose from 'mongoose';
import Setting from './models/Setting.model.js';

const initSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const defaultSettings = [
      // General Settings
      { key: 'storeName', value: 'Crochet Craft Store', category: 'general' },
      { key: 'storeEmail', value: 'hello@crochetstore.com', category: 'general' },
      { key: 'storePhone', value: '+1 (555) 123-4567', category: 'general' },
      { key: 'currency', value: 'USD', category: 'general' },
      
      // Payment Settings
      { key: 'stripeEnabled', value: true, category: 'payment' },
      { key: 'paypalEnabled', value: true, category: 'payment' },
      { key: 'codEnabled', value: true, category: 'payment' },
      
      // Shipping Settings
      { key: 'freeShippingThreshold', value: 50, category: 'shipping' },
      { key: 'domesticShipping', value: 5.99, category: 'shipping' },
      { key: 'internationalShipping', value: 15.99, category: 'shipping' }
    ];

    await Setting.deleteMany({});
    await Setting.insertMany(defaultSettings);
    
    console.log('Default settings initialized!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing settings:', error);
    process.exit(1);
  }
};

initSettings();