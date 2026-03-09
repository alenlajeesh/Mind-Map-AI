const Note = require('../models/Note');
const Folder = require('../models/Folder');
const mongoose = require('mongoose');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { folderId, title, content } = req.body;

    const folder = await Folder.findOne({ _id: folderId, userId: req.userId });
    if (!folder) return res.status(403).json({ message: 'Folder not found or access denied' });

    const note = await Note.create({
      folderId,
      userId: req.userId,
      title,
      content,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all notes by folder
exports.getNotesByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const notes = await Note.find({ folderId, userId: req.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, userId: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.userId },
      { title, content, lastModified: new Date() },
      { new: true }
    );

    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
};

