const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category: category || 'Other',
      priority: priority || 'Medium',
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all tickets (with filters)
exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority, category, assignedTo } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tickets = await Ticket.find(filter)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's tickets
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    const { status, priority, assignedTo, resolution } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check authorization (user can only update their own ticket's status, admin can update any)
    if (req.user.role === 'user' && ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this ticket' });
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (resolution) ticket.resolution = resolution;

    await ticket.save();

    const updatedTicket = await ticket.populate('userId assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Only admin and ticket owner can delete
    if (req.user.role === 'user' && ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this ticket' });
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard statistics (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });

    const ticketsByCategory = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const ticketsByPriority = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        ticketsByCategory,
        ticketsByPriority,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
