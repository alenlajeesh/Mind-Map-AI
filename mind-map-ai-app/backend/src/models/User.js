const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  token: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  sessions: [sessionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

