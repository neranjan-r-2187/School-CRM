const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');

// @desc    Get all tickets for current user
// @route   GET /api/tickets
// @access  Private
exports.getMyTickets = asyncHandler(async (req, res) => {
  let query = {};
  
  // If not admin, only show own tickets
  if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
    query.createdBy = req.user.id;
  }

  const tickets = await Ticket.find(query)
    .populate('createdBy', 'name role')
    .populate('assignedTo', 'name')
    .sort('-createdAt');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: tickets
  });
});

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = asyncHandler(async (req, res) => {
  const { title, description, category, priority } = req.body;

  // Generate ticket number
  const count = await Ticket.countDocuments();
  const ticketNumber = `TKT-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

  const ticket = await Ticket.create({
    ticketNumber,
    title,
    description,
    category,
    priority,
    createdBy: req.user.id,
    messages: [{
      senderId: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message: description
    }]
  });

  // Notify Admins about new ticket
  const admins = await User.find({ role: { $in: ['Admin', 'SuperAdmin'] } });
  const adminNotifications = admins.map(admin => ({
    userId: admin._id,
    type: 'ticket',
    title: 'New Support Ticket',
    message: `${req.user.name} created a new ticket: ${title}`,
    actionUrl: '/admin/dashboard/tickets',
    relatedId: ticket._id
  }));
  await Notification.insertMany(adminNotifications);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: ticket
  });
});

// @desc    Add message to ticket
// @route   POST /api/tickets/:id/messages
// @access  Private
exports.addMessage = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  const { message } = req.body;

  ticket.messages.push({
    senderId: req.user.id,
    senderName: req.user.name,
    senderRole: req.user.role,
    message
  });

  ticket.updatedAt = Date.now();
  await ticket.save();

  // Notify other party about message
  const recipientId = req.user.id === ticket.createdBy.toString() 
    ? ticket.assignedTo || null 
    : ticket.createdBy;

  if (recipientId) {
    await Notification.create({
      userId: recipientId,
      type: 'ticket',
      title: 'New Ticket Message',
      message: `${req.user.name} replied to ticket ${ticket.ticketNumber}`,
      actionUrl: req.user.role === 'Admin' ? '/student/dashboard/support' : '/admin/dashboard/tickets',
      relatedId: ticket._id
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: ticket
  });
});

// @desc    Update ticket status/priority
// @route   PUT /api/tickets/:id
// @access  Private (Admin only)
exports.updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!ticket) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  // Notify user about update
  let notifTitle = 'Ticket Updated';
  let notifMessage = `Your ticket ${ticket.ticketNumber} has been updated.`;
  
  if (req.body.status) {
    notifTitle = 'Ticket Status Updated';
    notifMessage = `Your ticket ${ticket.ticketNumber} status is now: ${req.body.status}`;
  } else if (req.body.assignedTo) {
    notifTitle = 'Ticket Assigned';
    notifMessage = `Your ticket ${ticket.ticketNumber} has been assigned to a staff member.`;
  }

  await Notification.create({
    userId: ticket.createdBy,
    type: 'ticket',
    title: notifTitle,
    message: notifMessage,
    actionUrl: '/student/dashboard/support',
    relatedId: ticket._id
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: ticket
  });
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin only)
exports.deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Ticket not found'
    });
  }

  await ticket.deleteOne();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {}
  });
});
