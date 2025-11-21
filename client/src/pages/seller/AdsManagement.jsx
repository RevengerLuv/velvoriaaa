// AdsManagement.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const AdsManagement = () => {
  const { axios } = useAppContext();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    platform: "facebook",
    budget: 100,
    duration: 7,
    target: "conversions"
  });

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/ads");
      if (data.success) {
        setCampaigns(data.campaigns);
      } else {
        setCampaigns(generateMockCampaigns());
      }
    } catch (error) {
      console.error("Ads error:", error);
      toast.error("Error loading campaigns");
      setCampaigns(generateMockCampaigns());
    } finally {
      setLoading(false);
    }
  };

  const generateMockCampaigns = () => [
    {
      _id: "1",
      name: "Winter Collection Launch",
      platform: "facebook",
      status: "active",
      budget: 500,
      spent: 234.50,
      duration: 30,
      startDate: "2024-01-01",
      endDate: "2024-01-30",
      target: "conversions",
      metrics: {
        impressions: 12500,
        clicks: 345,
        conversions: 28,
        ctr: 2.76,
        cpc: 0.68
      }
    },
    {
      _id: "2",
      name: "Instagram Reels Campaign",
      platform: "instagram",
      status: "paused",
      budget: 300,
      spent: 89.25,
      duration: 14,
      startDate: "2024-01-10",
      endDate: "2024-01-24",
      target: "engagement",
      metrics: {
        impressions: 8900,
        clicks: 567,
        conversions: 15,
        ctr: 6.37,
        cpc: 0.16
      }
    },
    {
      _id: "3",
      name: "Google Search Ads",
      platform: "google",
      status: "completed",
      budget: 200,
      spent: 198.75,
      duration: 7,
      startDate: "2024-01-05",
      endDate: "2024-01-12",
      target: "traffic",
      metrics: {
        impressions: 4500,
        clicks: 234,
        conversions: 12,
        ctr: 5.2,
        cpc: 0.85
      }
    }
  ];

  const createCampaign = async () => {
    try {
      const { data } = await axios.post("/api/admin/ads", newCampaign);
      if (data.success) {
        toast.success("Campaign created successfully");
        setShowCreateModal(false);
        setNewCampaign({
          name: "",
          platform: "facebook",
          budget: 100,
          duration: 7,
          target: "conversions"
        });
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Create campaign error:", error);
      toast.error("Error creating campaign");
    }
  };

  const updateCampaignStatus = async (campaignId, status) => {
    try {
      const { data } = await axios.put(`/api/admin/ads/${campaignId}`, { status });
      if (data.success) {
        toast.success(`Campaign ${status}`);
        setCampaigns(prev => prev.map(campaign => 
          campaign._id === campaignId ? { ...campaign, status } : campaign
        ));
      }
    } catch (error) {
      console.error("Update campaign error:", error);
      toast.error("Error updating campaign");
    }
  };

  const stats = {
    active: campaigns.filter(c => c.status === "active").length,
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalConversions: campaigns.reduce((sum, c) => sum + c.metrics.conversions, 0)
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: "📘",
      instagram: "📷",
      google: "🔍",
      pinterest: "📌"
    };
    return icons[platform] || "📢";
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      draft: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ads Management</h1>
          <p className="text-gray-600 mt-1">Create and manage your advertising campaigns</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          🚀 Create Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.active}</div>
          <div className="text-sm text-gray-600">Active Campaigns</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600">${stats.totalBudget}</div>
          <div className="text-sm text-gray-600">Total Budget</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">${stats.totalSpent.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{stats.totalConversions}</div>
          <div className="text-sm text-gray-600">Total Conversions</div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : (
          campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getPlatformIcon(campaign.platform)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{campaign.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{campaign.platform}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">${campaign.budget}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent:</span>
                  <span className="font-medium">${campaign.spent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{campaign.duration} days</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Budget Usage</span>
                  <span>{((campaign.spent / campaign.budget) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-bold text-gray-800">{campaign.metrics.impressions.toLocaleString()}</div>
                  <div className="text-gray-600">Impressions</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-bold text-gray-800">{campaign.metrics.clicks}</div>
                  <div className="text-gray-600">Clicks</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-bold text-gray-800">{campaign.metrics.conversions}</div>
                  <div className="text-gray-600">Conversions</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-bold text-gray-800">{campaign.metrics.ctr}%</div>
                  <div className="text-gray-600">CTR</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                {campaign.status === "active" && (
                  <button
                    onClick={() => updateCampaignStatus(campaign._id, "paused")}
                    className="flex-1 bg-yellow-100 text-yellow-600 py-2 rounded text-sm hover:bg-yellow-200 transition duration-300"
                  >
                    Pause
                  </button>
                )}
                {campaign.status === "paused" && (
                  <button
                    onClick={() => updateCampaignStatus(campaign._id, "active")}
                    className="flex-1 bg-green-100 text-green-600 py-2 rounded text-sm hover:bg-green-200 transition duration-300"
                  >
                    Resume
                  </button>
                )}
                <button className="flex-1 bg-blue-100 text-blue-600 py-2 rounded text-sm hover:bg-blue-200 transition duration-300">
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {campaigns.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📢</span>
          </div>
          <p className="text-gray-500">No advertising campaigns</p>
          <p className="text-sm text-gray-400 mt-1">Create your first campaign to get started</p>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Campaign</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={newCampaign.platform}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="google">Google Ads</option>
                  <option value="pinterest">Pinterest</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: parseFloat(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    value={newCampaign.duration}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Objective
                </label>
                <select
                  value={newCampaign.target}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, target: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="conversions">Conversions</option>
                  <option value="traffic">Website Traffic</option>
                  <option value="engagement">Engagement</option>
                  <option value="awareness">Brand Awareness</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={createCampaign}
                disabled={!newCampaign.name.trim()}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
              >
                Create Campaign
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
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

export default AdsManagement;