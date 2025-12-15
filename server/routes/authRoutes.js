const express = require('express');
const { register, login, getCurrentUser, updateProfile, getStaffCounts } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
// Admin-only: get staff counts by category
router.get('/staff-counts', protect, authorize('admin'), getStaffCounts);

module.exports = router;
