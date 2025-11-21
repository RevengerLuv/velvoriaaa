// Inventory.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Inventory = () => {
  const { axios, products, fetchProducts } = useAppContext();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState("");

const fetchInventory = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get("/api/admin/inventory");
    if (data.success) {
      setInventory(data.inventory);
    } else {
      // Fallback to products data with proper defaults
      const inventoryData = products.map(product => ({
        id: product._id,
        name: product.name || 'Unknown Product',
        sku: product.sku || `CR-${(product.category || 'uncategorized').toUpperCase().substring(0, 3)}-${product._id.toString().substring(0, 4)}`,
        category: product.category || 'uncategorized',
        currentStock: product.stock || Math.floor(Math.random() * 50),
        lowStockThreshold: 5,
        status: getStockStatus(product.stock || 0),
        lastRestocked: product.updatedAt || new Date().toISOString(),
        cost: product.costPrice || (product.offerPrice || 0) * 0.4,
        price: product.offerPrice || 0,
        image: product.image?.[0]
      }));
      setInventory(inventoryData);
    }
  } catch (error) {
    console.error("Inventory error:", error);
    toast.error("Error loading inventory");
  } finally {
    setLoading(false);
  }
};

  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  const updateStock = async (productId, newStock) => {
    try {
      const { data } = await axios.put(`/api/admin/inventory/${productId}`, { 
        stock: newStock 
      });
      if (data.success) {
        toast.success("Stock updated successfully");
        fetchInventory();
        fetchProducts(); // Refresh products list
      }
    } catch (error) {
      // Fallback: Update local state
      setInventory(prev => prev.map(item => 
        item.id === productId 
          ? { ...item, currentStock: newStock, status: getStockStatus(newStock) }
          : item
      ));
      toast.success("Stock updated locally");
    }
  };

  const handleRestock = async () => {
    if (!selectedProduct || !restockQuantity) return;
    
    const newStock = selectedProduct.currentStock + parseInt(restockQuantity);
    await updateStock(selectedProduct.id, newStock);
    setShowRestockModal(false);
    setSelectedProduct(null);
    setRestockQuantity("");
  };

const filteredInventory = inventory.filter(item => {
  // Check if item exists and has required properties
  if (!item) return false;
  
  const itemName = item.name || '';
  const itemSku = item.sku || '';
  const itemStatus = item.status || '';
  
  const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       itemSku.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesFilter = filter === "all" || itemStatus === filter;
  
  return matchesSearch && matchesFilter;
});
  const inventoryStats = {
    total: inventory.length,
    inStock: inventory.filter(item => item.status === "In Stock").length,
    lowStock: inventory.filter(item => item.status === "Low Stock").length,
    outOfStock: inventory.filter(item => item.status === "Out of Stock").length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)
  };

  useEffect(() => {
    fetchInventory();
  }, [products]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your velvoria product stock levels and inventory</p>
        </div>
        <button 
          onClick={() => {
            setSelectedProduct(null);
            setRestockQuantity("");
            setShowRestockModal(true);
          }}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2"
        >
          <span>📦</span>
          Bulk Restock
        </button>
      </div>

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-gray-800">{inventoryStats.total}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{inventoryStats.inStock}</div>
          <div className="text-sm text-gray-600">In Stock</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStock}</div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</div>
          <div className="text-sm text-gray-600">Out of Stock</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-purple-600">${inventoryStats.totalValue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Inventory Value</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="🔍 Search by product name or SKU..."
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
            <option value="all">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <button
            onClick={fetchInventory}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Inventory Table */}
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">SKU</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Stock Level</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Cost/Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50 transition duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img 
                            src={`http://localhost:5000/images/${item.image}`} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600">🧶</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Last updated: {new Date(item.lastRestocked).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">{item.sku}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{item.currentStock}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.currentStock > 10 ? 'bg-green-500' :
                              item.currentStock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, (item.currentStock / 50) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "In Stock" ? "bg-green-100 text-green-800" :
                        item.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-500 line-through">Cost: ${item.cost?.toFixed(2)}</p>
                        <p className="font-semibold text-gray-900">Price: ${item.price?.toFixed(2)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStock(item.id, item.currentStock + 1)}
                          className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm hover:bg-green-200 transition duration-300"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => updateStock(item.id, item.currentStock + 5)}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200 transition duration-300"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setShowRestockModal(true);
                          }}
                          className="bg-purple-100 text-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-200 transition duration-300"
                        >
                          Custom
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredInventory.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-gray-500">No inventory items found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedProduct ? `Restock ${selectedProduct.name}` : 'Bulk Restock'}
            </h3>
            
            {selectedProduct && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Current Stock: {selectedProduct.currentStock}</p>
                <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  min="1"
                />
              </div>

              {restockQuantity && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    New stock will be: {selectedProduct ? selectedProduct.currentStock + parseInt(restockQuantity) : parseInt(restockQuantity)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRestock}
                disabled={!restockQuantity}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
              >
                Confirm Restock
              </button>
              <button
                onClick={() => {
                  setShowRestockModal(false);
                  setSelectedProduct(null);
                  setRestockQuantity("");
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;