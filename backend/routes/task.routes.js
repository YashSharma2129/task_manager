const express = require("express");
const Task = require("../models/Task.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({ 
      title, 
      description, 
      priority, 
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { 
      new: true,
      runValidators: true 
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});

module.exports = router;
