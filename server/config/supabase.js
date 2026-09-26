const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isConnected = false;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    isConnected = true;
    console.log('✅ Connected to Supabase PostgreSQL database');
  } catch (error) {
    console.warn('⚠️ Supabase connection warning, running in local state engine:', error.message);
  }
} else {
  console.log('ℹ️ No Supabase URL provided in .env. Running in local state engine with seed data for hackathon demo mode.');
}

// In-Memory Database Store Fallback Engine
const memoryDB = {
  users: [],
  restaurantProfiles: [],
  ngoProfiles: [],
  driverProfiles: [],
  donations: [],
  claims: [],
  deliveries: [],
  notifications: [],
  impactLogs: [],
  auditLogs: []
};

module.exports = {
  supabase,
  isConnected,
  memoryDB
};
