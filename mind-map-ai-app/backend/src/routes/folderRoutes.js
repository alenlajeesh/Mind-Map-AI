const express = require('express');
const router = express.Router();
const { createFolder, getFolders ,updateFolder,deleteFolder,getFolderById } = require('../controllers/folderController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createFolder);
router.get('/', auth, getFolders);
router.put('/:id', auth, updateFolder);
router.delete('/:id', auth, deleteFolder);
router.get('/:id', auth, getFolderById); 


module.exports = router;

