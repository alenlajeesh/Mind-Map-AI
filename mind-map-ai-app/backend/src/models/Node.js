const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  title: String,
  snippet: String,
  relatedNodeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Node' }]
});

module.exports = mongoose.model('Node', nodeSchema);

