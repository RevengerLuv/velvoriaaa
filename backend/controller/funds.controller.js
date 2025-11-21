// controller/funds.controller.js
import Transaction from "../models/Transaction.model.js";
import Order from "../models/order.model.js";

// Get funds data and transactions
export const getFundsData = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('order')
      .sort({ createdAt: -1 });

    // Calculate stats
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    
    const stats = {
      balance: completedTransactions.reduce((sum, t) => sum + t.amount, 0),
      totalEarned: completedTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      totalSpent: Math.abs(completedTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)),
      pending: transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0)
    };

    res.json({ success: true, transactions, stats });
  } catch (error) {
    console.error("Funds data error:", error);
    res.status(500).json({ success: false, message: "Error fetching funds data" });
  }
};

// Withdraw funds
export const withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    // Create withdrawal transaction
    const transaction = new Transaction({
      type: 'expense',
      amount: -Math.abs(amount),
      description: 'Funds Withdrawal',
      category: 'other',
      status: 'pending',
      paymentMethod: 'bank_transfer'
    });

    await transaction.save();

    res.json({ 
      success: true, 
      transaction,
      message: "Withdrawal request submitted successfully" 
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    res.status(500).json({ success: false, message: "Error processing withdrawal" });
  }
};

// Sync orders to transactions (call this when orders are completed)
export const syncOrderTransactions = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (order && order.isPaid) {
      const existingTransaction = await Transaction.findOne({ order: orderId });
      if (!existingTransaction) {
        const transaction = new Transaction({
          type: 'income',
          amount: order.amount,
          description: `Sale - Order ${order.orderNumber}`,
          category: 'sale',
          order: orderId,
          status: 'completed'
        });
        await transaction.save();
      }
    }
  } catch (error) {
    console.error("Transaction sync error:", error);
  }
};