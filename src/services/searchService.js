const { admin } = require('../config/firebase_config');
const locationService = require('./locationService');
const getDb = () => admin.firestore();

const SEARCH_RADII = [2, 5, 10];

const findPharmaciesByRadius = async (userLocation, medicineName, currentRadius) => {
    // In a real application, you would use GeoFirestore for efficient radius querying.
    const pharmacistSnapshot = await getDb().collection('pharmacists').get();

    const availablePharmacies = [];

    pharmacistSnapshot.forEach(doc => {
        const pharmacist = doc.data();

        // Mock Pharmacist Location (Replace with real coordinates from Firestore/RTDB)
        const pharmacyLocation = pharmacist.location || { lat: 31.5204 + (Math.random() - 0.5) * 0.05, lng: 74.3587 + (Math.random() - 0.5) * 0.05 };

        const distance = locationService.getDistanceKm(userLocation, pharmacyLocation);

        if (distance <= currentRadius) {
            // Mock: Check if the pharmacist has stock (replace with inventory check)
            const hasStock = distance < 6;

            if (hasStock) {
                availablePharmacies.push({
                    id: doc.id,
                    name: pharmacist.name,
                    distance: distance.toFixed(1),
                    stock: 'Available',
                    isLimited: distance > 4.5,
                });
            }
        }
    });

    return availablePharmacies;
};


exports.searchMedicine = async (userLocation, medicineName) => {
    const allResults = [];
    let found = false;
    let finalSearchRadius = 0;

    for (const radius of SEARCH_RADII) {
        finalSearchRadius = radius;

        const results = await findPharmaciesByRadius(userLocation, medicineName, radius);

        // Only add unique, new results
        const newResults = results.filter(r => !allResults.some(ar => ar.id === r.id));
        allResults.push(...newResults);

        if (allResults.length > 0) {
            found = true;
            break;
        }

        // Simulate a small delay before expanding radius
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!found) {
        return {
            found: false,
            message: 'No pharmacies responded within ' + finalSearchRadius + ' km.',
            action: 'Ask for Suggestions'
        };
    }

    return {
        found: true,
        results: allResults
    };
};