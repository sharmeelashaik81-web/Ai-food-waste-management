const { memoryDB, supabase, isConnected } = require('../config/supabase');
const geminiService = require('../services/geminiService');
const matchingService = require('../services/matchingService');
const socketService = require('../services/socketService');

exports.createDonation = async (req, res) => {
  try {
    const restaurantId = req.user.id;
    const {
      food_name,
      category = 'Cooked Food',
      veg_type = 'Veg',
      cuisine = 'Lunch',
      prepared_time = new Date().toISOString(),
      expiry_time,
      pickup_time,
      approx_weight_kg = 10,
      approx_meals = 25,
      description = '',
      images = [],
      latitude = 37.7749,
      longitude = -122.4194,
      special_instructions = ''
    } = req.body;

    if (!food_name) {
      return res.status(400).json({ success: false, message: 'Food name is required.' });
    }

    // Run AI analysis
    const aiResult = await geminiService.analyzeFoodFreshness({
      foodName: food_name,
      category,
      vegType: veg_type,
      cuisine,
      preparedTime: prepared_time,
      expiryTime: expiry_time,
      approxWeightKg: approx_weight_kg,
      approxMeals: approx_meals
    });

    // Smart NGO Ranking
    const rankedNGOs = matchingService.rankNGOsForDonation(
      { latitude, longitude, approx_meals: approx_meals || aiResult.estimatedMeals },
      memoryDB.ngoProfiles
    );

    const donationId = `don-${Date.now()}`;
    const calculatedExpiry = expiry_time || new Date(Date.now() + (aiResult.remainingShelfLifeHours * 3600 * 1000)).toISOString();
    const calculatedPickup = pickup_time || new Date(Date.now() + (2 * 3600 * 1000)).toISOString();

    const newDonation = {
      id: donationId,
      restaurant_id: restaurantId,
      food_name,
      category,
      veg_type,
      cuisine,
      prepared_time,
      expiry_time: calculatedExpiry,
      pickup_time: calculatedPickup,
      approx_weight_kg: parseFloat(approx_weight_kg),
      approx_meals: parseInt(approx_meals || aiResult.estimatedMeals),
      description,
      images: images.length ? images : ['https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80'],
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      special_instructions,
      status: 'available',

      // AI Fields
      ai_freshness_score: aiResult.freshnessScore,
      ai_shelf_life_hours: aiResult.remainingShelfLifeHours,
      ai_spoilage_prob: aiResult.spoilageProbability,
      ai_priority_level: aiResult.priorityLevel,
      ai_confidence: aiResult.donationConfidence,
      ai_recommended_pickup: aiResult.recommendedPickupTime,
      ai_ngo_recommendations: rankedNGOs,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryDB.donations.unshift(newDonation);

    // Update restaurant stats
    const restaurantProfile = memoryDB.restaurantProfiles.find(r => r.user_id === restaurantId);
    if (restaurantProfile) {
      restaurantProfile.total_donations_count = (restaurantProfile.total_donations_count || 0) + 1;
      restaurantProfile.meals_donated = (restaurantProfile.meals_donated || 0) + newDonation.approx_meals;
      restaurantProfile.food_saved_kg = (restaurantProfile.food_saved_kg || 0) + newDonation.approx_weight_kg;
      restaurantProfile.co2_saved_kg = Math.round((restaurantProfile.food_saved_kg * 1.8) * 10) / 10;
    }

    if (isConnected && supabase) {
      try {
        await supabase.from('donations').insert([newDonation]);
      } catch (e) {
        console.warn('Supabase donation insert fallback:', e.message);
      }
    }

    // Real-time notification broadcast to NGOs
    socketService.emitToRole('ngo', 'new_nearby_donation', {
      message: ` New Priority Donation: ${food_name} (${newDonation.approx_meals} meals)`,
      donation: newDonation
    });

    return res.status(201).json({
      success: true,
      message: 'Donation published successfully and nearby NGOs notified.',
      donation: newDonation
    });
  } catch (error) {
    console.error('Create donation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to publish donation.' });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const { status, category, veg_type, priority, search } = req.query;

    let list = [...memoryDB.donations];

    if (status) {
      list = list.filter(d => d.status === status);
    }
    if (category) {
      list = list.filter(d => d.category.toLowerCase() === category.toLowerCase());
    }
    if (veg_type) {
      list = list.filter(d => d.veg_type === veg_type);
    }
    if (priority) {
      list = list.filter(d => d.ai_priority_level === priority);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => d.food_name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }

    return res.json({
      success: true,
      count: list.length,
      donations: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch donations.' });
  }
};

exports.getDonationById = async (req, res) => {
  try {
    const donation = memoryDB.donations.find(d => d.id === req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }

    const restaurantUser = memoryDB.users.find(u => u.id === donation.restaurant_id);
    const claim = memoryDB.claims.find(c => c.donation_id === donation.id);
    const delivery = memoryDB.deliveries.find(d => d.donation_id === donation.id);

    return res.json({
      success: true,
      donation,
      restaurant: restaurantUser ? { name: restaurantUser.name, phone: restaurantUser.phone } : null,
      claim,
      delivery
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving donation details.' });
  }
};

exports.getRestaurantDonations = async (req, res) => {
  try {
    const restaurantId = req.user.id;
    const list = memoryDB.donations.filter(d => d.restaurant_id === restaurantId);

    const stats = {
      total: list.length,
      completed: list.filter(d => d.status === 'completed').length,
      pending: list.filter(d => d.status === 'available' || d.status === 'claimed' || d.status === 'assigned').length,
      rejected: list.filter(d => d.status === 'rejected' || d.status === 'expired').length,
      mealsDonated: list.reduce((acc, d) => acc + (d.approx_meals || 0), 0),
      foodSavedKg: Math.round(list.reduce((acc, d) => acc + (d.approx_weight_kg || 0), 0) * 10) / 10,
      co2SavedKg: Math.round(list.reduce((acc, d) => acc + (d.approx_weight_kg || 0) * 1.8, 0) * 10) / 10
    };

    return res.json({
      success: true,
      stats,
      donations: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving restaurant donations.' });
  }
};
