const express = require('express');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, createComment);
router.get('/:ticketId', protect, getComments);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
