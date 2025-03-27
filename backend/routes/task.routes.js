const express = require("express");
const Task = require("../models/Task.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("Fetching tasks...");
    const tasks = await Task.find().sort({ createdAt: -1 });
    console.log(`Successfully fetched ${tasks.length} tasks`);
    res.json(tasks);
  } catch (error) {
    console.error("Error in GET /api/tasks:", error);
    res.status(500).json({ 
      message: "Error fetching tasks", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
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
    console.error("Error in POST /api/tasks:", error);
    res.status(500).json({ 
      message: "Error creating task", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
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
    console.error("Error in PUT /api/tasks/:id:", error);
    res.status(500).json({ 
      message: "Error updating task", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
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
    console.error("Error in DELETE /api/tasks/:id:", error);
    res.status(500).json({ 
      message: "Error deleting task", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

module.exports = router;
