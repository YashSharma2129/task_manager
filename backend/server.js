const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const corsOptions = {
  origin: ["https://task-manager-cfox.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});

if (!process.env.MONGO_URI) {
  console.error("ERROR: Missing MONGO_URI in environment variables.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const taskRoutes = require("./routes/task.routes");
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
