// connect-pharma-api/models/MedicalRecord.js
const admin = require('firebase-admin');
const db = admin.firestore();
const RECORDS_COLLECTION = 'medical_records';

const MedicalRecord = {
    create: async (recordData) => {
        try {
            const recordRef = db.collection(RECORDS_COLLECTION).doc();
            await recordRef.set({
                ...recordData,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            const snapshot = await recordRef.get();
            return { id: snapshot.id, ...snapshot.data() };
        } catch (error) {
            console.error('Error creating medical record:', error);
            throw new Error('Database error');
        }
    },

    findByUserId: async (userId) => {
        try {
            const snapshot = await db.collection(RECORDS_COLLECTION)
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error finding medical records:', error);
            throw new Error('Database error');
        }
    }
};

module.exports = MedicalRecord;