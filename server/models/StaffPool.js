const mongoose = require('mongoose');

const staffPoolSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('StaffPool', staffPoolSchema);
