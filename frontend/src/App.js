import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_URL from "./config/api.config";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskStatistics from "./components/TaskStatistics";
import Confetti from "./components/Confetti";
import { 
  Container, 
  Typography, 
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    priority: "medium",
    dueDate: null,
    category: "default" 
  });
  const [darkMode, setDarkMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [error, setError] = useState("");

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleError = (message) => {
    setError(message);
  };

  const clearError = () => {
    setError("");
  };

  const fetchTasks = useCallback(async () => {
    try {
      const result = await axios.get(API_URL);
      setTasks(result.data);
      clearError();
    } catch (err) {
      handleError("Failed to fetch tasks");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const showSuccess = (message) => {
    showSnackbar(message, "success");
  };

  const { fireConfetti } = Confetti();

  const addTask = async () => {
    if (!validateTask()) return;
    
    try {
      await axios.post(API_URL, newTask);
      resetTaskForm();
      fetchTasks();
      showSuccess("Task added successfully!");
    } catch (err) {
      handleError("Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
      showSuccess("Task deleted successfully!");
    } catch (err) {
      handleError("Failed to delete task");
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_URL}/${task._id}`, {
        ...task,
        completed: !task.completed,
      });
      fetchTasks();
      if (!task.completed) {
        fireConfetti();
      }
      showSuccess(task.completed ? "Task unmarked!" : "Task completed!");
    } catch (err) {
      handleError("Failed to update task");
    }
  };

  const onReorder = async (reorderedTasks) => {
    try {
      setTasks(reorderedTasks);
      await axios.put(`${API_URL}/reorder`, { tasks: reorderedTasks });
      showSuccess("Tasks reordered successfully!");
    } catch (err) {
      handleError("Failed to reorder tasks");
      fetchTasks();
    }
  };

  const validateTask = () => {
    if (!newTask.title.trim()) {
      handleError("Title is required");
      return false;
    }
    return true;
  };

  const resetTaskForm = () => {
    setNewTask({ title: "", description: "" });
    clearError();
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Task Manager
          </Typography>
          <IconButton onClick={toggleDarkMode} color="inherit" sx={{ ml: 2 }}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        <TaskStatistics tasks={tasks} theme={theme} />

        <TaskForm 
          newTask={newTask}
          setNewTask={setNewTask}
          onSubmit={addTask}
        />
        
        <TaskList 
          tasks={tasks}
          onToggleComplete={toggleComplete}
          onDelete={deleteTask}
          onReorder={onReorder}
        />

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={handleCloseSnackbar}
        >
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
