// src/controllers/chatController.js

const chatService = require('../services/chatService');

exports.initiateChat = async (req, res) => {
    const userId = req.user.uid;
    const { partnerId } = req.body; // This is the ID of the selected pharmacist

    if (!partnerId) {
        return res.status(400).json({ error: 'Missing partner ID to initiate chat.' });
    }

    try {
        const chatInfo = await chatService.getOrCreateChatRoom(userId, partnerId);

        res.status(200).json({
            message: 'Chat room with ' + chatInfo.partnerName + ' ready.',
            chatRoomId: chatInfo.chatRoomId,
            partnerName: chatInfo.partnerName
        });
    } catch (error) {
        console.error('Chat initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate chat.' });
    }
};