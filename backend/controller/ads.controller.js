// controller/ads.controller.js
import AdCampaign from "../models/AdCampaign.model.js";

// Get all ad campaigns
export const getAdsCampaigns = async (req, res) => {
  try {
    const campaigns = await AdCampaign.find().sort({ createdAt: -1 });
    res.json({ success: true, campaigns });
  } catch (error) {
    console.error("Ads campaigns error:", error);
    res.status(500).json({ success: false, message: "Error fetching campaigns" });
  }
};

// Create new ad campaign
export const createAdsCampaign = async (req, res) => {
  try {
    const { name, platform, budget, duration, target } = req.body;

    const campaign = new AdCampaign({
      name,
      platform,
      budget,
      duration,
      target,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      status: 'active',
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0
      }
    });

    await campaign.save();

    res.json({ success: true, campaign, message: "Campaign created successfully" });
  } catch (error) {
    console.error("Create campaign error:", error);
    res.status(500).json({ success: false, message: "Error creating campaign" });
  }
};

// Update ad campaign
export const updateAdsCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const campaign = await AdCampaign.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    res.json({ success: true, campaign, message: "Campaign updated successfully" });
  } catch (error) {
    console.error("Update campaign error:", error);
    res.status(500).json({ success: false, message: "Error updating campaign" });
  }
};

// Simulate ad metrics update (call this periodically)
export const updateAdMetrics = async (campaignId, metrics) => {
  try {
    await AdCampaign.findByIdAndUpdate(campaignId, {
      $inc: {
        'metrics.impressions': metrics.impressions || 0,
        'metrics.clicks': metrics.clicks || 0,
        'metrics.conversions': metrics.conversions || 0,
        spent: metrics.cost || 0
      }
    });

    // Recalculate CTR and CPC
    const campaign = await AdCampaign.findById(campaignId);
    if (campaign) {
      const ctr = campaign.metrics.clicks > 0 ? 
        (campaign.metrics.clicks / campaign.metrics.impressions) * 100 : 0;
      const cpc = campaign.metrics.clicks > 0 ? 
        campaign.spent / campaign.metrics.clicks : 0;

      campaign.metrics.ctr = parseFloat(ctr.toFixed(2));
      campaign.metrics.cpc = parseFloat(cpc.toFixed(2));
      await campaign.save();
    }
  } catch (error) {
    console.error("Update ad metrics error:", error);
  }
};