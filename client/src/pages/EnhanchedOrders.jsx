// EnhanchedOrders.jsx - Updated for crochet orders
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const EnhancedOrders = () => {
  const { axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filters
  const statusOptions = [
    "all", "pending", "confirmed", "shipped", "delivered", "cancelled"
  ];

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      }
    } catch (error) {
      toast.error("Failed to load velvoria orders");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/order/${orderId}/status`, {
        status: newStatus
      });
      if (data.success) {
        toast.success(`Velvoria order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to update velvoria order status");
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this velvoria order?")) {
      try {
        const { data } = await axios.delete(`/api/order/${orderId}`);
        if (data.success) {
          toast.success("Velvoria order deleted successfully");
          fetchOrders();
        }
      } catch (error) {
        toast.error("Failed to delete velvoria order");
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, orders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-purple-600">Loading velvoria orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Velvoria Orders Management</h1>
          <p className="text-gray-600 mt-1">Manage your handmade velvoria orders</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
            Export Orders
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300">
            Add New Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-purple-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Velvoria Orders
            </label>
            <input
              type="text"
              placeholder="Search by order ID, customer, payment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quick Stats
            </label>
            <div className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} velvoria orders
            </div>
            <div className="text-xs text-purple-600 mt-1">
              🧶 All items are handmade
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Velvoria Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onDelete={deleteOrder}
                  onView={() => setSelectedOrder(order)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
};

// Order Row Component
const OrderRow = ({ order, onUpdateStatus, onDelete, onView }) => {
  return (
    <tr className="hover:bg-purple-50 transition duration-300">
      <td className="px-6 py-4 text-sm font-mono text-gray-900">
        #{order._id.slice(-8)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {order.userId?.name || 'Unknown Customer'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="flex items-center gap-2">
          <span>{order.items?.length || 0} items</span>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
            Handmade
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
        ₹{order.amount}
      </td>
      <td className="px-6 py-4 text-sm">
        <span className={`px-2 py-1 text-xs rounded-full ${
          order.paymentType === 'razorpay' ? 'bg-green-100 text-green-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {order.paymentType?.toUpperCase()}
        </span>
        {order.isPaid && (
          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Paid
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-sm">
        <select
          value={order.status}
          onChange={(e) => onUpdateStatus(order._id, e.target.value)}
          className={`text-xs rounded border px-2 py-1 focus:ring-2 focus:ring-purple-500 ${
            order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
            'bg-blue-100 text-blue-800 border-blue-200'
          }`}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm space-x-2">
        <button
          onClick={onView}
          className="text-purple-600 hover:text-purple-800 font-medium transition duration-300"
        >
          View
        </button>
        <button
          onClick={() => onDelete(order._id)}
          className="text-red-600 hover:text-red-800 font-medium transition duration-300"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Velvoria Order Details</h2>
            <p className="text-gray-600 text-sm mt-1">Order #{order._id}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl transition duration-300"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Velvoria Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🧶</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.product?.name || `Velvoria Item ${index + 1}`}</p>
                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.price}</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">Handmade Creation</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Information */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Order Information</h3>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Amount:</span>
                <span className="text-lg font-bold text-purple-600">₹{order.amount}</span>
              </div>
              
              <div>
                <span className="text-gray-700 font-medium block mb-2">Payment Method:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {order.paymentType?.toUpperCase()}
                </span>
                {order.isPaid && (
                  <span className="ml-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Paid
                  </span>
                )}
              </div>
              
              <div>
                <span className="text-gray-700 font-medium block mb-2">Order Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <span className="text-gray-700 font-medium block mb-1">Order Date:</span>
                <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  🧶 This order contains handmade velvoria items that are crafted with care and attention to detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOrders;