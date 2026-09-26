const { memoryDB, supabase, isConnected } = require('../config/supabase');
const socketService = require('../services/socketService');

exports.getAssignedDeliveries = async (req, res) => {
  try {
    const driverUserId = req.user.id;
    const deliveries = memoryDB.deliveries.filter(d => d.driver_id === driverUserId);

    const enrichedDeliveries = deliveries.map(del => {
      const donation = memoryDB.donations.find(d => d.id === del.donation_id);
      const restaurantUser = memoryDB.users.find(u => u.id === del.restaurant_id);
      const ngoUser = memoryDB.users.find(u => u.id === del.ngo_id);
      const ngoProfile = memoryDB.ngoProfiles.find(n => n.user_id === del.ngo_id);
      const restaurantProfile = memoryDB.restaurantProfiles.find(r => r.user_id === del.restaurant_id);

      return {
        ...del,
        donation,
        restaurantName: restaurantProfile ? restaurantProfile.restaurant_name : (restaurantUser ? restaurantUser.name : 'Bistro'),
        restaurantAddress: restaurantProfile ? restaurantProfile.address : '742 Evergreen Terrace',
        ngoName: ngoProfile ? ngoProfile.organization_name : (ngoUser ? ngoUser.name : 'Shelter'),
        ngoAddress: ngoProfile ? ngoProfile.address : '101 Compassion Way'
      };
    });

    return res.json({
      success: true,
      deliveries: enrichedDeliveries
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch driver deliveries.' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;
    const delivery = memoryDB.deliveries.find(d => d.id === deliveryId);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found.' });
    }

    delivery.status = status;
    delivery.updated_at = new Date().toISOString();

    socketService.broadcastEvent('delivery_status_updated', {
      deliveryId,
      status,
      donationId: delivery.donation_id
    });

    return res.json({
      success: true,
      message: `Delivery status updated to '${status}'.`,
      delivery
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating delivery status.' });
  }
};

exports.verifyOTPAndComplete = async (req, res) => {
  try {
    const { deliveryId, otpCode, proofImageUrl } = req.body;
    const delivery = memoryDB.deliveries.find(d => d.id === deliveryId);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery record not found.' });
    }

    if (delivery.otp_code !== otpCode) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code! Please verify code with NGO staff.' });
    }

    delivery.status = 'delivered';
    delivery.delivered_at = new Date().toISOString();
    delivery.proof_image_url = proofImageUrl || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80';

    // Update donation status to completed
    const donation = memoryDB.donations.find(d => d.id === delivery.donation_id);
    if (donation) {
      donation.status = 'completed';
    }

    // Free up driver
    const driver = memoryDB.driverProfiles.find(d => d.user_id === req.user.id);
    if (driver) {
      driver.is_available = true;
      driver.deliveries_completed = (driver.deliveries_completed || 0) + 1;
    }

    // Update NGO stats
    const ngoProfile = memoryDB.ngoProfiles.find(n => n.user_id === delivery.ngo_id);
    if (ngoProfile && donation) {
      ngoProfile.meals_received = (ngoProfile.meals_received || 0) + (donation.approx_meals || 30);
    }

    // Log Impact
    memoryDB.impactLogs.push({
      id: `imp-${Date.now()}`,
      donation_id: delivery.donation_id,
      meals_served: donation ? donation.approx_meals : 30,
      food_saved_kg: donation ? donation.approx_weight_kg : 12,
      co2_saved_kg: donation ? Math.round(donation.approx_weight_kg * 1.8) : 21,
      created_at: new Date().toISOString()
    });

    // Send completion socket event to all parties
    socketService.broadcastEvent('delivery_completed', {
      message: `🎉 Delivery completed! ${donation ? donation.approx_meals : 30} meals delivered safely.`,
      deliveryId,
      donationId: delivery.donation_id
    });

    return res.json({
      success: true,
      message: 'OTP verified successfully! Delivery marked as COMPLETED.',
      delivery
    });
  } catch (error) {
    console.error('Complete delivery error:', error);
    return res.status(500).json({ success: false, message: 'Error verifying OTP.' });
  }
};
