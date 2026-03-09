const express = require('express');
const router = express.Router();
const { createNodes, getNodes, updateNode, deleteNode } = require('../controllers/nodeController');

const auth = require('../middleware/authMiddleware');

router.post('/nodes/:noteId/generate', auth, createNodes);

router.get('/nodes/:noteId', auth, getNodes);

router.put('/nodes/:nodeId', auth, updateNode);

router.delete('/nodes/:nodeId', auth, deleteNode);

module.exports = router;

