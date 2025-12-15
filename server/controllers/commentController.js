const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');

// Create a comment
exports.createComment = async (req, res) => {
  try {
    const { ticketId, text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const comment = await Comment.create({
      ticketId,
      userId: req.user.id,
      text,
      isAdminComment: req.user.role === 'admin',
    });

    const populatedComment = await comment.populate('userId', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get comments for a ticket
exports.getComments = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const comments = await Comment.find({ ticketId })
      .populate('userId', 'name email role')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Only comment owner can update
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this comment' });
    }

    comment.text = text;
    await comment.save();

    const updatedComment = await comment.populate('userId', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment: updatedComment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Only comment owner and admin can delete
    if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
