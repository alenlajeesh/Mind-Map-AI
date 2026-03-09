const express = require('express');
const router = express.Router();
const { generateNoteSummary, generateNoteNodes } = require('../controllers/aiController');

router.post('/summary/:id', generateNoteSummary);

router.post('/nodes/:id', generateNoteNodes);

module.exports = router;

