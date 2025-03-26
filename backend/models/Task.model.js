const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['default', 'work', 'personal', 'shopping', 'health', 'education'],
    default: 'default'
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", TaskSchema);
