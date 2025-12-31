const admin = require('firebase-admin');
const getDb = () => admin.firestore();
const REQUESTS_COLLECTION = 'requests';

const Request = {
    create: async (requestData) => {
        try {
            const requestRef = getDb().collection(REQUESTS_COLLECTION).doc();
            await requestRef.set({
                ...requestData,
                status: 'pending',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            const snapshot = await requestRef.get();
            return { id: snapshot.id, ...snapshot.data() };
        } catch (error) {
            console.error('Error creating request:', error);
            throw new Error('Database error');
        }
    },

    findByUserId: async (userId) => {
        try {
            const snapshot = await getDb().collection(REQUESTS_COLLECTION)
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error finding requests:', error);
            throw new Error('Database error');
        }
    },

    findNearbyPending: async (coords) => {
        // NOTE: Geo-query logic is complex. This is a placeholder returning all pending.
        try {
            const snapshot = await getDb().collection(REQUESTS_COLLECTION)
                .where('status', '==', 'pending')
                .orderBy('createdAt', 'asc')
                .limit(20)
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error finding nearby requests:', error);
            throw new Error('Database error');
        }
    },

    update: async (requestId, updateData) => {
        try {
            const requestRef = getDb().collection(REQUESTS_COLLECTION).doc(requestId);
            await requestRef.update({
                ...updateData,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            const snapshot = await requestRef.get();
            return { id: snapshot.id, ...snapshot.data() };
        } catch (error) {
            console.error('Error updating request:', error);
            throw new Error('Database error');
        }
    }
};

module.exports = Request;