import { Conversation, Message } from "../models/Message.js";
import Notification from "../models/Notification.js";

// GET MY CONVERSATIONS
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.userInfo.id] },
    })
      .sort({ lastMessageAt: -1 })
      .populate("participants", "name profilePic username");

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// CREATE OR GET CONVERSATION
export const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.userInfo.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("participants", "name profilePic username");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
      conversation = await conversation.populate("participants", "name profilePic username");
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// GET MESSAGES IN A CONVERSATION
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name profilePic username");

    // Mark messages as read
    await Message.updateMany(
      { conversationId: req.params.conversationId, senderId: { $ne: req.userInfo.id }, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json("Conversation not found!");

    const newMessage = await Message.create({
      conversationId,
      senderId: req.userInfo.id,
      text,
    });

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });

    const populatedMessage = await newMessage.populate("senderId", "name profilePic username");

    // Notify the other participant
    const receiverId = conversation.participants.find(
      (p) => p.toString() !== req.userInfo.id
    );
    if (receiverId) {
      await Notification.create({
        userId: receiverId,
        senderId: req.userInfo.id,
        type: "message",
      });
    }

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
