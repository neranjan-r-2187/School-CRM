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
  let query = { participants: { $in: [req.user._id] } };
  
  // If admin, they might want to see all (though usually they just see their own)
  // Re-reading user request: "ADMIN: can view all conversations"
  if (req.user.role === ROLES.ADMIN) {
      query = {}; // All conversations
  }

  const conversations = await Conversation.find(query)
  .populate('participants', 'name email role avatar')
  .populate({
    path: 'lastMessage',
    select: 'text createdAt sender'
  })
  .sort({ updatedAt: -1 });

  // Filter out invalid conversations based on new rules (e.g. Student <-> Parent)
  const filteredConversations = conversations.filter(conv => {
    if (req.user.role === ROLES.ADMIN) return true;
    
    const otherParticipant = conv.participants.find(p => p._id.toString() !== req.user._id.toString());
    if (!otherParticipant) return false;

    const senderRole = req.user.role;
    const otherRole = otherParticipant.role;

    // Direct forbidden pairs
    if (senderRole === ROLES.STUDENT && otherRole === ROLES.PARENT) return false;
    if (senderRole === ROLES.PARENT && otherRole === ROLES.STUDENT) return false;
    
    // Role-based allowed lists
    if (senderRole === ROLES.STUDENT) {
        return [ROLES.TEACHER, ROLES.STAFF, ROLES.ADMIN].includes(otherRole);
    }
    if (senderRole === ROLES.PARENT) {
        return [ROLES.TEACHER, ROLES.STAFF, ROLES.ADMIN].includes(otherRole);
    }
    
    return true;
  });

  sendResponse(res, HTTP_STATUS.OK, filteredConversations);
});

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
exports.getMessages = asyncHandler(async (req, res) => {
  const query = { _id: req.params.conversationId };
  if (req.user.role !== ROLES.ADMIN) {
    query.participants = { $in: [req.user._id] };
  }

  const conversation = await Conversation.findOne(query);

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
    if (req.user.role !== ROLES.ADMIN && !conversation.participants.includes(req.user._id)) {
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
    else if (senderRole === ROLES.TEACHER || senderRole === ROLES.STAFF) {
        // Teachers/Staff can message Students, Parents, Admin, and each other
        if ([ROLES.STUDENT, ROLES.PARENT, ROLES.ADMIN, ROLES.TEACHER, ROLES.STAFF].includes(recipientRole)) allowed = true;
    } else if (senderRole === ROLES.STUDENT) {
        if ([ROLES.TEACHER, ROLES.STAFF, ROLES.ADMIN].includes(recipientRole)) allowed = true;
    } else if (senderRole === ROLES.PARENT) {
        if ([ROLES.TEACHER, ROLES.STAFF, ROLES.ADMIN].includes(recipientRole)) allowed = true;
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

    const searchFilter = {
        _id: { $ne: req.user._id },
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
        ]
    };

    // Role-based filtering for search results
    if (req.user.role === ROLES.STUDENT) {
        searchFilter.role = { $in: [ROLES.TEACHER, ROLES.STAFF, ROLES.ADMIN] };
    } else if (req.user.role === ROLES.PARENT) {
        searchFilter.role = { $in: [ROLES.TEACHER, ROLES.STAFF, ROLES.ADMIN] };
    } else if (req.user.role === ROLES.TEACHER || req.user.role === ROLES.STAFF) {
        // Teachers/Staff can see everyone they are allowed to message
        searchFilter.role = { $in: [ROLES.STUDENT, ROLES.PARENT, ROLES.ADMIN, ROLES.TEACHER, ROLES.STAFF] };
    }

    const users = await User.find(searchFilter).select('name email role avatar').limit(10);

    sendResponse(res, HTTP_STATUS.OK, users);
});
