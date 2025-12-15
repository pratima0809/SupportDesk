const express = require('express');
const {
  createTicket,
  getAllTickets,
  getUserTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getDashboardStats,
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/create', protect, createTicket);
router.get('/my-tickets', protect, getUserTickets);
router.get('/:id', protect, getTicketById);
router.put('/:id', protect, updateTicket);
router.delete('/:id', protect, deleteTicket);

// Admin routes
router.get('/', protect, authorize('admin'), getAllTickets);
router.get('/dashboard/stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;
