// connect-pharma-api/config/firebaseConfig.js

const admin = require('firebase-admin');
const path = require('path');

const connectDB = () => {
    try {
        if (admin.apps.length === 0) {
            const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
            const serviceAccount = require(serviceAccountPath);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase Admin SDK Initialized and Connected to Firestore.');
        }

        // Return the Firestore instance
        return admin.firestore(); 

    } catch (error) {
        console.error('❌ Firebase initialization error:', error.message);
        return null;
    }
};

module.exports = connectDB;