const { calculateDistance } = require('./matchingService');

/**
 * Generates route geometry points between restaurant, driver, and NGO.
 */
function optimizeDeliveryRoute(originLat, originLng, destLat, destLng) {
  const distanceKm = calculateDistance(originLat, originLng, destLat, destLng);
  const baseMinutes = Math.round(distanceKm * 3.5 + 5);
  const trafficFactor = distanceKm > 10 ? 1.25 : 1.1;
  const estimatedEtaMinutes = Math.round(baseMinutes * trafficFactor);

  // Generate intermediate waypoint coordinates for visual map rendering
  const waypoints = [];
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const lat = originLat + (destLat - originLat) * ratio + (Math.sin(ratio * Math.PI) * 0.003);
    const lng = originLng + (destLng - originLng) * ratio + (Math.cos(ratio * Math.PI) * 0.003);
    waypoints.push([lat, lng]);
  }

  return {
    distanceKm,
    estimatedEtaMinutes,
    trafficCondition: distanceKm > 8 ? 'Moderate Traffic' : 'Clear Flow',
    fastestRouteSuggested: true,
    waypoints
  };
}

module.exports = {
  optimizeDeliveryRoute
};
