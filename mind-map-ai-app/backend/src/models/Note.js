const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  fileType: String,
  size: Number,
});

const noteSchema = new mongoose.Schema({
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },

  aiSummary: {
  heading: { type: String },
  body: { type: String },
  importantPoints: { type: [String], default: [] },
  examples: { type: [String], default: [] },
  originalContent: { type: String },
  lastGeneratedAt: { type: Date }
},

  files: [fileSchema],
  lastModified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', noteSchema);


