const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date },
  endTime: { type: Date},
  status: { type: String, default: 'pending' } // pending, completed, etc.
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

