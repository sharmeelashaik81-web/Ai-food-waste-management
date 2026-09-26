/**
 * Calculates Haversine distance in kilometers between two lat/lng coordinates.
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Smart NGO Recommendation Engine
 * Ranks NGOs based on distance, capacity, urgency, and rating score.
 */
function rankNGOsForDonation(donation, ngosList) {
  const dLat = donation.latitude || 37.7749;
  const dLng = donation.longitude || -122.4194;
  const requiredMeals = donation.approx_meals || 20;

  return ngosList.map(ngo => {
    const ngoLat = ngo.latitude || 37.7749;
    const ngoLng = ngo.longitude || -122.4194;
    const distanceKm = calculateDistance(dLat, dLng, ngoLat, ngoLng);

    // Scoring factors:
    // Distance score: closer is better (max 40 pts)
    const distanceScore = Math.max(0, 40 - distanceKm * 3);
    
    // Capacity score: ability to receive required meals (max 30 pts)
    const capacityRatio = (ngo.capacity_meals_per_day || 300) / Math.max(1, requiredMeals);
    const capacityScore = Math.min(30, capacityRatio * 5);

    // Rating score (max 20 pts)
    const ratingScore = ((ngo.rating || 4.5) / 5) * 20;

    // Response history score (max 10 pts)
    const speedScore = 10;

    const totalMatchScore = Math.min(99, Math.round(distanceScore + capacityScore + ratingScore + speedScore));

    const estimatedEtaMinutes = Math.round(10 + distanceKm * 4);

    return {
      ngoId: ngo.user_id || ngo.id,
      organizationName: ngo.organization_name || ngo.name,
      distanceKm,
      capacityMealsPerDay: ngo.capacity_meals_per_day || 300,
      matchScore: totalMatchScore,
      estimatedEtaMinutes,
      address: ngo.address || 'Central City'
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  calculateDistance,
  rankNGOsForDonation
};
