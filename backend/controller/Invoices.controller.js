// controller/invoices.controller.js
import Invoice from "../models/Invoice.model.js";
import Order from "../models/order.model.js";

// Get all invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('order')
      .sort({ createdAt: -1 });

    // Format for frontend
    const formattedInvoices = invoices.map(invoice => ({
      _id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      orderId: invoice.order?.orderNumber || `ORD-${invoice.order?._id.toString().substring(0, 8)}`,
      customer: invoice.customer,
      amount: invoice.total,
      status: invoice.status,
      dueDate: invoice.dueDate,
      issuedDate: invoice.createdAt,
      paidDate: invoice.paidDate,
      items: invoice.items
    }));

    res.json({ success: true, invoices: formattedInvoices });
  } catch (error) {
    console.error("Invoices fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching invoices" });
  }
};

// Generate invoice from order
export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId)
      .populate('userId', 'name email')
      .populate('address')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Generate invoice number
    const invoiceCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(invoiceCount + 1).toString().padStart(3, '0')}`;

    const invoice = new Invoice({
      invoiceNumber,
      order: orderId,
      customer: {
        name: order.userId.name,
        email: order.userId.email,
        address: order.address
      },
      items: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      })),
      subtotal: order.amount,
      tax: 0,
      shipping: order.shippingPrice || 0,
      total: order.amount + (order.shippingPrice || 0),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'sent'
    });

    await invoice.save();

    res.json({ success: true, invoice, message: "Invoice generated successfully" });
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({ success: false, message: "Error generating invoice" });
  }
};