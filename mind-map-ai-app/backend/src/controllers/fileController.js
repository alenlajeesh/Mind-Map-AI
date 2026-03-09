const multer = require('multer');
const path = require('path');
const Note = require('../models/Note');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // limit: 2MB
}).single('file');

exports.uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    const { noteId } = req.body;
    const note = await Note.findOne({ _id: noteId, userId: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const fileData = {
      fileName: req.file.filename,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      size: req.file.size
    };

    note.files.push(fileData);
    await note.save();

    res.status(200).json({ message: 'File uploaded', file: fileData });
  });
};

