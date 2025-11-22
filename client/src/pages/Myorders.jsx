import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const MyOrders = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { axios, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/orders/user");
      
      if (data.success) {
        console.log("📦 Orders fetched:", data.orders);
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Failed to load orders");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'processing': return '🔄';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My <span className="text-purple-600">Orders</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track and manage your velvoria orders
          </p>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status || 'Order Placed'}
                      </span>
<p className="text-2xl font-bold text-purple-600">
  ₹{order.totalAmount?.toFixed(2) || order.amount?.toFixed(2) || '0.00'}
</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        {item.product?.image?.[0] ? (
                                          
<img
  src={`${BASE_URL}/images/${product.image[0]}`}
  alt={product.name}
  className="w-full h-48 object-cover"
/>
                        ) : (
                          <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🧶</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.product?.name || item.name || `Item ${index + 1}`}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Qty: {item.quantity} × ${item.price?.toFixed(2) || '0.00'}
                          </p>
<p className="text-purple-600 font-semibold">
  ₹{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Payment: <span className="font-medium capitalize">{order.paymentType}</span>
                        </p>
                        {order.paymentType === 'COD_Advance' && (
                          <p className="text-sm text-gray-600">
                            Advance Paid: <span className="font-medium text-green-600">${order.advancePaid?.toFixed(2)}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <button
              onClick={() => window.location.href = '/products'}
              className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium capitalize">{selectedOrder.paymentType}</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {item.product?.image?.[0] ? (
                                          
<img
  src={`${BASE_URL}/images/${product.image[0]}`}
  alt={product.name}
  className="w-full h-48 object-cover"
/>
                        ) : (
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🧶</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product?.name || item.name}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-purple-600">
                        ${((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${selectedOrder.amount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${selectedOrder.taxAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  {selectedOrder.paymentType === 'COD_Advance' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance Paid</span>
                        <span className="text-green-600">${selectedOrder.advancePaid?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining</span>
                        <span>${selectedOrder.remainingAmount?.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span className="text-purple-600">
                      ${selectedOrder.totalAmount?.toFixed(2) || selectedOrder.amount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
