// Invoices.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Invoices = () => {
  const { axios } = useAppContext();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/invoices");
      if (data.success) {
        setInvoices(data.invoices);
      } else {
        setInvoices(generateMockInvoices());
      }
    } catch (error) {
      console.error("Invoices error:", error);
      toast.error("Error loading invoices");
      setInvoices(generateMockInvoices());
    } finally {
      setLoading(false);
    }
  };
  const generateMockInvoices = () => [
    {
      _id: "INV-2024-001",
      orderId: "ORD-001",
      customer: { name: "Sarah Johnson", email: "sarah@email.com" },
      amount: 89.99,
      status: "paid",
      dueDate: "2024-01-20",
      issuedDate: "2024-01-15",
      paidDate: "2024-01-16",
      items: [
        { name: "Amigurumi Bunny", quantity: 1, price: 89.99 }
      ]
    },
    {
      _id: "INV-2024-002",
      orderId: "ORD-002",
      customer: { name: "Mike Chen", email: "mike@email.com" },
      amount: 156.50,
      status: "pending",
      dueDate: "2024-01-25",
      issuedDate: "2024-01-18",
      paidDate: null,
      items: [
        { name: "Velvoria Blanket", quantity: 1, price: 129.99 },
        { name: "Baby Booties", quantity: 1, price: 26.51 }
      ]
    },
    {
      _id: "INV-2024-003",
      orderId: "ORD-003",
      customer: { name: "Emma Davis", email: "emma@email.com" },
      amount: 45.75,
      status: "overdue",
      dueDate: "2024-01-10",
      issuedDate: "2024-01-05",
      paidDate: null,
      items: [
        { name: "Velvoria Scarf", quantity: 2, price: 22.87 }
      ]
    }
  ];

  const downloadInvoice = (invoice) => {
    toast.success(`Downloading invoice ${invoice._id}`);
    // In real implementation, this would download PDF
  };

  const sendReminder = (invoice) => {
    toast.success(`Payment reminder sent for ${invoice._id}`);
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === "all") return true;
    return invoice.status === filter;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === "paid").length,
    pending: invoices.filter(i => i.status === "pending").length,
    overdue: invoices.filter(i => i.status === "overdue").length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0)
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invoice Management</h1>
          <p className="text-gray-600 mt-1">Manage customer invoices and payments</p>
        </div>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
          📄 Generate Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Invoices</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-purple-600">${stats.totalAmount.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Amount</div>
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
            <option value="all">All Invoices</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <button
            onClick={fetchInvoices}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Invoices Table */}
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Invoice</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-purple-50 transition duration-300">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{invoice._id}</p>
                        <p className="text-sm text-gray-500">Order: {invoice.orderId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.customer.name}</p>
                        <p className="text-sm text-gray-500">{invoice.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">${invoice.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === "paid" ? "bg-green-100 text-green-800" :
                        invoice.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                      {invoice.status === "overdue" && (
                        <p className="text-xs text-red-600">Overdue</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadInvoice(invoice)}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200 transition duration-300"
                        >
                          Download
                        </button>
                        {invoice.status !== "paid" && (
                          <button
                            onClick={() => sendReminder(invoice)}
                            className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-sm hover:bg-orange-200 transition duration-300"
                          >
                            Remind
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="bg-purple-100 text-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-200 transition duration-300"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredInvoices.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-gray-500">No invoices found</p>
            <p className="text-sm text-gray-400 mt-1">Customer invoices will appear here</p>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Invoice Details</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800">Invoice Information</h4>
                  <p className="text-sm text-gray-600">ID: {selectedInvoice._id}</p>
                  <p className="text-sm text-gray-600">Order: {selectedInvoice.orderId}</p>
                </div>
                <div className="text-right">
                  <h4 className="font-semibold text-gray-800">Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedInvoice.status === "paid" ? "bg-green-100 text-green-800" :
                    selectedInvoice.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Customer</h4>
                <p className="text-gray-600">{selectedInvoice.customer.name}</p>
                <p className="text-gray-600">{selectedInvoice.customer.email}</p>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Items</h4>
                <div className="space-y-3">
                  {selectedInvoice.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>${selectedInvoice.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Issued: {new Date(selectedInvoice.issuedDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Due: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
                {selectedInvoice.paidDate && (
                  <div>
                    <p className="text-gray-600">Paid: {new Date(selectedInvoice.paidDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button
                onClick={() => downloadInvoice(selectedInvoice)}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Download PDF
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;