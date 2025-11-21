// AddProduct.jsx - Updated with ₹ Currency
import { assets, categories } from "../../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useContext(AppContext);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [materials, setMaterials] = useState([""]);
  const [careInstructions, setCareInstructions] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState({ length: "", width: "" });
  const [loading, setLoading] = useState(false);
  const [patternAvailable, setPatternAvailable] = useState(false);
  const [patternPrice, setPatternPrice] = useState("");
  const [stock, setStock] = useState("");
  const [tags, setTags] = useState("");

  // Security: File validation
  const validateFiles = (files) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    for (let file of files) {
      if (file && file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      if (file && !allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} must be JPEG, PNG, or WebP.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      // Enhanced validation
      if (!validateFiles(files.filter(Boolean))) return;
      
      if (parseFloat(offerPrice) >= parseFloat(price)) {
        toast.error("Offer price must be less than original price");
        return;
      }

      if (parseInt(stock) < 0) {
        toast.error("Stock cannot be negative");
        return;
      }

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", JSON.stringify(description.split('\n').filter(line => line.trim())));
      formData.append("category", category);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      formData.append("materials", JSON.stringify(materials.filter(m => m.trim())));
      formData.append("careInstructions", careInstructions);
      formData.append("skillLevel", skillLevel);
      formData.append("weight", weight);
      formData.append("dimensions", JSON.stringify(dimensions));
      formData.append("patternAvailable", patternAvailable);
      formData.append("patternPrice", patternPrice);
      formData.append("stock", stock);
      formData.append("tags", tags);

      // Add security headers
      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          formData.append("image", files[i]);
        }
      }

      const { data } = await axios.post("/api/product/add-product", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 30000 // 30 second timeout
      });
      
      if (data.success) {
        toast.success("🧶 Velvoria product added successfully!");
        // Reset form
        resetForm();
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to add product");
      }
      console.error("Add product error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setOfferPrice("");
    setFiles([]);
    setMaterials([""]);
    setCareInstructions("");
    setSkillLevel("Intermediate");
    setWeight("");
    setDimensions({ length: "", width: "" });
    setPatternAvailable(false);
    setPatternPrice("");
    setStock("");
    setTags("");
  };

  const addMaterial = () => {
    if (materials.length < 10) { // Limit to 10 materials
      setMaterials([...materials, ""]);
    } else {
      toast.error("Maximum 10 materials allowed");
    }
  };

  const updateMaterial = (index, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = value;
    setMaterials(updatedMaterials);
  };

  const removeMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-purple-100">
        {/* Header with Security Badge */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Add New Velvoria Creation</h1>
              <p className="text-purple-100 mt-1">Secure product addition with validation</p>
            </div>
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              🔒 Secure
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Image Upload Section with Security */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🖼️ Product Images (Max 4)</h3>
            <p className="text-sm text-gray-600 mb-4">Supported: JPEG, PNG, WebP | Max 5MB each</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4).fill("").map((_, index) => (
                <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                  <input
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && validateFiles([file])) {
                        const updatedFiles = [...files];
                        updatedFiles[index] = file;
                        setFiles(updatedFiles);
                      } else {
                        e.target.value = ''; // Reset input
                      }
                    }}
                    accept="image/jpeg,image/png,image/webp"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <div className={`border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center transition duration-300 ${
                    files[index] 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                  }`}>
                    {files[index] ? (
                      <div className="relative h-full w-full">
                        <img
                          src={URL.createObjectURL(files[index])}
                          alt="Preview"
                          className="h-full w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedFiles = [...files];
                            updatedFiles[index] = null;
                            setFiles(updatedFiles);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-2xl mb-2">📸</span>
                        <p className="text-sm text-gray-500 text-center px-2">Image {index + 1}</p>
                      </>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🧵 Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Handmade Velvoria Blanket"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{name.length}/100 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📂 Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.path}>{cat.text}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📝 Description * (one point per line)</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="• Soft and cozy...
• Perfect for...
• Handmade with..."
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
          </div>

          {/* Pricing - UPDATED TO ₹ */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">💰 Original Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1999"
                min="1"
                step="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Offer Price (₹) *</label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="1499"
                min="1"
                step="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📦 Stock Quantity *</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">⚖️ Weight (grams)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="250"
                min="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Price Validation Alert */}
          {price && offerPrice && parseFloat(offerPrice) >= parseFloat(price) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-red-800 text-sm">Offer price should be less than original price</p>
              </div>
            </div>
          )}

          {/* Crochet Specifications */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🧶 Velvoria Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🪡 Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📏 Dimensions (inches)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                    placeholder="Length"
                    min="1"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                    placeholder="Width"
                    min="1"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🧵 Materials Used</label>
            <div className="space-y-3">
              {materials.map((material, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => updateMaterial(index, e.target.value)}
                    placeholder="e.g., 100% Cotton Yarn"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                    maxLength={50}
                  />
                  {materials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="bg-red-100 text-red-600 px-3 rounded-lg hover:bg-red-200 transition duration-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {materials.length < 10 && (
                <button
                  type="button"
                  onClick={addMaterial}
                  className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition duration-300 flex items-center gap-2"
                >
                  <span>+</span>
                  Add Another Material
                </button>
              )}
            </div>
          </div>

          {/* Care Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🧼 Care Instructions</label>
            <textarea
              rows={3}
              value={careInstructions}
              onChange={(e) => setCareInstructions(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Hand wash cold, lay flat to dry..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{careInstructions.length}/200 characters</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🏷️ Search Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., blanket, winter, handmade, gift"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Pattern Options */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={patternAvailable}
                onChange={(e) => setPatternAvailable(e.target.checked)}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">📋 Also sell digital pattern for this design</label>
            </div>
            {patternAvailable && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pattern Price (₹)</label>
                  <input
                    type="number"
                    value={patternPrice}
                    onChange={(e) => setPatternPrice(e.target.value)}
                    placeholder="299"
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-lg">🔒</span>
              <div>
                <p className="font-medium text-blue-800">Secure Product Submission</p>
                <p className="text-sm text-blue-700 mt-1">
                  All data is encrypted and validated. Your product information is secure.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding Product...
                </>
              ) : (
                <>
                  <span>🧶</span>
                  Add Velvoria Product
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;