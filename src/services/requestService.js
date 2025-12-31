const { admin } = require('../config/firebase_config');
const getDb = () => admin.firestore();

exports.createBroadcastRequest = async (userId, data) => {
    const requestData = {
        userId: userId,
        medicineName: data.medicineName,
        userLocation: data.userLocation,
        radius: data.radius || 5, // Default 5km
        status: 'SEARCHING',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        responses: [] // Array to store pharmacist offers
    };

    const newRequestRef = await getDb().collection('requests').add(requestData);

    // Logic to find nearby pharmacists and notify them would go here
    // For now, we rely on pharmacists polling /available or setting up listeners

    return { requestId: newRequestRef.id, status: requestData.status };
};

exports.getRequestStatus = async (requestId) => {
    const doc = await getDb().collection('requests').doc(requestId).get();
    if (!doc.exists) return null;
    return doc.data();
};

exports.expandRadius = async (requestId) => {
    const docRef = getDb().collection('requests').doc(requestId);
    const doc = await docRef.get();

    if (!doc.exists) throw new Error('Request not found');

    const currentRadius = doc.data().radius || 5;
    let newRadius = 5;

    if (currentRadius < 8) newRadius = 8;
    else if (currentRadius < 15) newRadius = 15;
    else newRadius = currentRadius + 10; // Continue?

    await docRef.update({ radius: newRadius });
    return newRadius;
};

exports.respondToRequest = async (requestId, pharmacistId, responseData) => {
    const docRef = getDb().collection('requests').doc(requestId);
    const doc = await docRef.get();

    if (!doc.exists) throw new Error('Request not found');

    const responseEntry = {
        pharmacistId: pharmacistId,
        pharmacyName: responseData.pharmacyName,
        location: responseData.location, // { latitude, longitude }
        status: responseData.status, // 'AVAILABLE' or 'NOT_AVAILABLE'
        suggestedMedicine: responseData.suggestedMedicine || null,
        respondedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // If pharmacist clicks "No", we might not want to show it to the user, 
    // but we can still record it. The controller will handle visibility if needed.
    await docRef.update({
        responses: admin.firestore.FieldValue.arrayUnion(responseEntry)
    });

    return responseEntry;
};

exports.getAllActiveRequests = async () => {
    const snapshot = await getDb().collection('requests')
        .where('status', '==', 'SEARCHING')
        .get();

    return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
        });
};

// ... keep createRequest if needed for backward compat, or remove