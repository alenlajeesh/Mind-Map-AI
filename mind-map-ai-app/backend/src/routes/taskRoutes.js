const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;

