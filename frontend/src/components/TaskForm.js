import React from "react";
import { 
  TextField, 
  Button, 
  Box, 
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl 
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddTaskIcon from "@mui/icons-material/AddTask";

function TaskForm({ newTask, setNewTask, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const priorities = [
    { value: 'low', label: 'Low', color: '#4caf50' },
    { value: 'medium', label: 'Medium', color: '#ff9800' },
    { value: 'high', label: 'High', color: '#f44336' }
  ];

  const categories = [
    'default',
    'work',
    'personal',
    'shopping',
    'health',
    'education'
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label="Task Title"
            variant="outlined"
            size="small"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Enter task title"
            required
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={newTask.priority}
              label="Priority"
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              {priorities.map(priority => (
                <MenuItem 
                  key={priority.value} 
                  value={priority.value}
                  sx={{ color: priority.color }}
                >
                  {priority.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            size="small"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Enter task description (optional)"
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newTask.category}
              label="Category"
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={newTask.dueDate}
              onChange={(date) => setNewTask({ ...newTask, dueDate: date })}
              renderInput={(params) => <TextField size="small" {...params} />}
              slotProps={{
                textField: {
                  size: 'small',
                }
              }}
            />
          </LocalizationProvider>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddTaskIcon />}
            sx={{ minWidth: 120 }}
          >
            Add Task
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default TaskForm;