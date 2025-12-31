const admin = require('firebase-admin');

const connectDB = () => {
    try {
        if (admin.apps.length === 0) {
            // Priority 1: Service Account JSON File
            if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
                const serviceAccount = require(require('path').resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                console.log('✅ Firebase Admin SDK Initialized using Service Account File.');
            }
            // Priority 2: Individual Environment Variables
            else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    })
                });
                console.log('✅ Firebase Admin SDK Initialized using Environment Variables.');
            } else {
                throw new Error('Missing Firebase configuration environment variables.');
            }
        }

        return admin.firestore();

    } catch (error) {
        console.error('❌ Firebase Error:', error.message);
        return null;
    }
};

module.exports = { connectDB, admin };