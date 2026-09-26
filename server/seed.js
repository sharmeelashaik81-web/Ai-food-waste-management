const bcrypt = require('bcryptjs');
const { supabase, isConnected, memoryDB } = require('./config/supabase');

async function seedData() {
  console.log('🌱 Seeding AI Food Waste Management Database...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const sampleUsers = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'restaurant@demo.com',
      password_hash: passwordHash,
      name: 'Green Leaf Bistro',
      role: 'restaurant',
      phone: '+1-555-0192',
      is_verified: true,
      is_blacklisted: false
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'ngo@demo.com',
      password_hash: passwordHash,
      name: 'Hope Haven Food Rescue',
      role: 'ngo',
      phone: '+1-555-0843',
      is_verified: true,
      is_blacklisted: false
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'driver@demo.com',
      password_hash: passwordHash,
      name: 'Alex Rivera (Express Driver)',
      role: 'driver',
      phone: '+1-555-0912',
      is_verified: true,
      is_blacklisted: false
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      email: 'admin@demo.com',
      password_hash: passwordHash,
      name: 'System Admin',
      role: 'admin',
      phone: '+1-555-0000',
      is_verified: true,
      is_blacklisted: false
    }
  ];

  const sampleRestaurantProfiles = [
    {
      id: 'r1111111-1111-1111-1111-111111111111',
      user_id: '11111111-1111-1111-1111-111111111111',
      restaurant_name: 'Green Leaf Bistro',
      license_number: 'REST-88392-CA',
      address: '742 Evergreen Terrace, Downtown',
      latitude: 37.7749,
      longitude: -122.4194,
      total_donations_count: 42,
      meals_donated: 1250,
      co2_saved_kg: 840.5,
      food_saved_kg: 500.0,
      rating: 4.9
    }
  ];

  const sampleNGOProfiles = [
    {
      id: 'n2222222-2222-2222-2222-222222222222',
      user_id: '22222222-2222-2222-2222-222222222222',
      organization_name: 'Hope Haven Food Rescue',
      registration_number: 'NGO-99401-US',
      capacity_meals_per_day: 600,
      address: '101 Compassion Way, Mission District',
      latitude: 37.7649,
      longitude: -122.4294,
      beneficiaries_count: 350,
      meals_received: 2100,
      rating: 4.8
    }
  ];

  const sampleDriverProfiles = [
    {
      id: 'd3333333-3333-3333-3333-333333333333',
      user_id: '33333333-3333-3333-3333-333333333333',
      vehicle_type: 'Refrigerated Van',
      vehicle_number: 'EV-882-SF',
      license_number: 'DL-993021',
      current_latitude: 37.7700,
      current_longitude: -122.4200,
      is_available: true,
      deliveries_completed: 28
    }
  ];

  const sampleDonations = [
    {
      id: 'don-101',
      restaurant_id: '11111111-1111-1111-1111-111111111111',
      food_name: 'Gourmet Vegetable Curry & Basmati Rice',
      category: 'Main Course',
      veg_type: 'Veg',
      cuisine: 'Lunch',
      prepared_time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      expiry_time: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      pickup_time: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
      approx_weight_kg: 18.5,
      approx_meals: 45,
      description: 'Freshly prepared organic vegetable curry with long-grain aromatic rice packed in food-grade insulated containers.',
      images: ['https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80'],
      latitude: 37.7749,
      longitude: -122.4194,
      special_instructions: 'Handle with care. Keep in insulated container until pickup.',
      status: 'available',
      ai_freshness_score: 96,
      ai_shelf_life_hours: 6.5,
      ai_spoilage_prob: 0.04,
      ai_priority_level: 'high',
      ai_confidence: 0.95,
      ai_recommended_pickup: 'Pickup within 90 minutes for peak freshness',
      ai_ngo_recommendations: [
        { ngoId: '22222222-2222-2222-2222-222222222222', organizationName: 'Hope Haven Food Rescue', distanceKm: 1.4, matchScore: 97 }
      ],
      created_at: new Date().toISOString()
    },
    {
      id: 'don-102',
      restaurant_id: '11111111-1111-1111-1111-111111111111',
      food_name: 'Assorted Whole Grain Bakery Items & Pastries',
      category: 'Snacks',
      veg_type: 'Veg',
      cuisine: 'Snacks',
      prepared_time: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      expiry_time: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
      pickup_time: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      approx_weight_kg: 12.0,
      approx_meals: 30,
      description: 'Artisanal sourdough breads, croissants, and muffins sealed in bakery boxes.',
      images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80'],
      latitude: 37.7749,
      longitude: -122.4194,
      special_instructions: 'Stored in dry temperature boxes.',
      status: 'claimed',
      ai_freshness_score: 92,
      ai_shelf_life_hours: 10.0,
      ai_spoilage_prob: 0.08,
      ai_priority_level: 'medium',
      ai_confidence: 0.93,
      ai_recommended_pickup: 'Pickup before 18:00',
      created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
    }
  ];

  const sampleClaims = [
    {
      id: 'claim-201',
      donation_id: 'don-102',
      ngo_id: '22222222-2222-2222-2222-222222222222',
      status: 'approved',
      notes: 'Claimed by Hope Haven for evening meal distribution.',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];

  const sampleDeliveries = [
    {
      id: 'del-301',
      donation_id: 'don-102',
      claim_id: 'claim-201',
      driver_id: '33333333-3333-3333-3333-333333333333',
      restaurant_id: '11111111-1111-1111-1111-111111111111',
      ngo_id: '22222222-2222-2222-2222-222222222222',
      otp_code: '8492',
      status: 'assigned',
      estimated_eta_minutes: 18,
      distance_km: 2.3,
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    }
  ];

  // Store in memoryDB for instant fallback execution
  memoryDB.users = sampleUsers;
  memoryDB.restaurantProfiles = sampleRestaurantProfiles;
  memoryDB.ngoProfiles = sampleNGOProfiles;
  memoryDB.driverProfiles = sampleDriverProfiles;
  memoryDB.donations = sampleDonations;
  memoryDB.claims = sampleClaims;
  memoryDB.deliveries = sampleDeliveries;

  if (isConnected && supabase) {
    try {
      await supabase.from('users').upsert(sampleUsers);
      await supabase.from('restaurant_profiles').upsert(sampleRestaurantProfiles);
      await supabase.from('ngo_profiles').upsert(sampleNGOProfiles);
      await supabase.from('driver_profiles').upsert(sampleDriverProfiles);
      await supabase.from('donations').upsert(sampleDonations);
      console.log('✅ Seeded Supabase tables with initial records!');
    } catch (err) {
      console.warn('⚠️ Supabase seed error (using local memory store):', err.message);
    }
  }

  console.log('🎉 Seed complete! Demo login accounts ready:');
  console.log(' - Restaurant: restaurant@demo.com / password123');
  console.log(' - NGO: ngo@demo.com / password123');
  console.log(' - Driver: driver@demo.com / password123');
  console.log(' - Admin: admin@demo.com / password123');
}

if (require.main === module) {
  seedData();
}

module.exports = seedData;
