// src/services/authService.js

const { admin } = require('../config/firebase_config');
const jwt = require('jsonwebtoken');

// We use a getter or call admin.firestore() inside functions to ensure 
// it's accessed only after initializeApp has been called.
const getDb = () => admin.firestore();

// Helper function to generate JWT
const generateToken = (uid, role) => {
    return jwt.sign({ uid, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// --- Registration ---
exports.register = async (role, userData) => {
    try {
        // 1. Create user in Firebase Auth using Admin SDK
        const userRecord = await admin.auth().createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
        });

        const uid = userRecord.uid;
        const collectionName = role.toLowerCase() + 's';

        // 2. Store profile in Firestore
        const profileData = {
            uid: uid,
            name: userData.name,
            email: userData.email,
            contactNumber: userData.contactNumber,
            licenseNumber: userData.licenseNumber || '',
            address: userData.address || '',
            role: role,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await getDb().collection(collectionName).doc(uid).set(profileData);

        // 3. Generate internal JWT
        const token = generateToken(uid, role);
        return { token, uid, role, message: role + ' registered successfully' };

    } catch (error) {
        console.error('Registration Error:', error.message);
        throw new Error(error.message || 'Registration failed');
    }
};

// --- Login ---
// Note: Firebase Admin SDK doesn't support verifying passwords directly.
// We use the Firebase Auth REST API for this.
exports.login = async (role, email, password) => {
    try {
        const apiKey = process.env.FIREBASE_API_KEY;
        if (!apiKey) {
            throw new Error('Server Configuration Error: Missing FIREBASE_API_KEY in .env. Please add it to enable login.');
        }

        // Use built-in fetch if available (Node 18+) or a library. 
        // For maximum compatibility in unknown Node environments, we can try native HTTPS or check for fetch.
        // Assuming modern Node, using fetch:
        const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apiKey;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Invalid credentials');
        }

        const uid = data.localId;
        const collectionName = role.toLowerCase() + 's';

        // Verify user exists in Firestore and has correct role
        const userDoc = await getDb().collection(collectionName).doc(uid).get();
        if (!userDoc.exists) {
            throw new Error('Unauthorized: No ' + role + ' profile found for this user.');
        }

        const token = generateToken(uid, role);
        return { token, uid, role, user: userDoc.data(), message: role + ' logged in successfully' };

    } catch (error) {
        console.error('Login Error:', error.message);
        throw new Error(error.message || 'Login failed');
    }
};