// controller/analytics.controller.js
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// Sales Analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '30days' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7days':
        dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
        break;
      case '30days':
        dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 30)) } };
        break;
      case '90days':
        dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 90)) } };
        break;
      case '1year':
        dateFilter = { createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } };
        break;
    }

    const salesData = await Order.aggregate([
      { $match: { ...dateFilter, isPaid: true } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          averageOrderValue: { $avg: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    res.json({ success: true, salesData });
  } catch (error) {
    console.error("Sales analytics error:", error);
    res.status(500).json({ success: false, message: "Error fetching sales analytics" });
  }
};

// Customer Analytics
export const getCustomerAnalytics = async (req, res) => {
  try {
    const customerStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          newCustomers: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", new Date(new Date().setDate(new Date().getDate() - 30))] },
                1, 0
              ]
            }
          }
        }
      }
    ]);

    const customerGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({ 
      success: true, 
      customerStats: customerStats[0] || { totalCustomers: 0, newCustomers: 0 },
      customerGrowth 
    });
  } catch (error) {
    console.error("Customer analytics error:", error);
    res.status(500).json({ success: false, message: "Error fetching customer analytics" });
  }
};

// Product Analytics
export const getProductAnalytics = async (req, res) => {
  try {
    const productPerformance = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          averageRating: { $avg: "$items.rating" }
        }
      },
      { $sort: { totalRevenue: -1 } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $project: {
          productName: { $arrayElemAt: ["$product.name", 0] },
          category: { $arrayElemAt: ["$product.category", 0] },
          totalSold: 1,
          totalRevenue: 1,
          averageRating: 1
        }
      }
    ]);

    const categoryPerformance = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $group: {
          _id: { $arrayElemAt: ["$product.category", 0] },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({ 
      success: true, 
      productPerformance, 
      categoryPerformance 
    });
  } catch (error) {
    console.error("Product analytics error:", error);
    res.status(500).json({ success: false, message: "Error fetching product analytics" });
  }
};

// Revenue Analytics
export const getRevenueAnalytics = async (req, res) => {
  try {
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
          profit: { $sum: { $multiply: ["$amount", 0.3] } } // Assuming 30% profit margin
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const paymentMethodRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: "$paymentType",
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 }
        }
      }
    ]);

    res.json({ 
      success: true, 
      revenueData, 
      paymentMethodRevenue 
    });
  } catch (error) {
    console.error("Revenue analytics error:", error);
    res.status(500).json({ success: false, message: "Error fetching revenue analytics" });
  }
};

// Traffic Analytics (Mock data for now)
export const getTrafficAnalytics = async (req, res) => {
  try {
    // This would typically come from Google Analytics or similar
    const trafficData = {
      sources: [
        { source: "Direct", visitors: 1245, conversionRate: 3.2 },
        { source: "Social Media", visitors: 987, conversionRate: 2.8 },
        { source: "Google", visitors: 765, conversionRate: 4.1 },
        { source: "Instagram", visitors: 532, conversionRate: 3.5 },
        { source: "Facebook", visitors: 421, conversionRate: 2.9 }
      ],
      devices: [
        { device: "Mobile", percentage: 65 },
        { device: "Desktop", percentage: 30 },
        { device: "Tablet", percentage: 5 }
      ],
      locations: [
        { location: "United States", visitors: 1542 },
        { location: "United Kingdom", visitors: 876 },
        { location: "Canada", visitors: 543 },
        { location: "Australia", visitors: 432 },
        { location: "India", visitors: 321 }
      ]
    };

    res.json({ success: true, trafficData });
  } catch (error) {
    console.error("Traffic analytics error:", error);
    res.status(500).json({ success: false, message: "Error fetching traffic analytics" });
  }
};

// Export Analytics Data
export const exportAnalyticsData = async (req, res) => {
  try {
    const { type = 'json' } = req.query;
    
    // Get comprehensive analytics data
    const analyticsData = {
      timestamp: new Date(),
      sales: await Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
            totalOrders: { $sum: 1 },
            averageOrderValue: { $avg: "$amount" }
          }
        }
      ]),
      customers: await User.aggregate([
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            activeCustomers: {
              $sum: {
                $cond: [
                  { $gte: ["$lastLogin", new Date(new Date().setDate(new Date().getDate() - 30))] },
                  1, 0
                ]
              }
            }
          }
        }
      ]),
      products: await Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            inStockProducts: {
              $sum: {
                $cond: [{ $eq: ["$inStock", true] }, 1, 0]
              }
            }
          }
        }
      ])
    };

    if (type === 'csv') {
      // Implement CSV export logic here
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-export.csv');
      // Return CSV data
      res.send("CSV export functionality coming soon");
    } else {
      res.json({ success: true, data: analyticsData });
    }
  } catch (error) {
    console.error("Export analytics error:", error);
    res.status(500).json({ success: false, message: "Error exporting analytics data" });
  }
};