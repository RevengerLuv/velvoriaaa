// FundsUsage.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const FundUsage = () => {
  const { axios } = useAppContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
    pending: 0
  });

  const fetchFundsData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/funds");
      if (data.success) {
        setTransactions(data.transactions);
        setStats(data.stats);
      } else {
        // Fallback mock data
        const mockData = generateMockFundsData();
        setTransactions(mockData.transactions);
        setStats(mockData.stats);
      }
    } catch (error) {
      console.error("Funds error:", error);
      toast.error("Error loading funds data");
      const mockData = generateMockFundsData();
      setTransactions(mockData.transactions);
      setStats(mockData.stats);
    } finally {
      setLoading(false);
    }
  };

  const generateMockFundsData = () => {
    const transactions = [
      {
        _id: "1",
        type: "income",
        amount: 89.99,
        description: "Sale - Amigurumi Bunny",
        date: "2024-01-15T10:30:00Z",
        status: "completed",
        orderId: "ORD-001"
      },
      {
        _id: "2",
        type: "expense",
        amount: -15.00,
        description: "Facebook Ads",
        date: "2024-01-14T09:15:00Z",
        status: "completed",
        category: "advertising"
      },
      {
        _id: "3",
        type: "income",
        amount: 156.50,
        description: "Sale - Velvoria Blanket & Booties",
        date: "2024-01-13T14:20:00Z",
        status: "pending",
        orderId: "ORD-002"
      },
      {
        _id: "4",
        type: "expense",
        amount: -8.50,
        description: "Shipping Materials",
        date: "2024-01-12T11:45:00Z",
        status: "completed",
        category: "supplies"
      },
      {
        _id: "5",
        type: "expense",
        amount: -25.00,
        description: "Yarn Supplies",
        date: "2024-01-10T16:30:00Z",
        status: "completed",
        category: "materials"
      }
    ];

    const stats = {
      balance: transactions.reduce((sum, t) => sum + (t.status === "completed" ? t.amount : 0), 0),
      totalEarned: transactions.filter(t => t.type === "income" && t.status === "completed").reduce((sum, t) => sum + t.amount, 0),
      totalSpent: transactions.filter(t => t.type === "expense" && t.status === "completed").reduce((sum, t) => sum + Math.abs(t.amount), 0),
      pending: transactions.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0)
    };

    return { transactions, stats };
  };

  const withdrawFunds = async (amount) => {
    try {
      const { data } = await axios.post("/api/admin/funds/withdraw", { amount });
      if (data.success) {
        toast.success("Withdrawal request submitted");
        fetchFundsData();
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Error processing withdrawal");
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "all") return true;
    if (filter === "income") return transaction.type === "income";
    if (filter === "expense") return transaction.type === "expense";
    return transaction.status === filter;
  });

  useEffect(() => {
    fetchFundsData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Funds Management</h1>
          <p className="text-gray-600 mt-1">Track your earnings and expenses</p>
        </div>
        <button 
          onClick={() => withdrawFunds(100)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          💰 Withdraw Funds
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-gray-800">${stats.balance.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Available Balance</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">${stats.totalEarned.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Earned</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-600">${stats.totalSpent.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">${stats.pending.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={fetchFundsData}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction._id} className="p-6 hover:bg-gray-50 transition duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === "income" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {transaction.type === "income" ? "💰" : "💸"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                        {transaction.orderId && (
                          <span className="text-sm text-blue-600">{transaction.orderId}</span>
                        )}
                        {transaction.category && (
                          <span className="text-sm text-gray-500 capitalize">{transaction.category}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === "completed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTransactions.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <p className="text-gray-500">No transactions found</p>
            <p className="text-sm text-gray-400 mt-1">Transaction history will appear here</p>
          </div>
        )}
      </div>

      {/* Expense Categories */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Expense Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { category: "Advertising", amount: 45.00, color: "bg-blue-500" },
            { category: "Materials", amount: 125.50, color: "bg-green-500" },
            { category: "Shipping", amount: 28.75, color: "bg-purple-500" },
            { category: "Fees", amount: 15.25, color: "bg-orange-500" }
          ].map((item, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-4 h-4 ${item.color} rounded-full mx-auto mb-2`}></div>
              <p className="font-medium text-gray-800">{item.category}</p>
              <p className="text-lg font-bold text-gray-900">${item.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FundUsage;