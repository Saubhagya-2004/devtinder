const { Chat } = require('../models/Chat');

exports.getChat = async (req, res) => {
    const { targetuserId } = req.params;
    const userId = req.user._id;
    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetuserId] },
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        });
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetuserId],
                messages: [],
            });
            await chat.save();
        }
        res.json(chat);
    } catch (err) {
        res.status(400).json({ message: "Bad request" });
    }
};
