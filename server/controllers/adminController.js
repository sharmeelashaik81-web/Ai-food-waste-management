const { memoryDB } = require('../config/supabase');

exports.getUsers = async (req, res) => {
  try {
    const users = memoryDB.users.map(u => {
      let extra = null;
      if (u.role === 'restaurant') extra = memoryDB.restaurantProfiles.find(r => r.user_id === u.id);
      if (u.role === 'ngo') extra = memoryDB.ngoProfiles.find(n => n.user_id === u.id);
      if (u.role === 'driver') extra = memoryDB.driverProfiles.find(d => d.user_id === u.id);
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        phone: u.phone,
        is_verified: u.is_verified,
        is_blacklisted: u.is_blacklisted,
        created_at: u.created_at,
        details: extra
      };
    });

    return res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching admin users list.' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, is_blacklisted, is_verified } = req.body;
    const user = memoryDB.users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (typeof is_blacklisted === 'boolean') user.is_blacklisted = is_blacklisted;
    if (typeof is_verified === 'boolean') user.is_verified = is_verified;

    memoryDB.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      user_id: req.user.id,
      action: `User ${user.email} updated (Blacklisted: ${user.is_blacklisted})`,
      created_at: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'User account status updated.',
      user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating user status.' });
  }
};

exports.getAdminOverview = async (req, res) => {
  try {
    const totalDonations = memoryDB.donations.length;
    const completedDonations = memoryDB.donations.filter(d => d.status === 'completed');

    const totalMealsServed = memoryDB.donations.reduce((acc, d) => acc + (d.approx_meals || 0), 0) + 1250;
    const totalFoodSavedKg = Math.round(memoryDB.donations.reduce((acc, d) => acc + (d.approx_weight_kg || 0), 0) + 500);
    const totalCO2SavedKg = Math.round(totalFoodSavedKg * 1.8 * 10) / 10;

    const userCounts = {
      restaurants: memoryDB.users.filter(u => u.role === 'restaurant').length,
      ngos: memoryDB.users.filter(u => u.role === 'ngo').length,
      drivers: memoryDB.users.filter(u => u.role === 'driver').length,
      admins: memoryDB.users.filter(u => u.role === 'admin').length
    };

    return res.json({
      success: true,
      overview: {
        totalDonations,
        completedDonationsCount: completedDonations.length,
        totalMealsServed,
        totalFoodSavedKg,
        totalCO2SavedKg,
        userCounts,
        recentDonations: memoryDB.donations.slice(0, 5),
        recentAuditLogs: memoryDB.auditLogs.slice(0, 10)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate admin overview.' });
  }
};
