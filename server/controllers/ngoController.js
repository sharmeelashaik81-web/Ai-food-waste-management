const { memoryDB, supabase, isConnected } = require('../config/supabase');
const socketService = require('../services/socketService');
const { optimizeDeliveryRoute } = require('../services/routeService');

exports.claimDonation = async (req, res) => {
  try {
    const ngoUserId = req.user.id;
    const { donationId, notes = '' } = req.body;

    if (!donationId) {
      return res.status(400).json({ success: false, message: 'Donation ID is required.' });
    }

    const donation = memoryDB.donations.find(d => d.id === donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ success: false, message: `Donation is no longer available (Current status: ${donation.status}).` });
    }

    // Update donation status
    donation.status = 'claimed';
    donation.updated_at = new Date().toISOString();

    // Create Claim record
    const claimId = `claim-${Date.now()}`;
    const newClaim = {
      id: claimId,
      donation_id: donationId,
      ngo_id: ngoUserId,
      status: 'approved',
      notes,
      created_at: new Date().toISOString()
    };
    memoryDB.claims.push(newClaim);

    // Auto-assign available driver
    const driver = memoryDB.driverProfiles.find(d => d.is_available) || memoryDB.driverProfiles[0];
    const driverUserId = driver ? driver.user_id : '33333333-3333-3333-3333-333333333333';
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Optimize Route
    const ngoProfile = memoryDB.ngoProfiles.find(n => n.user_id === ngoUserId) || { latitude: 37.7649, longitude: -122.4294 };
    const routeInfo = optimizeDeliveryRoute(
      donation.latitude || 37.7749,
      donation.longitude || -122.4194,
      ngoProfile.latitude,
      ngoProfile.longitude
    );

    // Create Delivery Record
    const deliveryId = `del-${Date.now()}`;
    const newDelivery = {
      id: deliveryId,
      donation_id: donationId,
      claim_id: claimId,
      driver_id: driverUserId,
      restaurant_id: donation.restaurant_id,
      ngo_id: ngoUserId,
      otp_code: otpCode,
      status: 'assigned',
      estimated_eta_minutes: routeInfo.estimatedEtaMinutes,
      distance_km: routeInfo.distanceKm,
      route_geometry: routeInfo.waypoints,
      created_at: new Date().toISOString()
    };
    memoryDB.deliveries.push(newDelivery);

    if (driver) {
      driver.is_available = false;
    }

    // Emit Socket.IO updates
    socketService.emitToUser(donation.restaurant_id, 'donation_claimed', {
      message: `Your donation "${donation.food_name}" was claimed by NGO!`,
      donationId,
      deliveryId
    });

    socketService.emitToUser(driverUserId, 'delivery_assigned', {
      message: `New Delivery Assigned: Pick up ${donation.food_name}`,
      delivery: newDelivery
    });

    return res.json({
      success: true,
      message: 'Donation successfully claimed! Driver assigned for pickup.',
      claim: newClaim,
      delivery: newDelivery,
      otpCode
    });
  } catch (error) {
    console.error('Claim donation error:', error);
    return res.status(500).json({ success: false, message: 'Server error claiming donation.' });
  }
};

exports.getNGOClaims = async (req, res) => {
  try {
    const ngoUserId = req.user.id;
    const claims = memoryDB.claims.filter(c => c.ngo_id === ngoUserId);
    const claimedDonations = claims.map(claim => {
      const donation = memoryDB.donations.find(d => d.id === claim.donation_id);
      const delivery = memoryDB.deliveries.find(d => d.claim_id === claim.id);
      return {
        claim,
        donation,
        delivery
      };
    });

    return res.json({
      success: true,
      claims: claimedDonations
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving NGO claims.' });
  }
};

exports.getNGOStats = async (req, res) => {
  try {
    const ngoUserId = req.user.id;
    const profile = memoryDB.ngoProfiles.find(n => n.user_id === ngoUserId) || {};
    const claims = memoryDB.claims.filter(c => c.ngo_id === ngoUserId);
    
    return res.json({
      success: true,
      stats: {
        totalClaims: claims.length,
        capacityMealsPerDay: profile.capacity_meals_per_day || 500,
        beneficiariesCount: profile.beneficiaries_count || 250,
        mealsReceived: profile.meals_received || 1850,
        rating: profile.rating || 4.8
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving NGO stats.' });
  }
};
