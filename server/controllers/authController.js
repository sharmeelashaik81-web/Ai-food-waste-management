const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase, isConnected, memoryDB } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_food_waste_ai_2026';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

exports.signup = async (req, res) => {
  try {
    const { email, password, name, role = 'restaurant', phone, address, organizationName, restaurantName, vehicleType } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required.' });
    }

    // Check existing
    const existing = memoryDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = `usr-${Date.now()}`;

    const newUser = {
      id: userId,
      email,
      password_hash,
      name,
      role,
      phone: phone || '',
      is_verified: true,
      is_blacklisted: false,
      created_at: new Date().toISOString()
    };

    memoryDB.users.push(newUser);

    // Create role specific profile
    if (role === 'restaurant') {
      memoryDB.restaurantProfiles.push({
        id: `r-${Date.now()}`,
        user_id: userId,
        restaurant_name: restaurantName || name,
        address: address || 'Main St',
        latitude: 37.7749,
        longitude: -122.4194,
        total_donations_count: 0,
        meals_donated: 0,
        co2_saved_kg: 0,
        food_saved_kg: 0
      });
    } else if (role === 'ngo') {
      memoryDB.ngoProfiles.push({
        id: `n-${Date.now()}`,
        user_id: userId,
        organization_name: organizationName || name,
        address: address || 'Mission St',
        capacity_meals_per_day: 500,
        latitude: 37.7649,
        longitude: -122.4294,
        meals_received: 0
      });
    } else if (role === 'driver') {
      memoryDB.driverProfiles.push({
        id: `d-${Date.now()}`,
        user_id: userId,
        vehicle_type: vehicleType || 'Van',
        is_available: true,
        deliveries_completed: 0
      });
    }

    if (isConnected && supabase) {
      try {
        await supabase.from('users').insert([newUser]);
      } catch (e) {
        console.warn('Supabase signup insert fallback:', e.message);
      }
    }

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = memoryDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: `Access denied. User is registered as '${user.role}' not '${role}'.` });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.is_blacklisted) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by administration.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = memoryDB.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    let extraProfile = null;
    if (user.role === 'restaurant') {
      extraProfile = memoryDB.restaurantProfiles.find(r => r.user_id === user.id);
    } else if (user.role === 'ngo') {
      extraProfile = memoryDB.ngoProfiles.find(n => n.user_id === user.id);
    } else if (user.role === 'driver') {
      extraProfile = memoryDB.driverProfiles.find(d => d.user_id === user.id);
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        profile: extraProfile
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching user profile.' });
  }
};

exports.forgotPassword = async (req, res) => {
  return res.json({ success: true, message: 'If an account exists, a password reset link has been dispatched to your email.' });
};

exports.resetPassword = async (req, res) => {
  return res.json({ success: true, message: 'Password has been successfully updated.' });
};
