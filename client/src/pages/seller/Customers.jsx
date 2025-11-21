// Customers.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Customers = () => {
  const { axios } = useAppContext();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/users");
      if (data.success) {
        setCustomers(data.users);
      } else {
        toast.error("Failed to load customers");
      }
    } catch (error) {
      console.error("Customers error:", error);
      toast.error("Error loading customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async (customerId) => {
    try {
      const { data } = await axios.get(`/api/admin/customers/${customerId}/orders`);
      if (data.success) {
        setCustomerOrders(data.orders);
      }
    } catch (error) {
      console.error("Customer orders error:", error);
      // Fallback: Show empty orders
      setCustomerOrders([]);
    }
  };

  const updateCustomerStatus = async (customerId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/admin/customers/${customerId}/status`, {
        status: newStatus
      });
      if (data.success) {
        toast.success("Customer status updated");
        fetchCustomers();
      }
    } catch (error) {
      toast.error("Failed to update customer status");
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer._id?.includes(searchTerm);
    
    const matchesFilter = filter === "all" || 
      (filter === "active" && customer.isActive !== false) ||
      (filter === "inactive" && customer.isActive === false) ||
      (filter === "highValue" && customer.totalSpent > 500);

    return matchesSearch && matchesFilter;
  });

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.isActive !== false).length,
    highValue: customers.filter(c => c.totalSpent > 500).length,
    totalRevenue: customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0)
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers Management</h1>
          <p className="text-gray-600 mt-1">Manage your Velvoria customers and their orders</p>
        </div>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2">
          <span>📧</span>
          Export Customers
        </button>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-gray-800">{customerStats.total}</div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{customerStats.active}</div>
          <div className="text-sm text-gray-600">Active Customers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600">{customerStats.highValue}</div>
          <div className="text-sm text-gray-600">High Value</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-blue-600">${customerStats.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="🔍 Search by name, email, or customer ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="highValue">High Value ($500+)</option>
          </select>
          <button
            onClick={fetchCustomers}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Total Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Last Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-purple-50 transition duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-purple-600">
                            {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.name || 'Unknown Customer'}</p>
                          <p className="text-sm text-gray-500">ID: {customer._id?.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{customer.email}</p>
                      <p className="text-sm text-gray-500">{customer.phone || 'No phone'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{customer.totalOrders || 0}</p>
                        <p className="text-xs text-gray-500">orders</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">${(customer.totalSpent || 0).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        Avg: ${customer.totalOrders > 0 ? ((customer.totalSpent || 0) / customer.totalOrders).toFixed(2) : '0.00'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {customer.lastOrderDate ? 
                        new Date(customer.lastOrderDate).toLocaleDateString() : 
                        'No orders'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={customer.isActive === false ? 'inactive' : 'active'}
                        onChange={(e) => updateCustomerStatus(customer._id, e.target.value)}
                        className={`text-xs rounded border px-2 py-1 ${
                          customer.isActive === false ? 
                          'bg-red-100 text-red-800 border-red-200' : 
                          'bg-green-100 text-green-800 border-green-200'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            fetchCustomerOrders(customer._id);
                          }}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200 transition duration-300"
                        >
                          View
                        </button>
                        <button className="bg-purple-100 text-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-200 transition duration-300">
                          Message
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredCustomers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-gray-500">No customers found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Customer Details</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Info */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-semibold text-purple-600">
                        {selectedCustomer.name?.charAt(0)?.toUpperCase() || 'C'}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800">{selectedCustomer.name || 'Unknown Customer'}</h4>
                    <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer ID:</span>
                      <span className="font-mono">{selectedCustomer._id?.substring(0, 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders:</span>
                      <span>{selectedCustomer.totalOrders || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-semibold">${(selectedCustomer.totalSpent || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span>{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Orders */}
              <div className="lg:col-span-2">
                <h4 className="font-semibold text-gray-800 mb-4">Order History</h4>
                <div className="space-y-3">
                  {customerOrders.length > 0 ? (
                    customerOrders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">Order #{order._id?.substring(0, 8)}</p>
                            <p className="text-sm text-gray-600">
                              {order.items?.length || 0} items • ${order.amount?.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📦</div>
                      <p>No orders found for this customer</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;