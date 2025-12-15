// src/services/locationService.js

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 * @returns {number} Distance in kilometers (km)
 */
exports.getDistanceKm = (p1, p2) => {
    if ((p1.lat === p2.lat) && (p1.lng === p2.lng)) {
        return 0;
    }

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
    const dLon = (p2.lng - p1.lng) * (Math.PI / 180);
    const lat1Rad = p1.lat * (Math.PI / 180);
    const lat2Rad = p2.lat * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
};