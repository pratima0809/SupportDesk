const express = require('express');
const { getPools, adjustPool } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/pools', protect, authorize('admin'), getPools);
router.post('/pools/adjust', protect, authorize('admin'), adjustPool);

module.exports = router;
