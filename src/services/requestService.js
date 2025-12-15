// src/services/requestService.js

const admin = require('../config/firebase_config');
const db = admin.firestore();

exports.createRequest = async (userId, pharmacyId, data) => {
    const requestData = {
        userId: userId,
        pharmacyId: pharmacyId,
        medicineName: data.medicineName,
        prescriptionUrl: data.prescriptionUrl || null, 
        deliveryType: data.deliveryType, 
        userLocation: data.userLocation,
        status: 'PENDING_PHARMACIST_REVIEW', 
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const newRequestRef = await db.collection('requests').add(requestData);
    const requestId = newRequestRef.id;

    // In production: Send FCM notification to the selected pharmacist (pharmacyId)
    // using Firebase Cloud Messaging (FCM).

    return { requestId, status: requestData.status };
};