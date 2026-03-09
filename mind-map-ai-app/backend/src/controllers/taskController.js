const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
   
    const { title, description, startTime, endTime } = req.body;

    const newTask = new Task({
      userId: req.userId,
      title,
      description,
      startTime,
      endTime,
      status: "pending",
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error creating task' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks); // Make sure this is an array of objects
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, startTime, endTime, status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = title || task.title;
    task.description = description || task.description;
    task.startTime = startTime || task.startTime;
    task.endTime = endTime || task.endTime;
    task.status = status || task.status;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

