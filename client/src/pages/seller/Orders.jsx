import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [trackingModal, setTrackingModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: '',
    carrier: '',
    estimatedDelivery: ''
  });
  const { axios } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching orders from API...');
      // CHANGE FROM: /api/orders/seller TO: /api/seller/orders
      const { data } = await axios.get('/api/seller/orders');
      console.log('📦 API Response:', data);
      
      if (data?.success) {
        console.log('✅ Orders fetched successfully');
        setOrders(data.orders || []);
      } else {
        toast.error(data?.message || 'Failed to load orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('💥 Error fetching orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // CHANGE FROM: /api/orders/${orderId}/status TO: /api/seller/orders/${orderId}/status
      const { data } = await axios.put(`/api/seller/orders/${orderId}/status`, {
        status: newStatus
      });

      if (data.success) {
        toast.success('Order status updated successfully!');
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        setStatusUpdate('');
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const addTrackingInfo = async (orderId) => {
    try {
      // CHANGE FROM: /api/orders/${orderId}/tracking TO: /api/seller/orders/${orderId}/tracking
      const { data } = await axios.put(`/api/seller/orders/${orderId}/tracking`, trackingInfo);

      if (data.success) {
        toast.success('Tracking information added!');
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { 
            ...order, 
            tracking: trackingInfo,
            status: 'Shipped'
          } : order
        ));
        setTrackingModal(false);
        setTrackingInfo({
          trackingNumber: '',
          carrier: '',
          estimatedDelivery: ''
        });
      } else {
        toast.error(data.message || 'Failed to add tracking info');
      }
    } catch (error) {
      console.error('Error adding tracking info:', error);
      toast.error('Failed to add tracking information');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'order placed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'processing': return '🔄';
      case 'cancelled': return '❌';
      case 'order placed': return '📦';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions = [
    'Order Placed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Track and manage all customer orders</p>
        <div className="mt-4 flex space-x-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-purple-600">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                      {order.tracking?.trackingNumber && (
                        <p className="text-blue-600 text-sm mt-1">
                          Tracking: {order.tracking.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {order.status || 'Order Placed'}
                    </span>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{order.totalAmount?.toFixed(2) || order.amount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div key={item._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                           {item.product?.image?.[0] ? (
  <img
    src={`${BASE_URL}/images/${item.product.image[0]}`}
    alt={item.product.name}
    className="w-12 h-12 object-cover rounded-lg"
    onError={(e) => {
      e.target.src = "https://via.placeholder.com/48?text=No+Image";
    }}
  />
) : (
  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
    <span className="text-lg">🧶</span>
  </div>
)}


                            <div>
                              <p className="font-medium text-gray-900">
                                {item.product?.name || item.name || `Item ${index + 1}`}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Qty: {item.quantity} × ₹{item.price?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-purple-600">
                            ₹{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Management */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Order Management</h4>
                    <div className="space-y-4">
                      {/* Status Update */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Status
                        </label>
                        <select
                          value={statusUpdate}
                          onChange={(e) => setStatusUpdate(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        >
                          <option value="">Select new status</option>
                          {statusOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => updateOrderStatus(order._id, statusUpdate)}
                          disabled={!statusUpdate}
                          className="w-full mt-2 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Update Status
                        </button>
                      </div>

                      {/* Tracking Information */}
                      {order.status === 'Processing' && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setTrackingModal(true);
                          }}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Add Tracking Information
                        </button>
                      )}

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => window.open(`https://wa.me/91${order.address?.phoneNumber}?text=Hi, regarding your order ${order._id?.slice(-8)}`, '_blank')}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Contact Customer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information - NEW SECTION */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">🏠</span>
                    Delivery Address
                  </h4>
                  {order.address && typeof order.address === 'object' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.address.fullName}</p>
                        <p className="text-gray-600">{order.address.phoneNumber}</p>
                        <p className="text-gray-600 text-sm mt-2">
                          {order.address.houseNo}, {order.address.street}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {order.address.landmark && `${order.address.landmark}, `}
                          {order.address.city}, {order.address.state} - {order.address.pincode}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Address Type:</span> 
                          <span className="capitalize ml-2">{order.address.addressType}</span>
                        </p>
                        {order.address.alternatePhone && (
                          <p className="text-sm">
                            <span className="font-medium">Alternate Phone:</span> 
                            <span className="ml-2">{order.address.alternatePhone}</span>
                          </p>
                        )}
                        <button
                          onClick={() => window.open(`https://maps.google.com/?q=${order.address.houseNo},${order.address.street},${order.address.city},${order.address.pincode}`, '_blank')}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <span>📍</span>
                          <span>Open in Google Maps</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-500">Address information not available</p>
                  )}
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
                          Advance Paid: <span className="font-medium text-green-600">₹{order.advancePaid?.toFixed(2)}</span>
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
  <p className="text-sm text-gray-600">
    Customer: {order.userId?.name || order.userId?.email || `ID: ${typeof order.userId === 'string' ? order.userId.slice(-8) : order.userId?._id?.slice(-8) || 'N/A'}`}
  </p>
</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            No Orders Yet
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You haven't received any orders yet. They will appear here once customers start ordering your products.
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  Order Details - #{selectedOrder._id?.slice(-8).toUpperCase()}
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
              {/* Customer Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer ID</p>
                    <p className="font-medium">{selectedOrder.userId?._id || selectedOrder.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">{selectedOrder.paymentType}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={item._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {item.product?.image?.[0] ? (
                        const BASE_URL = import.meta.env.VITE_BACKEND_URL;
<img
  src={`${BASE_URL}/images/${product.image[0]}`}
  alt={item.product.name}
  className="w-12 h-12 object-cover rounded-lg"
  onError={(e) => {
    e.target.src = "https://via.placeholder.com/48?text=No+Image";
  }}
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
                        ₹{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{selectedOrder.amount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>₹{selectedOrder.taxAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  {selectedOrder.paymentType === 'COD_Advance' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance Paid</span>
                        <span className="text-green-600">₹{selectedOrder.advancePaid?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining</span>
                        <span>₹{selectedOrder.remainingAmount?.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span className="text-purple-600">
                      ₹{selectedOrder.totalAmount?.toFixed(2) || selectedOrder.amount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Add Tracking Information
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingInfo.trackingNumber}
                  onChange={(e) => setTrackingInfo(prev => ({
                    ...prev,
                    trackingNumber: e.target.value
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Enter tracking number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrier
                </label>
                <select
                  value={trackingInfo.carrier}
                  onChange={(e) => setTrackingInfo(prev => ({
                    ...prev,
                    carrier: e.target.value
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="">Select carrier</option>
                  <option value="DTDC">DTDC</option>
                  <option value="Blue Dart">Blue Dart</option>
                  <option value="Delhivery">Delhivery</option>
                  <option value="India Post">India Post</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery
                </label>
                <input
                  type="date"
                  value={trackingInfo.estimatedDelivery}
                  onChange={(e) => setTrackingInfo(prev => ({
                    ...prev,
                    estimatedDelivery: e.target.value
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setTrackingModal(false);
                  setTrackingInfo({
                    trackingNumber: '',
                    carrier: '',
                    estimatedDelivery: ''
                  });
                }}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => addTrackingInfo(selectedOrder._id)}
                disabled={!trackingInfo.trackingNumber || !trackingInfo.carrier}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
