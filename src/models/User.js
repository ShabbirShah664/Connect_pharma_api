const admin = require('firebase-admin');
const getDb = () => admin.firestore();
const USERS_COLLECTION = 'users';

const User = {
    findById: async (userId) => {
        try {
            const doc = await getDb().collection(USERS_COLLECTION).doc(userId).get();
            if (!doc.exists) return null;
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error("Error finding user by ID:", error);
            throw new Error('Database error');
        }
    },

    findByEmail: async (email) => {
        try {
            const snapshot = await getDb().collection(USERS_COLLECTION)
                .where('email', '==', email)
                .limit(1)
                .get();

            if (snapshot.empty) return null;

            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw new Error('Database error');
        }
    },

    create: async (userData) => {
        try {
            const userRef = getDb().collection(USERS_COLLECTION).doc();
            await userRef.set({
                ...userData,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            const snapshot = await userRef.get();
            return { id: snapshot.id, ...snapshot.data() };
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error('Database error');
        }
    }
};

module.exports = User;