const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { HTTP_STATUS, ROLES } = require('../constants');

// @desc    Get all conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: { $in: [req.user._id] }
  })
  .populate('participants', 'name email role avatar')
  .populate({
    path: 'lastMessage',
    select: 'text createdAt sender'
  })
  .sort({ updatedAt: -1 });

  sendResponse(res, HTTP_STATUS.OK, conversations);
});

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
exports.getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.conversationId,
    participants: { $in: [req.user._id] }
  });

  if (!conversation) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Conversation not found or access denied');
  }

  const messages = await Message.find({ conversation: req.params.conversationId })
    .populate('sender', 'name avatar role')
    .sort({ createdAt: 1 });

  // Mark messages as read
  await Message.updateMany(
    { 
      conversation: req.params.conversationId, 
      sender: { $ne: req.user._id },
      isRead: false 
    },
    { $set: { isRead: true } }
  );

  sendResponse(res, HTTP_STATUS.OK, messages);
});

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
exports.sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, text, conversationId } = req.body;

  let conversation;

  if (conversationId) {
    conversation = await Conversation.findById(conversationId);
    if (!conversation.participants.includes(req.user._id)) {
        res.status(HTTP_STATUS.FORBIDDEN);
        throw new Error('Not authorized to send message in this conversation');
    }
  } else if (recipientId) {
    // Check role-based messaging rules
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(HTTP_STATUS.NOT_FOUND);
      throw new Error('Recipient not found');
    }

    // Role rules:
    // Admin <-> Anyone
    // Teacher <-> Student/Parent/Admin
    // Student <-> Teacher/Admin (NOT Student <-> Student unless Admin)
    // Parent <-> Teacher/Admin

    const senderRole = req.user.role;
    const recipientRole = recipient.role;

    let allowed = false;

    if (senderRole === ROLES.ADMIN) allowed = true;
    else if (senderRole === ROLES.TEACHER) allowed = true; // Teachers can message anyone
    else if (senderRole === ROLES.STUDENT) {
        if (recipientRole === ROLES.TEACHER || recipientRole === ROLES.ADMIN) allowed = true;
    } else if (senderRole === ROLES.PARENT) {
        if (recipientRole === ROLES.TEACHER || recipientRole === ROLES.ADMIN) allowed = true;
    }

    if (!allowed) {
        res.status(HTTP_STATUS.FORBIDDEN);
        throw new Error(`Users with role ${senderRole} cannot message users with role ${recipientRole}`);
    }

    // Find or create conversation
    conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
      $expr: { $eq: [{ $size: "$participants" }, 2] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId]
      });
    }
  }

  if (!conversation) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide conversationId or recipientId');
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text
  });

  // Update last message and updatedAt in conversation
  conversation.lastMessage = message._id;
  await conversation.save();

  const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar role');

  sendResponse(res, HTTP_STATUS.CREATED, populatedMessage, 'Message sent');
});

// @desc    Search users for new chat
// @route   GET /api/chat/search-users
// @access  Private
exports.searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query || query.length < 2) {
        return sendResponse(res, HTTP_STATUS.OK, []);
    }

    const users = await User.find({
        _id: { $ne: req.user._id },
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
        ]
    }).select('name email role avatar').limit(10);

    sendResponse(res, HTTP_STATUS.OK, users);
});
