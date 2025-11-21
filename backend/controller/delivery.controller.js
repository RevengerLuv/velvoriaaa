// delivery.controller.js - New file for delivery management
import Order from "../models/order.model.js";
import DeliveryExecutive from "../models/deliveryExecutive.model.js";

export const assignDeliveryExecutive = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { executiveId } = req.body;

    const order = await Order.findById(orderId);
    const executive = await DeliveryExecutive.findById(executiveId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (!executive) {
      return res.status(404).json({
        success: false,
        message: "Delivery executive not found"
      });
    }

    // Update order with delivery executive
    order.deliveryExecutive = {
      name: executive.name,
      phone: executive.phone,
      vehicleNumber: executive.vehicleNumber,
      photo: executive.photo
    };
    order.status = 'Out for Delivery';
    order.tracking.outForDelivery = new Date();

    await order.save();

    res.json({
      success: true,
      message: "Delivery executive assigned successfully",
      order
    });
  } catch (error) {
    console.error("Error in assignDeliveryExecutive:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note, location } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = status;
    
    if (status === 'Delivered') {
      order.tracking.actualDelivery = new Date();
    }

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note,
      updatedBy: 'delivery_executive'
    });

    await order.save();

    res.json({
      success: true,
      message: "Delivery status updated successfully",
      order
    });
  } catch (error) {
    console.error("Error in updateDeliveryStatus:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getNearbyExecutives = async (req, res) => {
  try {
    const { pincode } = req.query;

    const executives = await DeliveryExecutive.find({
      activeAreas: pincode,
      isActive: true,
      available: true
    });

    res.json({
      success: true,
      executives
    });
  } catch (error) {
    console.error("Error in getNearbyExecutives:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};