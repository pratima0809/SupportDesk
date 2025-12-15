const StaffPool = require('../models/StaffPool');

// Get all staff pools (counts by category)
exports.getPools = async (req, res) => {
  try {
    // Ensure default categories exist (seed on-demand)
    const defaultCategories = ['Technical', 'Network', 'Account', 'Academic', 'Other'];

    let pools = await StaffPool.find({}).lean();

    // If no pools or some categories missing, create them with default count 10
    const existingCategories = pools.map((p) => p.category);
    const toCreate = defaultCategories.filter((c) => !existingCategories.includes(c));
    if (toCreate.length > 0) {
      const creations = toCreate.map((c) => ({ category: c, count: 10 }));
      await StaffPool.insertMany(creations);
      pools = await StaffPool.find({}).lean();
    }

    const map = {};
    pools.forEach((p) => (map[p.category] = p.count));
    res.status(200).json({ success: true, pools: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Adjust pool count for a category (delta can be negative to deduct)
exports.adjustPool = async (req, res) => {
  try {
    const { category, delta } = req.body;
    if (!category || typeof delta !== 'number') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const pool = await StaffPool.findOne({ category });
    if (!pool) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (delta < 0 && pool.count + delta < 0) {
      return res.status(400).json({ success: false, message: 'Not enough staff available' });
    }

    pool.count = pool.count + delta;
    await pool.save();

    res.status(200).json({ success: true, category: pool.category, count: pool.count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
