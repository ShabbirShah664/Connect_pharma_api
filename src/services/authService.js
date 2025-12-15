// src/services/authService.js

const admin = require('../config/firebase_config');
const jwt = require('jsonwebtoken');

const db = admin.firestore();

// Helper function to generate JWT
const generateToken = (uid, role) => {
    return jwt.sign({ uid, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// --- Registration ---
exports.register = async (role, userData) => {
    try {
        const userCredential = await admin.auth().createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
        });

        const uid = userCredential.uid;
        const collectionName = role.toLowerCase() + 's'; 

        const profileData = {
            uid: uid,
            name: userData.name,
            email: userData.email,
            contactNumber: userData.contactNumber,
            role: role,
            // Pharmacist/Rider would have specific fields here
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection(collectionName).doc(uid).set(profileData);

        const token = generateToken(uid, role);
        return { token, uid, role, message: `${role} registered successfully` };

    } catch (error) {
        throw new Error(error.message || 'Registration failed');
    }
};

// --- Login ---
exports.login = async (role, email, password) => {
    try {
        // Mocked check: assumes client-side Firebase login is successful
        // In production, the client passes an ID Token, which you verify here.
        const collectionName = role.toLowerCase() + 's';
        const snapshot = await db.collection(collectionName).where('email', '==', email).limit(1).get();

        if (snapshot.empty) {
            throw new Error(`No ${role} found with this email.`);
        }

        const userDoc = snapshot.docs[0];
        const uid = userDoc.id;

        // Note: Password validation requires Firebase Client SDK. Here, we rely on the
        // client-side login result (or ID Token) for security.
        
        const token = generateToken(uid, role);
        return { token, uid, role, message: `${role} logged in successfully` };
        
    } catch (error) {
        throw new Error(error.message || 'Login failed. Invalid credentials or role mismatch.');
    }
};