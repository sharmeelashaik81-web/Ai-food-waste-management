-- AI Food Waste Management System - Supabase PostgreSQL Database Schema

-- Enums
CREATE TYPE user_role AS ENUM ('restaurant', 'ngo', 'driver', 'admin');
CREATE TYPE veg_type AS ENUM ('Veg', 'Non Veg', 'Mixed');
CREATE TYPE cuisine_type AS ENUM ('Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Dessert');
CREATE TYPE donation_status AS ENUM ('available', 'claimed', 'assigned', 'picked_up', 'completed', 'rejected', 'expired');
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE delivery_status AS ENUM ('assigned', 'en_route_pickup', 'arrived_pickup', 'en_route_delivery', 'delivered', 'failed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT true,
  is_blacklisted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Restaurant Profiles
CREATE TABLE IF NOT EXISTS restaurant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  restaurant_name TEXT NOT NULL,
  license_number TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION DEFAULT 37.7749,
  longitude DOUBLE PRECISION DEFAULT -122.4194,
  total_donations_count INT DEFAULT 0,
  meals_donated INT DEFAULT 0,
  co2_saved_kg DOUBLE PRECISION DEFAULT 0.0,
  food_saved_kg DOUBLE PRECISION DEFAULT 0.0,
  rating DOUBLE PRECISION DEFAULT 4.9,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NGO Profiles
CREATE TABLE IF NOT EXISTS ngo_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  organization_name TEXT NOT NULL,
  registration_number TEXT,
  capacity_meals_per_day INT DEFAULT 500,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION DEFAULT 37.7749,
  longitude DOUBLE PRECISION DEFAULT -122.4194,
  beneficiaries_count INT DEFAULT 200,
  meals_received INT DEFAULT 0,
  rating DOUBLE PRECISION DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Driver Profiles
CREATE TABLE IF NOT EXISTS driver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  vehicle_type TEXT DEFAULT 'Van',
  vehicle_number TEXT,
  license_number TEXT,
  current_latitude DOUBLE PRECISION DEFAULT 37.7749,
  current_longitude DOUBLE PRECISION DEFAULT -122.4194,
  is_available BOOLEAN DEFAULT true,
  deliveries_completed INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  category TEXT DEFAULT 'Cooked Food',
  veg_type veg_type DEFAULT 'Veg',
  cuisine cuisine_type DEFAULT 'Lunch',
  prepared_time TIMESTAMPTZ DEFAULT NOW(),
  expiry_time TIMESTAMPTZ NOT NULL,
  pickup_time TIMESTAMPTZ NOT NULL,
  approx_weight_kg DOUBLE PRECISION NOT NULL,
  approx_meals INT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  special_instructions TEXT,
  status donation_status DEFAULT 'available',
  
  -- AI Prediction Fields
  ai_freshness_score INT DEFAULT 95,
  ai_shelf_life_hours DOUBLE PRECISION DEFAULT 8.0,
  ai_spoilage_prob DOUBLE PRECISION DEFAULT 0.05,
  ai_priority_level priority_level DEFAULT 'medium',
  ai_confidence DOUBLE PRECISION DEFAULT 0.92,
  ai_recommended_pickup TEXT,
  ai_ngo_recommendations JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Claims Table
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
  ngo_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status claim_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  restaurant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ngo_id UUID REFERENCES users(id) ON DELETE CASCADE,
  otp_code TEXT NOT NULL,
  status delivery_status DEFAULT 'assigned',
  proof_image_url TEXT,
  pickup_verified_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  estimated_eta_minutes INT DEFAULT 25,
  distance_km DOUBLE PRECISION DEFAULT 4.2,
  route_geometry JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Impact Logs Table
CREATE TABLE IF NOT EXISTS impact_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
  meals_served INT NOT NULL,
  food_saved_kg DOUBLE PRECISION NOT NULL,
  co2_saved_kg DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_restaurant ON donations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_claims_ngo ON claims(ngo_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_driver ON deliveries(driver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
