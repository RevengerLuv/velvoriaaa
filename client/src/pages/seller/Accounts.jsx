// Accounts.jsx - Enhanced
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Accounts = () => {
  const { axios } = useAppContext();
  const [adminUsers, setAdminUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ 
    email: "", 
    password: "", 
    role: "Manager",
    name: "",
    permissions: ["view", "edit"]
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/admin-users");
      if (data.success) {
        setAdminUsers(data.adminUsers);
      }
    } catch (error) {
      toast.error("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/admin/create-admin", newAdmin);
      if (data.success) {
        toast.success("🧶 Admin user created successfully");
        setShowAddForm(false);
        setNewAdmin({ email: "", password: "", role: "Manager", name: "", permissions: ["view", "edit"] });
        fetchAdminUsers();
      }
    } catch (error) {
      toast.error("Failed to create admin user");
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin user?")) {
      try {
        const { data } = await axios.delete(`/api/admin/admin-users/${id}`);
        if (data.success) {
          toast.success("Admin user deleted successfully");
          fetchAdminUsers();
        }
      } catch (error) {
        toast.error("Failed to delete admin user");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const { data } = await axios.put(`/api/admin/admin-users/${id}/status`, {
        active: !currentStatus
      });
      if (data.success) {
        toast.success("Admin status updated");
        fetchAdminUsers();
      }
    } catch (error) {
      toast.error("Failed to update admin status");
    }
  };

  const filteredAdmins = adminUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Team Management</h1>
          <p className="text-gray-600 mt-1">Manage your Velvoria Store admin team members</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2"
        >
          <span>👥</span>
          Add New Admin
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <input
            type="text"
            placeholder="🔍 Search admins by email, name, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Total Admins</p>
          <p className="text-2xl font-bold text-purple-700">{adminUsers.length}</p>
        </div>
      </div>

      {/* Add Admin Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Add New Admin Member</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="admin@velvoriastore.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Manager">🧵 Manager</option>
                  <option value="Super Admin">👑 Super Admin</option>
                  <option value="Support">💬 Support</option>
                  <option value="Content Manager">📝 Content Manager</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Create Admin
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin Users Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((user) => (
                  <tr key={user.id} className="hover:bg-purple-50 transition duration-300">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name || user.email}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        user.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'Support' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.active)}
                        className={`px-3 py-1 text-xs rounded-full font-medium transition duration-300 ${
                          user.active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt || user.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteAdmin(user.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm transition duration-300"
                          disabled={user.role === 'Super Admin'}
                        >
                          Delete
                        </button>
                        {user.role !== 'Super Admin' && (
                          <button className="text-purple-600 hover:text-purple-800 font-medium text-sm transition duration-300">
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {filteredAdmins.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-gray-500">No admin users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;