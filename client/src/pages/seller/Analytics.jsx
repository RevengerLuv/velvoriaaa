// Analytics.jsx - Updated with ₹ Currency
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { axios } = useAppContext();
  const [analyticsData, setAnalyticsData] = useState({});
  const [timeRange, setTimeRange] = useState("30days");
  const [loading, setLoading] = useState(true);
  const [realTimeStats, setRealTimeStats] = useState({});

  // Fetch main analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/order-analytics?period=${timeRange}`);
      if (data.success) {
        setAnalyticsData(data);
      } else {
        toast.error("Failed to load analytics");
        setAnalyticsData(generateMockAnalytics());
      }
    } catch (error) {
      console.error("Analytics error:", error);
      toast.error("Error loading analytics");
      setAnalyticsData(generateMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  // Fetch real-time stats
  const fetchRealTimeStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/realtime-stats");
      if (data.success) {
        setRealTimeStats(data.data);
      }
    } catch (error) {
      console.error("Real-time stats error:", error);
    }
  };

  const generateMockAnalytics = () => ({
    orderStats: [
      { _id: 'delivered', count: 45, totalAmount: 1800 },
      { _id: 'shipped', count: 12, totalAmount: 480 },
      { _id: 'pending', count: 8, totalAmount: 320 },
      { _id: 'cancelled', count: 3, totalAmount: 120 }
    ],
    dailyOrders: [
      { _id: '2024-01-01', count: 5, revenue: 200 },
      { _id: '2024-01-02', count: 8, revenue: 320 },
      { _id: '2024-01-03', count: 12, revenue: 480 },
      { _id: '2024-01-04', count: 6, revenue: 240 },
      { _id: '2024-01-05', count: 15, revenue: 600 },
      { _id: '2024-01-06', count: 9, revenue: 360 },
      { _id: '2024-01-07', count: 11, revenue: 440 }
    ],
    paymentAnalytics: [
      { _id: 'cod', count: 35, totalAmount: 1400 },
      { _id: 'card', count: 25, totalAmount: 1200 },
      { _id: 'paypal', count: 8, totalAmount: 400 }
    ],
    totalRevenue: 3000,
    totalOrders: 68
  });

  // Helper function to safely format status
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    const statusMap = {
      'pending': 'Pending',
      'shipped': 'Shipped', 
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'processing': 'Processing',
      'confirmed': 'Confirmed'
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Helper function to safely format payment method
  const formatPaymentMethod = (method) => {
    if (!method) return 'Unknown';
    const paymentMap = {
      'cod': 'Cash on Delivery',
      'card': 'Credit Card',
      'paypal': 'PayPal',
      'stripe': 'Stripe'
    };
    return paymentMap[method] || method;
  };

  // Order Status Chart - Using real data with null checks
  const orderStatusData = {
    labels: (analyticsData.orderStats || []).map(item => formatStatus(item?._id)),
    datasets: [
      {
        label: 'Order Count',
        data: (analyticsData.orderStats || []).map(item => item?.count || 0),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',  // Delivered - Green
          'rgba(59, 130, 246, 0.8)',  // Shipped - Blue
          'rgba(245, 158, 11, 0.8)',  // Pending - Yellow
          'rgba(239, 68, 68, 0.8)',   // Cancelled - Red
          'rgba(139, 92, 246, 0.8)',  // Processing - Purple
          'rgba(107, 114, 128, 0.8)'  // Unknown - Gray
        ],
        borderWidth: 2,
      },
    ],
  };

  // Daily Revenue Chart - Using real data with null checks
  const dailyRevenueData = {
    labels: (analyticsData.dailyOrders || []).map(item => {
      if (!item?._id) return 'Unknown Date';
      try {
        const date = new Date(item._id);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch {
        return item._id;
      }
    }),
    datasets: [
      {
        label: 'Daily Revenue (₹)',
        data: (analyticsData.dailyOrders || []).map(item => item?.revenue || 0),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Payment Analytics Chart with null checks
  const paymentAnalyticsData = {
    labels: (analyticsData.paymentAnalytics || []).map(item => formatPaymentMethod(item?._id)),
    datasets: [
      {
        label: 'Orders by Payment Method',
        data: (analyticsData.paymentAnalytics || []).map(item => item?.count || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  useEffect(() => {
    fetchAnalytics();
    fetchRealTimeStats();
  }, [timeRange]);

  // Refresh real-time stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealTimeStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <div className="text-lg text-gray-600">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time insights into your Velvoria performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Real-time Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-800">{realTimeStats.activeUsers || 0}</p>
              <p className="text-sm text-green-600">Live</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🛒</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-800">{realTimeStats.liveOrders || 0}</p>
              <p className="text-sm text-blue-600">Real-time</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue Today</p>
              <p className="text-2xl font-bold text-gray-800">₹{(realTimeStats.revenueToday || 0).toFixed(2)}</p>
              <p className="text-sm text-green-600">Today</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-800">{realTimeStats.pendingOrders || 0}</p>
              <p className="text-sm text-orange-600">Awaiting Action</p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Revenue & Orders Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">₹{(analyticsData.totalRevenue || 0).toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">All-time revenue from paid orders</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{analyticsData.totalOrders || 0}</p>
          <p className="text-sm text-gray-600 mt-1">All orders processed</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Order Status Distribution</h3>
          <div className="h-80">
            <Doughnut data={orderStatusData} options={chartOptions} />
          </div>
        </div>

        {/* Daily Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Daily Revenue Trend</h3>
          <div className="h-80">
            <Line data={dailyRevenueData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Payment Methods Analytics */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💳 Payment Methods Analytics</h3>
        <div className="h-80">
          <Doughnut data={paymentAnalyticsData} options={chartOptions} />
        </div>
      </div>

      {/* Order Details Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Order Statistics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(analyticsData.orderStats || []).map((stat, index) => {
                const status = stat?._id || 'unknown';
                const count = stat?.count || 0;
                const totalAmount = stat?.totalAmount || 0;
                const avgAmount = stat?.avgAmount || (count > 0 ? totalAmount / count : 0);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status === 'delivered' ? 'bg-green-100 text-green-800' :
                        status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {formatStatus(status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{count}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{avgAmount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Show message if no data */}
          {(analyticsData.orderStats || []).length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-gray-500">No order data available</p>
              <p className="text-sm text-gray-400 mt-1">Start receiving orders to see analytics</p>
            </div>
          )}
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">📊 Export Analytics</h3>
            <p className="text-gray-600 mt-1">Download detailed analytics reports for further analysis</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => toast.success("PDF export feature coming soon!")}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Export PDF Report
            </button>
            <button 
              onClick={() => toast.success("CSV export feature coming soon!")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Export CSV Data
            </button>
            <button 
              onClick={fetchAnalytics}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;