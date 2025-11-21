import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user;

    console.log("Received COD order request:", { userId, items, address });

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required"
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required"
      });
    }

    // Calculate total amount and validate products
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Find product
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemPrice = product.offerPrice || product.price;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: itemPrice,
        name: product.name
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate final amount (subtotal + 2% tax)
    const taxAmount = subtotal * 0.02;
    const shippingFee = 0;
    const totalAmount = subtotal + taxAmount + shippingFee;

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      amount: subtotal,
      totalAmount: totalAmount,
      taxAmount,
      shippingFee,
      address,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed"
    });

    const savedOrder = await order.save();

    console.log("COD order created successfully:", savedOrder._id);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: savedOrder
    });

  } catch (error) {
    console.error("Error in placeOrderCOD:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, address, paymentId } = req.body;
    const userId = req.user;

    console.log("Received Razorpay order request:", { userId, items, address, paymentId });

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required"
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required"
      });
    }

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required"
      });
    }

    // Calculate total amount and validate products
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Find product
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemPrice = product.offerPrice || product.price;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: itemPrice,
        name: product.name
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate final amount (subtotal + 2% tax)
    const taxAmount = subtotal * 0.02;
    const shippingFee = 0;
    const totalAmount = subtotal + taxAmount + shippingFee;

    // Create order with payment details
    const order = new Order({
      userId,
      items: orderItems,
      amount: subtotal,
      totalAmount: totalAmount,
      taxAmount,
      shippingFee,
      address,
      paymentType: "Razorpay",
      isPaid: true,
      paymentId: paymentId,
      status: "Order Placed"
    });

    const savedOrder = await order.save();

    console.log("Razorpay order created successfully:", savedOrder._id);

    res.status(201).json({
      success: true,
      message: "Order placed successfully with Razorpay!",
      order: savedOrder
    });

  } catch (error) {
    console.error("Error in placeOrderRazorpay:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ... keep your other functions (getUserOrders, getAllOrders, etc.) the same

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    console.log("🔄 Fetching orders for user:", userId);
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    console.log("📦 Raw orders found:", orders.length);
    
    // Enhanced population
    const populatedOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name image price offerPrice category'
      })
      .populate('address')
      .lean();

    console.log("✅ Populated orders:", populatedOrders.length);
    
    // Log each order structure for debugging
    populatedOrders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        id: order._id,
        itemsCount: order.items?.length,
        firstItem: order.items?.[0],
        status: order.status,
        amount: order.amount
      });
    });

    res.json({
      success: true,
      orders: populatedOrders
    });
  } catch (error) {
    console.error("❌ Error in getUserOrders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// In order.controller.js - REPLACE the getAllOrders function
export const getAllOrders = async (req, res) => {
  try {
    console.log("🔄 Fetching orders for seller...");
    
    const orders = await Order.find()
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name image price offerPrice category sellerId'
      })
      .populate({
        path: 'address',
        model: 'Address',
        select: 'fullName phoneNumber houseNo street landmark city state pincode addressType'
      })
      .populate({
        path: 'userId',
        model: 'User',
        select: 'name email phone'
      })
      .sort({ createdAt: -1 });

    console.log("✅ Orders fetched:", orders?.length);
    
    // Debug: Log first order to see structure
    if (orders.length > 0) {
      console.log("📦 Sample order structure:", JSON.stringify({
        id: orders[0]._id,
        items: orders[0].items?.length,
        address: orders[0].address,
        user: orders[0].userId,
        status: orders[0].status
      }, null, 2));
    }

    res.json({
      success: true,
      orders: orders || []
    });
  } catch (error) {
    console.error("❌ Error in getAllOrders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Add this function to order.controller.js
// Add this function to your order.controller.js
export const placeOrderCODAdvance = async (req, res) => {
  try {
    const { items, address, paymentId, advancePaid, remainingAmount, totalAmount } = req.body;
    const userId = req.user;

    console.log("🔄 Received COD Advance order request:", { 
      userId, 
      itemsCount: items?.length, 
      address: !!address, 
      paymentId,
      advancePaid,
      remainingAmount,
      totalAmount
    });

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required"
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required"
      });
    }

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required for COD advance"
      });
    }

    // Calculate total amount and validate products
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Find product
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemPrice = product.offerPrice || product.price;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: itemPrice,
        name: product.name
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate final amount (subtotal + 2% tax)
    const taxAmount = subtotal * 0.02;
    const shippingFee = 0;
    const calculatedTotalAmount = subtotal + taxAmount + shippingFee;

    // Use provided amounts or calculate them
    const finalAdvancePaid = advancePaid || Math.floor(calculatedTotalAmount * 0.17);
    const finalRemainingAmount = remainingAmount || (calculatedTotalAmount - finalAdvancePaid);

    console.log("💰 Payment breakdown:", {
      subtotal,
      taxAmount,
      calculatedTotalAmount,
      finalAdvancePaid,
      finalRemainingAmount
    });

    // Create order with COD advance details
    const order = new Order({
      userId,
      items: orderItems,
      amount: subtotal,
      totalAmount: calculatedTotalAmount,
      taxAmount,
      shippingFee,
      address,
      paymentType: "COD_Advance",
      paymentId: paymentId,
      advancePaid: finalAdvancePaid,
      remainingAmount: finalRemainingAmount,
      isPaid: true, // 17% is paid
      status: "Order Placed"
    });

    const savedOrder = await order.save();

    console.log("✅ COD Advance order created successfully:", savedOrder._id);

    res.status(201).json({
      success: true,
      message: `Order placed successfully! ₹${finalAdvancePaid} paid now, ₹${finalRemainingAmount} on delivery`,
      order: savedOrder
    });

  } catch (error) {
    console.error("❌ Error in placeOrderCODAdvance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// order.controller.js - Add these new functions

export const addTrackingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, carrier, estimatedDelivery } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        tracking: {
          trackingNumber,
          carrier,
          estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null
        },
        status: 'Shipped'
      },
      { new: true }
    ).populate('items.product').populate('address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Tracking information added successfully",
      order
    });
  } catch (error) {
    console.error("Error in addTrackingInfo:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const sendCustomerNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, type = 'status_update' } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        $push: {
          notifications: {
            type,
            message,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Here you can integrate with email service, push notifications, etc.
    console.log(`📧 Notification sent for order ${id}:`, message);

    res.json({
      success: true,
      message: "Customer notified successfully",
      notification: {
        type,
        message,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error("Error in sendCustomerNotification:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getOrderAnalytics = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product');
    
    const analytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      statusBreakdown: orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}),
      recentOrders: orders.slice(0, 10).map(order => ({
        id: order._id,
        status: order.status,
        total: order.totalAmount,
        date: order.createdAt
      }))
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error("Error in getOrderAnalytics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// Add this test function to your order.controller.js
export const testOrders = async (req, res) => {
  try {
    console.log("=== Testing Order Population ===");
    
    // Get a sample order without population
    const orders = await Order.find().limit(1);
    console.log("Sample raw order structure:", JSON.stringify(orders[0], null, 2));
    
    // Get the same order with population
    const populated = await Order.find().limit(1)
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name image price offerPrice category weight'
      })
      .populate('address');
    
    console.log("Populated order structure:", JSON.stringify(populated[0], null, 2));
    
    res.json({
      success: true,
      message: "Check your backend console for detailed order structure",
      rawOrder: orders[0],
      populatedOrder: populated[0]
    });
  } catch (error) {
    console.error("Test error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
