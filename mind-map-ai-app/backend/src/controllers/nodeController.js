const Node = require('../models/Node');
const Note = require('../models/Note');

exports.createNodes = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOne({ _id: noteId, userId: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (!note.aiSummary || !note.aiSummary.text)
      return res.status(400).json({ message: 'No summary available for this note' });

    const sentences = note.aiSummary.text.split('. ').slice(0, 5);
    const nodes = [];

    for (const sentence of sentences) {
      const newNode = await Node.create({
        noteId,
        title: sentence.slice(0, 20),
        snippet: sentence
      });
      nodes.push(newNode);
    }

    res.status(201).json(nodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNodes = async (req, res) => {
  try {
    const { noteId } = req.params;
    const nodes = await Node.find({ noteId });
    res.json(nodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateNode = async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { title,  snippet } = req.body;

    const node = await Node.findById(nodeId);
    if (!node) return res.status(404).json({ message: 'Node not found' });

    node.title = title || node.title;
    node.snippet = snippet || node.snippet;

    await node.save();
    res.json(node);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNode = async (req, res) => {
  try {
    const { nodeId } = req.params;

    const node = await Node.findById(nodeId);
    if (!node) return res.status(404).json({ message: 'Node not found' });

    await node.deleteOne();
    res.json({ message: 'Node deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
