import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Typography, useTheme } from '@mui/material'; // Changed from @material-ui/core

import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Checkbox,
  Tooltip,
  Fade,
  Box,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Tab,
  Tabs
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { format, isToday, isPast, isFuture } from 'date-fns';

const TaskList = ({ tasks, onToggleComplete, onDelete, onReorder }) => {
  const [filter, setFilter] = useState({
    search: "",
    category: "all",
    priority: "all"
  });
  const [activeTab, setActiveTab] = useState('all');

  const priorities = {
    low: { color: '#4caf50', label: 'Low' },
    medium: { color: '#ff9800', label: 'Medium' },
    high: { color: '#f44336', label: 'High' }
  };

  const categories = ['all', 'default', 'work', 'personal', 'shopping', 'health', 'education'];

  const filterTasks = (tasks) => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filter.search.toLowerCase());
      const matchesCategory = filter.category === 'all' || task.category === filter.category;
      const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;
      const matchesTab = activeTab === 'all' ||
        (activeTab === 'today' && task.dueDate && isToday(new Date(task.dueDate))) ||
        (activeTab === 'upcoming' && task.dueDate && isFuture(new Date(task.dueDate))) ||
        (activeTab === 'overdue' && task.dueDate && isPast(new Date(task.dueDate)) && !task.completed) ||
        (activeTab === 'completed' && task.completed);

      return matchesSearch && matchesCategory && matchesPriority && matchesTab;
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onReorder(items);
  };

  const filteredTasks = filterTasks(tasks);

  if (tasks.length === 0) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 5,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #f3f3f3 30%, #ffffff 90%)',
          borderRadius: 2
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary'
          }}
        >
          No tasks yet. Add one above!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              minWidth: 100,
            }
          }}
        >
          <Tab label="All Tasks" value="all" />
          <Tab label="Due Today" value="today" />
          <Tab label="Upcoming" value="upcoming" />
          <Tab label="Overdue" value="overdue" />
          <Tab label="Completed" value="completed" />
        </Tabs>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            label="Search tasks"
            variant="outlined"
            fullWidth
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filter.category}
              label="Category"
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filter.priority}
              label="Priority"
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              {Object.entries(priorities).map(([value, { label, color }]) => (
                <MenuItem key={value} value={value} sx={{ color }}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ width: '100%' }}
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{
                        mb: 1,
                        bgcolor: snapshot.isDragging ? 'action.selected' : (task.completed ? 'action.hover' : 'background.paper'),
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3
                        }
                      }}
                      secondaryAction={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <div {...provided.dragHandleProps}>
                            <IconButton>
                              <DragIndicatorIcon />
                            </IconButton>
                          </div>
                          <Tooltip title="Delete task" TransitionComponent={Fade} arrow>
                            <IconButton
                              edge="end"
                              onClick={() => onDelete(task._id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <Checkbox
                        edge="start"
                        checked={task.completed}
                        onChange={() => onToggleComplete(task)}
                        sx={{
                          mr: 2,
                          color: priorities[task.priority].color,
                          '&.Mui-checked': {
                            color: priorities[task.priority].color,
                          }
                        }}
                      />
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                textDecoration: task.completed ? 'line-through' : 'none',
                                color: task.completed ? 'text.secondary' : 'text.primary',
                                fontSize: '1.1rem'
                              }}
                            >
                              {task.title}
                            </Typography>
                            <Chip
                              label={task.priority}
                              size="small"
                              sx={{
                                backgroundColor: `${priorities[task.priority].color}22`,
                                color: priorities[task.priority].color,
                                borderRadius: '4px',
                                fontWeight: 'bold'
                              }}
                            />
                            <Chip
                              label={task.category}
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: '4px' }}
                            />
                            {task.dueDate && (
                              <Chip
                                label={format(new Date(task.dueDate), 'PPP')}
                                size="small"
                                color={
                                  isToday(new Date(task.dueDate))
                                    ? 'primary'
                                    : isPast(new Date(task.dueDate))
                                      ? 'error'
                                      : 'default'
                                }
                                variant="outlined"
                                sx={{ borderRadius: '4px' }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Collapse in={!!task.description}>
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 1,
                                color: 'text.secondary',
                                opacity: task.completed ? 0.7 : 1
                              }}
                            >
                              {task.description}
                            </Typography>
                          </Collapse>
                        }
                      />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {filteredTasks.length === 0 && (
                <Typography
                  textAlign="center"
                  color="text.secondary"
                  sx={{ py: 4 }}
                >
                  No tasks match your filters
                </Typography>
              )}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
}

export default TaskList;