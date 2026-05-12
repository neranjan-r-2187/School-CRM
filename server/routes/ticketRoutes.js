const express = require('express');
const router = express.Router();
const { getMyTickets, createTicket, addMessage, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getMyTickets)
  .post(createTicket);

router.route('/:id')
  .put(updateTicket)
  .delete(deleteTicket);

router.route('/:id/messages')
  .post(addMessage);

module.exports = router;
