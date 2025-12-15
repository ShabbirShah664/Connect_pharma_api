// src/services/profileService.js

const admin = require('../config/firebase_config');
const db = admin.firestore();

exports.getProfile = async (uid, role) => {
    const collectionName = role.toLowerCase() + 's';
    const doc = await db.collection(collectionName).doc(uid).get();

    if (!doc.exists) {
        throw new Error('Profile not found.');
    }

    const profile = doc.data();
    delete profile.createdAt; 

    return profile;
};

exports.updateProfile = async (uid, role, updates) => {
    const collectionName = role.toLowerCase() + 's';
    const docRef = db.collection(collectionName).doc(uid);

    delete updates.uid;
    delete updates.role;
    delete updates.email; 

    if (Object.keys(updates).length === 0) {
        throw new Error('No valid fields provided for update.');
    }
    
    await docRef.update(updates);
    
    const updatedDoc = await docRef.get();
    const updatedProfile = updatedDoc.data();
    delete updatedProfile.createdAt;

    return updatedProfile;
};