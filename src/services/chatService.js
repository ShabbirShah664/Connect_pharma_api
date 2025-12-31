const { admin } = require('../config/firebase_config');
const getDb = () => admin.firestore();

exports.getOrCreateChatRoom = async (userId, partnerId) => {
    // Create a unique, deterministic Chat ID based on sorted UIDs
    const participants = [userId, partnerId].sort();
    const chatRoomId = participants.join('_');

    const chatRef = getDb().collection('chats').doc(chatRoomId);
    const doc = await chatRef.get();

    if (!doc.exists) {
        await chatRef.set({
            participants: participants,
            lastMessage: 'Chat initiated.',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }

    const partnerDoc = await getDb().collection('pharmacists').doc(partnerId).get();
    const partnerName = partnerDoc.exists ? partnerDoc.data().name : 'Pharmacist';

    return { chatRoomId, partnerName };
};