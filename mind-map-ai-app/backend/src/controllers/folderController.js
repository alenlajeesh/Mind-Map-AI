const Folder = require('../models/Folder');

exports.createFolder = async (req, res) => {
  try {
    const { title } = req.body;
    const folder = await Folder.create({ title, userId: req.userId });
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.userId });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    folder.title = req.body.title || folder.title;
    await folder.save();

    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: "Error updating folder" });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    await folder.deleteOne();
    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting folder" });
  }
};
exports.getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.userId });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


